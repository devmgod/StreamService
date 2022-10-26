import { EventEmitter, Injectable, Output } from '@angular/core';
import { io } from "socket.io-client";
@Injectable({
  providedIn: 'root'
})
export class WebRTCSocketClient {
  private socket: any = {};
  private static _instance: WebRTCSocketClient;
  constructor() { 
    this.init("http://20.127.36.3:3000/mediasoup");
  }
  public get Socket() {
    return this.socket;
  }
  private init(url: string) {
    this.socket = io(url,{'reconnection': true,'reconnectionDelay': 500,'reconnectionAttempts':Infinity});
  }
  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}
export const WebRTCSocketClientInstance = WebRTCSocketClient.Instance;
