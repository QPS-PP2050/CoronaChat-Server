import { createWorker } from 'mediasoup';
import { config } from '../config';
import { Room } from './Room';
import { Peer } from './Peer';

import type { Worker } from 'mediasoup/lib/types';
import type { Socket } from 'socket.io';

export class WebRTC {

	// all mediasoup workers

	/**
	 * roomList
	 * {
	 *  room_id: Room {
	 *      id:
	 *      router:
	 *      peers: {
	 *          id:,
	 *          name:,
	 *          master: [boolean],
	 *          transports: [Map],
	 *          producers: [Map],
	 *          consumers: [Map],
	 *          rtpCapabilities:
	 *      }
	 *  }
	 * }
	 */

	public workers: Worker[];
	public nextMediasoupWorkerIdx: number;
	public roomList: Map<string, Room>;

	public constructor() {
		this.workers = [];
		this.nextMediasoupWorkerIdx = 0;
		this.roomList = new Map();
		void (async () => {
			await this.createWorkers();
		})();
	}

	public handleSignal(socket: Socket) {
		socket.on('createRoom', ({ room_id }) => {
			console.log('test');
			if (this.roomList.has(room_id)) {
				console.log('fail');
			} else {
				console.log('---created room--- ', room_id);
				let worker = this.getMediasoupWorker();
				this.roomList.set(room_id, new Room(room_id, worker, socket));
			}
		});

		socket.on('join-voice', ({
			room_id,
			name
		}, cb) => {

			console.log(`---user joined--- \"${room_id}\": ${name}`);
			if (!this.roomList.has(room_id)) {
				return cb({
					error: 'room does not exist'
				});
			}
			this.roomList.get(room_id)!.addPeer(new Peer(socket.id, name));
			socket.room_id = room_id;

			// cb(this.roomList.get(room_id)!.toJson());
		});

		socket.on('getProducers', () => {
			console.log(`---get producers--- name:${this.roomList.get(socket.room_id)!.getPeers().get(socket.id)!.name}`);
			// send all the current producer to newly joined member
			if (!this.roomList.has(socket.room_id)) return;
			let producerList = this.roomList.get(socket.room_id)!.getProducerListForPeer();// socket.id);

			socket.emit('newProducers', producerList);
		});

		socket.on('getRouterRtpCapabilities', (_, callback) => {
			console.log(`---get RouterRtpCapabilities--- name: ${this.roomList.get(socket.room_id)!.getPeers().get(socket.id)!.name}`);
			try {
				callback(this.roomList.get(socket.room_id)!.getRtpCapabilities());
			} catch (e) {
				callback({
					error: e.message
				});
			}

		});

		socket.on('createWebRtcTransport', async (_, callback) => {
			console.log(`---create webrtc transport--- name: ${this.roomList.get(socket.room_id)!.getPeers().get(socket.id)!.name}`);
			try {
				const {
					params
				} = await this.roomList.get(socket.room_id)!.createWebRtcTransport(socket.id);

				callback(params);
			} catch (err) {
				console.error(err);
				callback({
					error: err.message
				});
			}
		});

		socket.on('connectTransport', async ({
			transport_id,
			dtlsParameters
		}, callback) => {
			console.log(`---connect transport--- name: ${this.roomList.get(socket.room_id)!.getPeers().get(socket.id)!.name}`);
			if (!this.roomList.has(socket.room_id)) return;
			await this.roomList.get(socket.room_id)!.connectPeerTransport(socket.id, transport_id, dtlsParameters);

			callback('success');
		});

		socket.on('produce', async ({
			kind,
			rtpParameters,
			producerTransportId
		}, callback) => {

			if (!this.roomList.has(socket.room_id)) {
				return callback({ error: 'not is a room' });
			}

			let producer_id = await this.roomList.get(socket.room_id)!.produce(socket.id, producerTransportId, rtpParameters, kind);
			console.log(`---produce--- type: ${kind} name: ${this.roomList.get(socket.room_id)!.getPeers().get(socket.id)!.name} id: ${producer_id}`);
			callback({
				producer_id
			});
		});

		socket.on('consume', async ({
			consumerTransportId,
			producerId,
			rtpCapabilities
		}, callback) => {
			// TODO null handling
			let params = await this.roomList.get(socket.room_id)!.consume(socket.id, consumerTransportId, producerId, rtpCapabilities);

			console.log(`---consuming--- name: ${this.roomList.get(socket.room_id) && this.roomList.get(socket.room_id)!.getPeers().get(socket.id)!.name} prod_id:${producerId} consumer_id:${params!.id}`);
			callback(params);
		});

		socket.on('resume', (data, callback) => {

			// await consumer.resume();
			callback();
		});

		socket.on('getMyRoomInfo', (_, cb) => {
			cb(this.roomList.get(socket.room_id)!.toJson());
		});

		socket.on('disconnect', () => {
			console.log(`---disconnect--- name: ${this.roomList.get(socket.room_id) && this.roomList.get(socket.room_id)!.getPeers().get(socket.id)!.name}`);
			if (!socket.room_id) return;
			this.roomList.get(socket.room_id)!.removePeer(socket.id);
		});

		socket.on('producerClosed', ({
			producer_id
		}) => {
			console.log(`---producer close--- name: ${this.roomList.get(socket.room_id) && this.roomList.get(socket.room_id)!.getPeers().get(socket.id)!.name}`);
			this.roomList.get(socket.room_id)!.closeProducer(socket.id, producer_id);
		});

		socket.on('exitRoom', async (_, callback) => {
			console.log(`---exit room--- name: ${this.roomList.get(socket.room_id) && this.roomList.get(socket.room_id)!.getPeers().get(socket.id)!.name}`);
			if (!this.roomList.has(socket.room_id)) {
				callback({
					error: 'not currently in a room'
				});
				return;
			}
			// close transports
			await this.roomList.get(socket.room_id)!.removePeer(socket.id);
			if (this.roomList.get(socket.room_id)!.getPeers().size === 0) {
				this.roomList.delete(socket.room_id);
			}

			socket.room_id = '';


			callback('successfully exited room');
		});
	}

	public async createWorkers() {
		let {
			numWorkers
		} = config.mediasoup;

		for (let i = 0; i < numWorkers; i++) {
			let worker = await createWorker({
				logLevel: config.mediasoup.worker.logLevel,
				logTags: config.mediasoup.worker.logTags,
				rtcMinPort: config.mediasoup.worker.rtcMinPort,
				rtcMaxPort: config.mediasoup.worker.rtcMaxPort
			});

			worker.on('died', () => {
				console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid);
				setTimeout(() => process.exit(1), 2000);
			});
			this.workers.push(worker);

			// log worker resource usage
			/* setInterval(async () => {
				const usage = await worker.getResourceUsage();

				console.info('mediasoup Worker resource usage [pid:%d]: %o', worker.pid, usage);
			}, 120000);*/
		}
	}

	public room() {
		return Object.values(this.roomList).map((r: Room) => ({
			router: r.router.id,
			peers: Object.values(r.peers).map((p: Peer) => ({
				name: p.name
			})),
			id: r.id
		}));
	}

	/**
	 * Get next mediasoup Worker.
	 */
	public getMediasoupWorker() {
		const worker = this.workers[this.nextMediasoupWorkerIdx];

		if (++this.nextMediasoupWorkerIdx === this.workers.length) {
			this.nextMediasoupWorkerIdx = 0;
		}

		return worker;
	}

}
