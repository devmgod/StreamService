import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export class ViewerCountService {
  private viewerCount = new BehaviorSubject<number>(0);
  viewerCount$ = this.viewerCount.asObservable();
  constructor() {}
  setViewerCount(viewerCount: number) {
    this.viewerCount.next(viewerCount);
  }
  getViewerCount() {
    return this.viewerCount.getValue();
  }
}
