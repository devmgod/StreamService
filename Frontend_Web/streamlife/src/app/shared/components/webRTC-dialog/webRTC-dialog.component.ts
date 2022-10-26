import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { GlobalConstants } from 'src/app/global_constant/global-constants';
import { HtmlElementService } from 'src/app/services/htmlElement.service';
import { filter } from 'rxjs/operators';
import { BehaviorSubjectHashMapAny } from 'src/app/services/behaviorSubjectHashMapAny.service';
import { WebRTCDeviceService } from 'src/app/services/webRTCDevice.service';
import { Device } from 'mediasoup-client';
declare var $: any;
@Component({
	selector: 'webRTC-dialog',
	templateUrl: './webRTC-dialog.html'
})
export class WebRTCDialog implements OnInit {
  public webRTCOptionsForm: FormGroup;
  public submitted: boolean = false;
  public catchError: boolean = false;
  public errorMessage: string = "";
  private localCamStream: any;
  private audioParams: any;
  private videoParams: any;
  private rtpCapabilities: any;
  private browser: any = <any>navigator;
  private device: any = {};
	private producerTransport: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private htmlElementService: HtmlElementService,
    private webRTCDeviceService: WebRTCDeviceService,
    private webRTCSocketService: BehaviorSubjectHashMapAny,
    public global: GlobalConstants,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeWebRTCOptionsForm();
    setTimeout(function() {
      console.log("ssss");
      $('.ps__rail-y').css("display","none");
      $(".subs").on("mousemove", function() {
        console.log("PPPP");
        $('.ps__rail-y').css("display","block");
      });
    }, 1000);
  }
  initializeWebRTCOptionsForm() {
    this.webRTCOptionsForm = this.formBuilder.group({
      streamOptions: ['', [Validators.required]]
    });
  }
  get f() { return this.webRTCOptionsForm.controls; }
  ngOnInit() {
    this.videoParams = {
      encodings: [{
        rid: 'r0',
        maxBitrate: 100000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r1',
        maxBitrate: 300000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r2',
        maxBitrate: 900000,
        scalabilityMode: 'S1T3',
      }],
      codecOptions: {
        videoGoogleStartBitrate: 1000
      }
    }
  }
  ////turn off sound on srcObject
  async onSubmit() {
    try {
      this.submitted = true;
      if (this.webRTCOptionsForm.value.streamOptions === "Webcam") {
        this.localCamStream = await this.browser.mediaDevices.getUserMedia({
          video: true,
          audio: { deviceId: { ideal: "communications" } }
        });
        if (this.localCamStream) {
          this.htmlElementService.get('streamScreen')
            .pipe(filter( (elem: HTMLElement) => elem != null))
            .subscribe((elem: HTMLElement) => {
              (<HTMLVideoElement>elem).srcObject = new MediaStream(this.localCamStream.getVideoTracks());
          });
        }
        this.streamSuccess(this.localCamStream); 
      }
      if (this.webRTCOptionsForm.value.streamOptions === "ScreenShare") {
        this.localCamStream = await this.browser.mediaDevices.getDisplayMedia({
          video: true
        //  audio: { deviceId: { ideal: "communications" } }
        });
        if (this.localCamStream) {
          this.htmlElementService.get('streamScreen')
            .pipe(filter( (elem: HTMLElement) => elem != null))
            .subscribe((elem: HTMLElement) => {
              (<HTMLVideoElement>elem).srcObject = new MediaStream(this.localCamStream.getVideoTracks());
          });
        }
        this.streamSuccess(this.localCamStream); 
      }
    } catch(err: any) {
      this.catchError = true;
      this.errorMessage = err.message;
    }   
  }
  streamSuccess(stream: any) { 
    this.audioParams = { track: stream.getAudioTracks()[0], ...this.audioParams };
    this.videoParams = { track: stream.getVideoTracks()[0], ...this.videoParams };
    this.webRTCDeviceService.AudioParams = this.audioParams;
    this.webRTCDeviceService.VideoParams = this.videoParams;
    this.joinRoom();
  }
  async joinRoom() {
    this.webRTCSocketService.get('webRTCSocket')
      .pipe(filter( (socket: any) => socket != null))
      .subscribe((socket: any) => {
        socket.emit('joinRoom', { roomName: this.global.userId });
    });
  }
}  
