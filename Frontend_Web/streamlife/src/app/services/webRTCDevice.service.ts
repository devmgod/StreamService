import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Device } from 'mediasoup-client';
import { BehaviorSubjectHashMapAny } from 'src/app/services/behaviorSubjectHashMapAny.service';
import { filter } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/global_constant/global-constants';
@Injectable({
  providedIn: 'root'
})
export class WebRTCDeviceService {
  private device: any = {};
  private rtpCapabilities: any;
	private producerTransport: any = {};
  private audioParams: any;
  private videoParams: any;
  constructor(
    private webRTCSocketService: BehaviorSubjectHashMapAny,
    public global: GlobalConstants,
  ) {
  }
  public set AudioParams(audioParams: any) { 
    this.audioParams = audioParams;
  }
  public set VideoParams(videoParams: any) { 
    this.videoParams = videoParams;
  }
  async createDevice(data: any) {
    try {
      this.device = new Device();
      await this.device.load({
        // see getRtpCapabilities() below
        routerRtpCapabilities: data.rtpCapabilities,
      });
      this.createSendTransport();
    } catch (error: any) {
      console.log('catch createDevice', error);
      if (error.name === 'UnsupportedError')
        console.warn('browser not supported');
    }
  }
  createSendTransport() {
    console.log("createSendTransport >");
    // see server's socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    this.webRTCSocketService.get('webRTCSocket')
      .pipe(filter( (socket: any) => socket != null))
      .subscribe((socket: any) => {
    socket.emit('createWebRtcTransport', { consumer: false }, ({ params }: any) => {
      // The server sends back params needed 
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error)
        return
      }

      console.log('createSendTransport params', params)

      // creates a new WebRTC Transport to send media
      // based on the server's producer transport params
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      try {
        this.producerTransport = this.device.createSendTransport(params)
        console.log("this.producerTransport ", this.producerTransport);
      } catch (err: any) { 
        console.log(err);
      }

      // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
      // this event is raised when a first call to transport.produce() is made
      // see connectSendTransport() below
      this.producerTransport.on('connect', async ({ dtlsParameters }: any, callback: any, errback: any) => {
        console.log("dtlsParameters >connect", dtlsParameters);
        try {
          // Signal local DTLS parameters to the server side transport
          // see server's socket.on('transport-connect', ...)
          await socket.emit('transport-connect', { dtlsParameters })

          // Tell the transport that parameters were transmitted.
          callback()

        } catch (error) {
          errback(error)
        }
      })

      this.producerTransport.on('produce', async (parameters: any, callback: any, errback: any) => {
        console.log(parameters)

        try {
          // tell the server to create a Producer
          // with the following parameters and produce
          // and expect back a server side producer id
          // see server's socket.on('transport-produce', ...)
          await socket.emit('transport-produce', {
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
          }, ({ id, producersExist }: any) => {
            console.log("id transport-produce", id);
            // Tell the transport that parameters were transmitted and provide it with the
            // server side producer's id.
            callback({ id })

           // if (producersExist) this.getProducers()
          })
          await socket.emit('createConsumer', this.global.userId);
        } catch (error) {
          errback(error)
        }
      })

      this.connectSendTransport()
    })
    });
  }
  async connectSendTransport() {
    console.log("connectSendTransport =================================>");
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above
    console.log("this.producerTransport ", this.producerTransport);
//    console.log("this.audioParams ", this.audioParams);
    console.log("this.videoParams ", this.videoParams);
//    const audioProducer = await this.producerTransport.produce(this.audioParams);
    const videoProducer = await this.producerTransport.produce(this.videoParams);
/*    audioProducer.on('trackended', () => {
      console.log('audio track ended')

      // close audio track
    })
    audioProducer.on('transportclose', () => {
      console.log('audio transport ended')

      // close audio track
    })
*/
    videoProducer.on('trackended', () => {
      console.log('video track ended')

      // close video track
    })
    videoProducer.on('transportclose', () => {
      console.log('video transport ended')

      // close video track
    })
  }
}
