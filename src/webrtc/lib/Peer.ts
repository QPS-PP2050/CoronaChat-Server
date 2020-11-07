
import type { Consumer, Producer, Transport, DtlsParameters, MediaKind, RtpCapabilities, RtpParameters } from 'mediasoup/lib/types';

export class Peer {

	public id: string;
	public name: string;
	public transports: Map<string, Transport>;
	public consumers: Map<string, Consumer>;
	public producers: Map<string, Producer>;

	public constructor(socket_id: string, name: string) {
		this.id = socket_id;
		this.name = name;
		this.transports = new Map<string, Transport>();
		this.consumers = new Map<string, Consumer>();
		this.producers = new Map<string, Producer>();
	}


	public addTransport(transport: Transport) {
		this.transports.set(transport.id, transport);
	}

	public async connectTransport(transport_id: string, dtlsParameters: DtlsParameters) {
		if (!this.transports.has(transport_id)) return;
		await this.transports.get(transport_id)!.connect({
			dtlsParameters
		});
	}

	public async createProducer(producerTransportId: string, rtpParameters: RtpParameters, kind: MediaKind) {
		// TODO handle null errors
		let producer = await this.transports.get(producerTransportId)!.produce({
			kind,
			rtpParameters
		});

		this.producers.set(producer.id, producer);

		producer.on('transportclose', () => {
			console.log(`---producer transport close--- name: ${this.name} consumer_id: ${producer.id}`);
			producer.close();
			this.producers.delete(producer.id);

		});

		return producer;
	}

	public async createConsumer(consumer_transport_id: string, producer_id: string, rtpCapabilities: RtpCapabilities) {
		let consumerTransport = this.transports.get(consumer_transport_id);

		let consumer: Consumer | null = null;
		try {
			consumer = await consumerTransport!.consume({
				producerId: producer_id,
				rtpCapabilities,
				paused: false // producer.kind === 'video',
			});
		} catch (error) {
			console.error('consume failed', error);
			return;
		}

		if (consumer.type === 'simulcast') {
			await consumer.setPreferredLayers({
				spatialLayer: 2,
				temporalLayer: 2
			});
		}

		this.consumers.set(consumer.id, consumer);

		consumer.on('transportclose', () => {
			console.log(`---consumer transport close--- name: ${this.name} consumer_id: ${consumer!.id}`);
			this.consumers.delete(consumer!.id);
		});


		return {
			consumer,
			params: {
				producerId: producer_id,
				id: consumer.id,
				kind: consumer.kind,
				rtpParameters: consumer.rtpParameters,
				type: consumer.type,
				producerPaused: consumer.producerPaused
			}
		};
	}

	public closeProducer(producer_id: string) {
		try {
			this.producers.get(producer_id)!.close();
		} catch (e) {
			console.warn(e);
		}


		this.producers.delete(producer_id);
	}

	public getProducer(producer_id: string) {
		return this.producers.get(producer_id);
	}

	public close() {
		this.transports.forEach(transport => transport.close());
	}

	public removeConsumer(consumer_id: string) {
		this.consumers.delete(consumer_id);
	}

}
