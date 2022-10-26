import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebRTCDialog } from 'src/app/shared/components/webRTC-dialog/webRTC-dialog.component';
@Component({
  selector: 'GoLive',
  templateUrl: './go-live.component.html',
  styleUrls: ['./go-live.component.scss']
})
export class GoLiveComponent implements OnInit {
 // private browser = <any> navigator;
  constructor(
    public dialog: MatDialog
  ) { }
  ngOnInit(): void {
  }
  /*
    TODO
    if socketConnected is true
  */
  async getLocalStream() {
    try {
      this.dialog.open(WebRTCDialog, {
        width: '100%',
        maxWidth: '510px',
        panelClass: 'fullwidth-management-dialog',
        data: {}
      });
      /*const stream = await this.browser.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: {
            min: 200,
            max: 200,
          },
          height: {
            min: 200,
            max: 200,
          },
        }
      });*/
     // const stream = await this.browser.mediaDevices.getDisplayMedia();
     // this.streamSuccess(stream)
    } catch(err: any) {
      console.log(err);
      console.log('catch mediaDevices', err.message);
    }
  }
  streamSuccess(stream: any) {
   /* this.el.nativeElement.srcObject = stream

    this.audioParams = { track: stream.getAudioTracks()[0], ...this.audioParams };
    this.videoParams = { track: stream.getVideoTracks()[0], ...this.videoParams };
    this.joinRoom();*/

  }
  goLive() {
//      if (this.socketConnected) {
        this.getLocalStream();
//      }
/*
    if (Object.keys(this.userId).length !== 0) {
    } else {
      this.openSignUpDialog();
    }
*/
  } 
}
