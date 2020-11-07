import { cpus } from 'os';
import type { WebRtcTransportOptions, RouterOptions, WorkerSettings } from 'mediasoup/lib/types';

interface MediaSoupConfig {
	listenIp: string;
	listenPort: number;
	sslCrt: string;
	sslKey: string;
	mediasoup: MediaSoupOptions;
}

interface MediaSoupOptions {
	numWorkers: number;
	worker: WorkerSettings;
	router: RouterOptions;
	webRtcTransport: WebRtcTransportOptions;
}

export const config: MediaSoupConfig = {
	listenIp: '0.0.0.0',
	listenPort: 3016,
	sslCrt: '../ssl/cert.pem',
	sslKey: '../ssl/key.pem',

	mediasoup: {
		// Worker settings
		numWorkers: Object.keys(cpus()).length,
		worker: {
			rtcMinPort: 10000,
			rtcMaxPort: 10100,
			logLevel: 'warn',
			logTags: [
				'info',
				'ice',
				'dtls',
				'rtp',
				'srtp',
				'rtcp'
				// 'rtx',
				// 'bwe',
				// 'score',
				// 'simulcast',
				// 'svc'
			]
		},
		// Router settings
		router: {
			mediaCodecs:
				[
					{
						kind: 'audio',
						mimeType: 'audio/opus',
						clockRate: 48000,
						channels: 2
					},
					{
						kind: 'video',
						mimeType: 'video/VP8',
						clockRate: 90000,
						parameters:
						{
							'x-google-start-bitrate': 1000
						}
					}
				]
		},
		// WebRtcTransport settings
		webRtcTransport: {
			listenIps: [
				{
					ip: '' // replace by public IP address
					// announcedIp: '192.168.20.200' // replace by public IP address
				}
			],
			initialAvailableOutgoingBitrate: 1000000
		}
	}
};
