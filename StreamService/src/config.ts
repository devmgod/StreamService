export class Config {
  private settings: any;
  private listenIp: string;
  private listenPort: number;
  private sslCrt: string;
  private sslKey: string;
  constructor() { 
    this.listenIp = '0.0.0.0';
    this.listenPort = 3000;
    this.sslCrt = 'domain.crt';
    this.sslKey = 'domain.key';
    this.settings = {
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
          'rtcp',
          // 'rtx',
          // 'bwe',
          // 'score',
          // 'simulcast',
          // 'svc'
        ],
      },
      router: {
        mediaCodecs: [
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
            parameters: {
              'x-google-start-bitrate': 1000
            }
          },
        ]
      },
      webRtcTransport: {
        listenIps: [
          {
            ip: "0.0.0.0",
            //announcedIp: "0.0.0.0",
             // announcedIp: '127.0.0.1',
            announcedIp: "20.232.180.71",
          }
        ],
        maxIncomingBitrate: 1500000,
        initialAvailableOutgoingBitrate: 1000000,
      }
    }
  }
  public get ListenIP() {
    return this.listenIp;
  }
  public get ListenPort() {
    return this.listenPort; 
  }
  public get SSLCert() {
    return this.sslCrt;
  }
  public get SSLKey() {
    return this.sslKey;
  }
  public get Settings() {
    return (this.settings)? this.settings : {status: false};
  }
}
