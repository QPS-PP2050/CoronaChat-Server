import { config } from '../config';

import type { Socket } from 'socket.io';
import type { Router, Worker, DtlsState, DtlsParameters, RtpParameters, MediaKind, RtpCapabilities } from 'mediasoup/lib/types';
import type { Peer } from './Peer';


export class Room {

	public id: string;
	public router!: Router;
	public peers: Map<string, Peer>;
	public io: Socket;

	public constructor(room_id: string, worker: Worker, io: Socket) {
		this.id = room_id;
		const { mediaCodecs } = config.mediasoup.router;
		void worker.createRouter({
			mediaCodecs
		}).then((router: Router) => {
			this.router = router;
		});

		this.peers = new Map();
		this.io = io;
	}

	public addPeer(peer: Peer) {
		this.peers.set(peer.id, peer);
	}

	public getProducerListForPeer() {
		let producerList: Record<string, unknown>[] = [];
		console.log(this.peers);
		this.peers.forEach(peer => {
			peer.producers.forEach(producer => {
				producerList.push({
					producer_id: producer.id
				});
			});
		});
		return producerList;
	}

	public getRtpCapabilities() {
		return this.router.rtpCapabilities;
	}

	public async createWebRtcTransport(socket_id: string) {
		const {
			initialAvailableOutgoingBitrate
		} = config.mediasoup.webRtcTransport;

		const transport = await this.router.createWebRtcTransport({
			listenIps: config.mediasoup.webRtcTransport.listenIps,
			enableUdp: true,
			enableTcp: true,
			preferUdp: true,
			initialAvailableOutgoingBitrate
		});
		/*
		if (maxIncomingBitrate) {
			try {
				await transport.setMaxIncomingBitrate(maxIncomingBitrate);
			} catch (error) {}
		} */

		transport.on('dtlsstatechange', (dtlsState: DtlsState) => {

			if (dtlsState === 'closed') {
				console.log(`---transport close--- ${this.peers.get(socket_id)!.name} closed`);
				transport.close();
			}
		});

		transport.on('close', () => {
			console.log(`---transport close--- ${this.peers.get(socket_id)!.name} closed`);
		});
		console.log('---adding transport---', transport.id);
		this.peers.get(socket_id)!.addTransport(transport);
		return {
			params: {
				id: transport.id,
				iceParameters: transport.iceParameters,
				iceCandidates: transport.iceCandidates,
				dtlsParameters: transport.dtlsParameters
			}
		};
	}

	public async connectPeerTransport(socket_id: string, transport_id: string, dtlsParameters: DtlsParameters) {
		if (!this.peers.has(socket_id)) return;
		await this.peers.get(socket_id)!.connectTransport(transport_id, dtlsParameters);

	}

	public async produce(socket_id: string, producerTransportId: string, rtpParameters: RtpParameters, kind: MediaKind) {
		// handle undefined errors
		return new Promise(async resolve => {
			let producer = await this.peers.get(socket_id)!.createProducer(producerTransportId, rtpParameters, kind);
			resolve(producer.id);
			this.broadCast(socket_id, 'newProducers', [{
				producer_id: producer.id,
				producer_socket_id: socket_id
			}]);
		});
	}

	public async consume(socket_id: string, consumer_transport_id: string, producer_id: string, rtpCapabilities: RtpCapabilities) {
		// handle nulls
		if (!this.router.canConsume({
			producerId: producer_id,
			rtpCapabilities
		})) {
			console.error('can not consume');
			return;
		}

		let { consumer, params } = (await this.peers.get(socket_id)!.createConsumer(consumer_transport_id, producer_id, rtpCapabilities))!;

		consumer.on('producerclose', () => {
			console.log(`---consumer closed--- due to producerclose event  name:${this.peers.get(socket_id)!.name} consumer_id: ${consumer.id}`);
			this.peers.get(socket_id)!.removeConsumer(consumer.id);
			// tell client consumer is dead
			this.io.to(socket_id).emit('consumerClosed', {
				consumer_id: consumer.id
			});
		});

		return params;

	}

	public removePeer(socket_id: string) {
		this.peers.get(socket_id)!.close();
		this.peers.delete(socket_id);
	}

	public closeProducer(socket_id: string, producer_id: string) {
		this.peers.get(socket_id)!.closeProducer(producer_id);
	}

	public broadCast(socket_id: string, name: string, data: unknown) {
		for (let otherID of Array.from(this.peers.keys()).filter(id => id !== socket_id)) {
			this.send(otherID, name, data);
		}
	}

	public send(socket_id: string, name: string, data: unknown) {
		this.io.to(socket_id).emit(name, data);
	}

	public getPeers() {
		return this.peers;
	}


	public toJson() {
		return {
			id: this.id,
			peers: JSON.stringify([...this.peers])
		};
	}


}
