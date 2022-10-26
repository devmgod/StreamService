import { EventEmitter, Injectable, Output } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messagesArray: any = [];
  constructor() {
    this.messagesArray = [];
  }
  setMessages(message: any) {
    this.messagesArray.push({
      msgid: message.msgid,
      name: message.name, 
      messages: message.messages, 
      time: message.time
    });
  }
  getMessages() {
    return this.messagesArray;
  }
  deleteMessage(index: number) { 
    this.messagesArray.splice(index, 1);
  }
}
