import { EventEmitter, Injectable, Output } from '@angular/core';
import { io } from "socket.io-client";
@Injectable({
  providedIn: 'root'
})
export class SocketClient {
  private socket: any = {};
  private static _instance: SocketClient;
  constructor() { 
    this.init("https://api.v2.streamlife.is");
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
export const SocketClientInstance = SocketClient.Instance;
