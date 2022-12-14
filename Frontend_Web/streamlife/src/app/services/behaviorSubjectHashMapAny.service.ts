import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BehaviorSubjectHashMapAny {
  protected elements: any;
  constructor() {
    this.elements = {};
  }
  public set(key: string, value: any): BehaviorSubject<any> {
    if (this.has(key)) {
      this.elements[key].next(value);
    } else {
      this.elements[key] = new BehaviorSubject(value);
    }
    return this.elements[key];
  }
  public get(key: string): BehaviorSubject<any> {
    if (!this.has(key)) {
      this.elements[key] = new BehaviorSubject(null);
    }
    return this.elements[key];
  }
  public delete(key: string) {
    if (this.has(key)) {
      this.elements[key].next(null);
      delete this.elements[key];
    }
  }
  public clear() {
    for (const key in Object.keys(this.elements)) {
      if (this.elements.hasOwnProperty(key)) {
        this.elements[key].next(null);
        delete this.elements[key];
      }
    }
    this.elements = {};
  }
  public has(key: string) {
    return (this.elements[key] instanceof BehaviorSubject);
  }
}
