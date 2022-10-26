import { AfterViewInit, OnInit, Component, ElementRef, Input, Renderer2, ViewChild, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { formatDate, isPlatformBrowser } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopDialog } from 'src/app/shared/components/shop-dialog/shop-dialog.component';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GlobalConstants } from 'src/app/global_constant/global-constants';
import { StreamLifeService } from 'src/app/services/stream-life.service';
import { FollowingService } from 'src/app/services/following.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignUpDialog } from '../../shared/components/sign-up-dialog/sign-up-dialog.component';
import { SocketClientInstance } from 'src/app/services/socket.service';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ViewerCountService } from 'src/app/services/viewerCount.service';
import { HtmlElementService } from 'src/app/services/htmlElement.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
declare var $: any;
@Component({
  selector: 'app-streamerpage',
  templateUrl: './streamerpage.component.html',
  styleUrls: ['./streamerpage.component.scss'],
})
export class StreamerpageComponent implements OnInit {
  @ViewChild('chatBtn', { read: ElementRef, static: false }) chatBtn: ElementRef;
  @ViewChild('stream_chat_box', { read: ElementRef, static: false }) stream_chat_box: ElementRef;
  @ViewChild('start_stream_button', { read: ElementRef, static: false }) start_stream_button: ElementRef;
  @ViewChild('start_publish_button', { read: ElementRef, static: false }) start_publish_button: ElementRef;
  @ViewChild('stop_publish_button', { read: ElementRef, static: false }) stop_publish_button: ElementRef;
  @ViewChild('msg_body', { read: ElementRef, static: false }) senderElem: ElementRef;
  @ViewChild('chatMessage') chatMessage;
  @ViewChild('stream_screen') public streamScreen: ElementRef;
  @ViewChild('chat_scrollbar') chatScrollbar: PerfectScrollbarComponent;
  public toggled: boolean = false;
  public notice: string = '';
  public ratingView: number;
  public form: FormGroup;
  public streamerUsername = "";
  public streamerProfilePic = "";
  public formChat: FormGroup;
  public streamerInfoForm: FormGroup;
  public profileImgUrl: string = "assets/images/no-avatar.png";
  public email: string = "";
  public name: string = "";
  public no_img_class = "no-img";
  public infoText: string = "";
  public currentDateTime = new Date();
  public streamName: string = "";
  public token: string = "";
  public urlParam: string = "";
  public streamSessionId: number = 0;
  public userId: string = "";
  public userName: string = "";
  public chatData: Array<any> = [];
  private url = "https://api.v2.streamlife.is";
  private socket: any;
  public viewerCount: number = 0;
  public isReadonly: boolean = false;
  public playTime;
  public timeout: any = undefined;
  public typing: boolean = false;
  public messages: any = [];
  public followers: any = [];
  public following: any = [];
  public totalFollowers: number = 0;
  public totalFollowing: number = 0;
  public _isDisabled: boolean = false;
  public isFollow: boolean = false;
  public isFollowText: string = "Follow";
  public followIconImg: string = "../../../../assets/images/Following.svg";
  public userData: any;
  public is_read = 'read';
  public roomID: string = "";
  public inputValue: string = "";
  public isReadonlyInfo: boolean = true;
  public isSaveBtnHide: boolean = false;
  public isEditBtnHide: boolean = true;
  public videoSrc: string;
  public message: string = '';
  public leftSidebar: boolean = false;
  public streamChatToggle: boolean = false;
  public loader: boolean = false; 
  isBrowser: boolean;
  constructor (
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private streamLifeService: StreamLifeService,
    private global: GlobalConstants,
    private followingService: FollowingService,
    private userService: UserService,
    private viewerCountService: ViewerCountService,
    private htmlElementService: HtmlElementService,
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.ratingView = 4;
    this.form = this.fb.group({
      ratingView: [4]
    });
    this.streamerInfoForm = this.fb.group({
      user_id: this.userId, 
      info_text: ['', [Validators.required, Validators.maxLength(256)]],
    });
    this.formChat = this.fb.group({
      chatUser: ['', Validators.required],
      chatMessage: ['', Validators.required],
    });
    let param_str = this.route.snapshot.paramMap.get('username');
    this.urlParam = undefined;
    if (param_str != undefined || param_str != null) {
      this.urlParam = param_str;
    }
  }
  get streamInfoF() { return this.streamerInfoForm.controls; }
  handleSelection(event) {
    this.message += event.char;
    $("#chat-message").val(this.message);
  }
  addEmoji(data: any) {
    this.chatMessage.nativeElement.value += data.emoji?.native;
    $("#chat-message").val(this.chatMessage.nativeElement.value);
  }
  emojiPreventClose($event: any) {
    $event.stopPropagation();
  }
  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
  clickLeftSidebar() {
    this.leftSidebar = !this.leftSidebar;
    document.body.classList.toggle('leftsidebar-show');
  }
  clickStreamChatToggle() {
    this.streamChatToggle = !this.streamChatToggle;
    document.body.classList.toggle('streamchat-colaps');
  }
  onEvent(event) {
    event.stopPropagation();
  }
  async getMessages(): Promise<void> { 
    this.streamLifeService.getMessages({ "room_id": this.roomID }).subscribe((response) => {
      const arrayData: any = response['message_data'];
      if (arrayData != null) {
        let message: any = {};
        arrayData.forEach((key: any, val: any) => {
          if (key.column == 'message_data:is_read') {
            if (key.$ == 1) {
              this.is_read = 'read';
            } else {
              this.is_read = '';
            }
          }
          if (key.column == "message_data:content") {
            let msgData = key.$.split(':');
            message = {
              msgid: key.key,
              name: msgData[0],
              messages: msgData[1],
              time: key.timestamp,
              is_read: this.is_read,
            }
            
          }
          if (key.column == 'message_data:sender_id') {
            message['profile_pic_url'] = response['image_data'][key.$];
            this.messages.push(message);
          }
        });
      }
      console.log("Messages: ", this.messages);
    }, (err) => {
      console.log("Error1 : ", err);
    });
  }
  async ngOnInit(): Promise<void> {
    this.userId = this.global.userId;
    this.userName = this.global.username;
    this.messages = [];
    this.socket = SocketClientInstance.Socket;
    if(this.isBrowser){
      let index = parseInt(sessionStorage.getItem("currentStreamer"));
      this.streamerUsername = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].username;  
      this.videoSrc = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].videoSrc;
      this.roomID = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].user_id;
      this.getStreamerInfo();
    }
    let ID = "";
    //this.changeDetectorRef.detach();
    this.viewerCountService.viewerCount$.subscribe((viewerCount) => {
      this.viewerCount = viewerCount;
      this.changeDetectorRef.detectChanges();
    });
    if (Object.keys(this.userId).length !== 0) {
      this.getUserInfo();
      this.getFollower(this.roomID);
      this.socket.emit("hello", {streamer: this.roomID, user_id: this.userId}); 
    } else {
      this._isDisabled  = false;
      this.socket.emit("loggedoff", {streamer: this.roomID}); 
    }
    this.startChat(this.roomID);
    await this.getMessages();

    this.followingService.checkFollowingEvent.subscribe((check) => {
      if(check){
        this.getFollower(this.roomID);
      }
    })
    this.socket.on('chat_message', (data) => {
      const arrayData: any = data['message_data'];
      let message: any;
      if (arrayData != null) {
        arrayData.forEach((key: any, val: any) => {
          if (key.column == 'message_data:is_read') {
            if (key.$ == 1) {
              this.is_read = 'read';
            } else {
              this.is_read = '';
            }
          }
          if (key.column == "message_data:content") {
            let msgData = key.$.split(':');
            message = {
              msgid: key.key,
              name: msgData[0],
              messages: msgData[1],
              time: key.timestamp,
              is_read: this.is_read
            };
            
          }
          if (key.column == 'message_data:sender_id') {
            message['profile_pic_url'] = data['image_data'][key.$];
            this.messages = [...this.messages,message];
            this.chatMessage.nativeElement.value = '';
          }
        });
      }
    });
/*
    this.socket.on('chat', (data) => {
      this.messages.push({
        msgid: 0,
        name: data.data.username,
        messages: data.data.message,
        time: this.currentDateTime.getTime(),
      });
      this.chatMessage.nativeElement.value = ' ';
    });
    this.socket.on('send data', (data) => {
      ID = data.id;
    });
*/
  }
  public ngAfterViewInit(): void {
    this.htmlElementService.set( 'streamScreen', this.streamScreen.nativeElement );
  }
  startChat(roomId: string) {
    if (this.messages == null || this.messages == undefined) {
      this.chatBtn.nativeElement.classList.add('d-none');
      this.stream_chat_box.nativeElement.classList.remove('d-none');
    }
    this.isReadonly = !this.isReadonly;
   /* this.socket.emit('join room', {
      socketId: this.socket.id,
      userId: this.userId,
      username: this.userName,
      roomId: roomId
    });*/
  }
  sendMessage(roomId: string, chatMessage: string) {
    if (Object.keys(this.userId).length !== 0) {
      if (chatMessage != "") {
        this.socket.emit('chat', {
          socketId: this.socket.id,
          userId: this.userId,
          roomId: roomId,
          message: chatMessage,
          username: this.userName
        });
        this.chatData = [{
          "room_id": roomId,
          "sender_id": this.userId,
          "content": this.userName + ":" + chatMessage,
          "is_read": '0',
        }];
        this.streamLifeService.saveMessage(this.chatData[0]).subscribe((response) => {
          console.log(response);
        }, (err) => {
          console.log("Error2 : ", err);
        });
      }    
    } else { 
      this.openSignUpDialog();
    }
  }
  timeoutFunction() {
    this.typing = false;
    this.socket.emit('typing', this.userName);
  }
  async scrollLeft() { 
    let index = parseInt(sessionStorage.getItem("currentStreamer"));
    if (index !== 0) {
      let index = parseInt(sessionStorage.getItem("currentStreamer")) - 1;
      this.location.replaceState('/' + JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].username);
      this.streamerUsername = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].username;  
      this.videoSrc = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].videoSrc;
      this.roomID = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].user_id;
      this.urlParam = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].username;
      const nextRoom = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index + 1].user_id;
      this.messages = [];
      await this.getMessages();
      sessionStorage.setItem("currentStreamer", String(index));
      this.getFollower(this.roomID);
      this.socket.emit("goodbye", {streamer: nextRoom, user_id: this.userId});
      this.socket.emit("hello", {streamer: this.roomID, user_id: this.userId});
      this.getStreamerInfo();
    }
  }
  async scrollRight() {
    const index = parseInt(sessionStorage.getItem("currentStreamer")) + 1;
    this.location.replaceState('/' + JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].username);
    this.streamerUsername = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].username;  
    this.videoSrc = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].videoSrc;
    this.roomID = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].user_id;
    this.urlParam = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].username;
    const prevRoom = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index - 1].user_id;
    this.messages = [];
    await this.getMessages();
    sessionStorage.setItem("currentStreamer", String(index));
    this.getFollower(this.roomID);
    this.socket.emit("goodbye", {streamer: prevRoom, user_id: this.userId});
    this.socket.emit("hello", {streamer: this.roomID, user_id: this.userId});
    this.getStreamerInfo();
  }
  mouseEnter() {
    document.getElementsByClassName("ps__rail-y")[2].classList.remove('hideScrollBars'); 
    setTimeout(() => {
      document.getElementsByClassName("ps__rail-y")[2].classList.add('hideScrollBars');
    }, 1000);
    document.getElementById('leftScroll').classList.add('showScrollButtons');
    document.getElementById('rightScroll').classList.add('showScrollButtons');   
  }
  mouseLeave() { 
    document.getElementsByClassName("ps__rail-y")[2].classList.remove('hideScrollBars');
    document.getElementById('leftScroll').classList.remove('showScrollButtons');
    document.getElementById('rightScroll').classList.remove('showScrollButtons');
  }
  mouseEnterScroll() {    
    if (!document.getElementById('leftScroll').classList.contains('showScrollButtons')) {
      document.getElementById('leftScroll').classList.add('showScrollButtons');
    } 
    if (!document.getElementById('rightScroll').classList.contains('showScrollButtons')) {
      document.getElementById('rightScroll').classList.add('showScrollButtons');
    } 
  }
  mouseWheelScroll(){
    document.getElementsByClassName("ps__rail-y")[2].classList.remove('hideScrollBars');
  }
  getStreamerInfo() {
    this.userService.getUserDetails({ "user_id": this.roomID }).subscribe((response) => {
      if (response.status) {
        this.streamerProfilePic = response.data.file_url != ""?response.data.file_url:"assets/images/no-avatar.png";
      } else {
        this.streamerProfilePic = 'assets/images/no-avatar.png';
      }
    }, (err) => {
      console.log("Error5 : ", err);
    });
  }
  getUserInfo() {
    this.userService.getUserDetails({ "user_id": this.userId }).subscribe((response) => {
      if (response.status) {
        this.profileImgUrl = response.data.file_url != ""?response.data.file_url:"assets/images/no-avatar.png";
        this.email = response.data.email;
        this.name = response.data.name;
        this.infoText = response.data.descriptions;
        this.no_img_class = '';
      } else {
        this.profileImgUrl = 'assets/images/no-avatar.png';
        this.email = "";
        this.name = "";
        this.no_img_class = this.no_img_class;
      }
    }, (err) => {
      console.log("Error5 : ", err);
    });
  }
  openInfoBox(text:string){
    this.setValue(text);
    this.isReadonlyInfo = !this.isReadonlyInfo;
    this.isSaveBtnHide = !this.isSaveBtnHide;
    this.isEditBtnHide = !this.isEditBtnHide;
  }
  setValue(text:string){
    this.streamerInfoForm.setValue({user_id: this.userId, info_text: text})
  }
  saveInfoText() {
    if(this.streamerInfoForm.value.info_text.length < 256){
      this.userService.updateStreamerInformation(this.streamerInfoForm.value).subscribe((response) => {
        if(response.status){
          Swal.fire({
            icon: 'success',
            title: response.message,
            showConfirmButton: false,
            timer: 2500
          });
          this.currentRouteReload();
          this.isReadonlyInfo = !this.isReadonlyInfo;
          this.isSaveBtnHide = !this.isSaveBtnHide;
          this.isEditBtnHide = !this.isEditBtnHide
        } else {
          Swal.fire({
            icon: 'info',
            title: response.message,
            showConfirmButton: false,
            timer: 2000
          })
        }
      }, (err) => {
        console.log("Error6 : ", err);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Description text limit(256) exceeded.',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  clickToFollow() {   
    this.loader = true;
    if (Object.keys(this.userId).length !== 0) {
      this.followingService.addfollowers({ "user_id": this.userId, "username": this.userName, "follower_id": JSON.parse(sessionStorage.getItem("streamerList")).streamers[JSON.parse(sessionStorage.getItem("currentStreamer"))].user_id }).subscribe((response) => {
        if (response.status) {
          Swal.fire({
            icon: 'success',
            title: response.message,
            showConfirmButton: false,
            timer: 2500
          });
          this.followingService.incrementFollowing();

          /** Send notification after payment successfuls */
          this.socket.emit('send notification', {
            socketId: this.socket.id,
            userId: this.global.userId,
            username: this.global.username,
            streamerId: '1339865e-2e3c-4d54-80c6-60aea0f9ad63',
            msg: this.global.username+' started following you.'
          });

          this.getFollower(this.roomID);
          this.loader = false;
        } else {
          Swal.fire({
            icon: 'info',
            title: response.message,
            showConfirmButton: false,
            timer: 2000
          })
        }
      }, (err) => {
        console.log("Error11 : ", err);
      });
    } else {
      this.openSignUpDialog();
    }
  }
  getFollower(follower_id: any){
    this.followingService.getSpecificFollower({ "user_id": this.userId, "follower_id": follower_id }).subscribe((response) => {   
      if (response.status === true) {
        this._isDisabled  = response.status;
        this.followIconImg = '../../../../assets/images/green-check.svg';
        this.isFollow = true;
        this.isFollowText = 'Following';
        // document.getElementById("follow-btn").classList.add('follow-btn-white');
        // document.getElementById("follow-btn").classList.remove('follow-btn-blue');
      } else {
        this._isDisabled  = response.status;
        this.isFollowText = 'Follow';
        this.followIconImg = '../../../../assets/images/Following.svg';
        this.isFollow = false;
        // document.getElementById("follow-btn").classList.remove('follow-btn-white');
        // document.getElementById("follow-btn").classList.add('follow-btn-blue');
      }
    }, (err) => {
      console.log(err);
    });
  }
  openSignUpDialog() {
    const dialogRef = this.dialog.open(SignUpDialog, {
      width: '815px',
      maxWidth: '90vw',
      panelClass: 'sign-up-dialog'
    });
  }
  OpenShopDialog(payment_for: string) { 
    this.userService.getUserDetails({ "username": this.urlParam }).subscribe((response) => {     
      if(response.status){
        if (Object.keys(this.userId).length !== 0) {
          const dialogRef = this.dialog.open(ShopDialog, {
            width: '100%',
            maxWidth: '600px',
            panelClass: 'fullwidth-management-dialog',
            data: {
              urlParam: this.urlParam,
              paid_to_user: response.data.user_id,
              payment_for: payment_for
            }
          });
        } else { 
          this.openSignUpDialog();
        }
      }
    }, (err) => {
    });   
  }
  currentRouteReload(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  reloadPage(event){
    if(event){
      this.ngOnInit();
    }
  }
  ngAfterViewChecked() {
    this.chatScrollbar.directiveRef.scrollToBottom();
  } 
  public ngOnDestroy() {
	  this.htmlElementService.delete('streamScreen');
  }
}
