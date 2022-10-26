import { Component, NgZone, OnDestroy, ViewChild, Inject, ElementRef, HostListener, Output, EventEmitter, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { SignUpDialog } from '../../components/sign-up-dialog/sign-up-dialog.component'
import { LoginDialog } from '../../components/login-dialog/login-dialog.component';
import { ChangePasswordDialog } from '../../components/change-password-dialog/change-password.component';
import { ChangeBankInformationDialog } from '../../components/change-bank-information-dialog/change-bank-information.component';
import { MyWalletDialog } from '../../components/my-wallet-dialog/my-wallet.component';
import { GlobalConstants } from 'src/app/global_constant/global-constants';
import { UserService } from 'src/app/services/user.service';
import { PaymentService } from 'src/app/services/payment.service';
import Swal from 'sweetalert2';
import { FollowingService } from 'src/app/services/following.service';
import { Observable } from 'rxjs';
import { StreamLifeService } from 'src/app/services/stream-life.service';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser, Location } from '@angular/common';
import { SocketClientInstance } from 'src/app/services/socket.service';
import { WebRTCSocketClientInstance } from 'src/app/services/socketWebRTC.service';
import { ViewerCountService } from 'src/app/services/viewerCount.service';
import { WebRTCDeviceService } from 'src/app/services/webRTCDevice.service';
import { BehaviorSubjectHashMapAny } from 'src/app/services/behaviorSubjectHashMapAny.service';
import { NotificationModel } from 'src/app//models/notification.model';
import { io } from "socket.io-client";
import { filter } from 'rxjs/operators';

declare var jQuery: any;
@Component({
  selector: 'page-header',
  templateUrl: './header.html'
})
export class PageHeader {
  isLoggedIn: boolean = false;
  profileImgUrl: string = "assets/images/no-avatar.png";
  public email: string = "";
  public name: string = "";
  private socket: any = {};
  public nTUsername: string = this.global.username;
  public username: string = "";
  public no_img_class = "no-img";
  public userId: string = "";
  public walletAmount: any = "";
  uploadImage: string | ArrayBuffer;
  public followingProfileImg: string = "";
  public followersProfileImg: string = "";
  public leftSidebar: boolean = false;
  public isHideNotiPanel: boolean = true;
  public followers: any = [];
  public following: any = [];
  public streamerInfos: any = [];
  public isFollowerLive: boolean = false;
  public isFollowingLive: boolean = false;
  public totalFollowers: number = 0;
  public totalFollowing: number = 0;
  public totalTipsCount: number = 0;
  public isShowCount: boolean = false;
  public totalSubscribersCount: number = 0;
  public notificationData: Array<NotificationModel> = [];
  public streamChatToggle: boolean = false;
  public notificationCount: number = 0;
  public isShowNotificationIcon: boolean = false;
  private webRTCSocket: any = {};
  private socketConnected: boolean = false;
  @ViewChild('followCarat', { static: false }) public followCarat: ElementRef;
  @ViewChild('namebutton', { read: ElementRef, static: false }) namebutton: ElementRef;
  @Output() reloadPageEvent = new EventEmitter<boolean>();
  isBrowser: boolean;
  constructor(
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private router: Router,
    public dialog: MatDialog,
    public global: GlobalConstants,
    private userService: UserService,
    private paymentService: PaymentService,
    private followingService: FollowingService,
    private streamLifeService: StreamLifeService,
    private viewerCountService: ViewerCountService,
    private webRTCDeviceService: WebRTCDeviceService,
    private webRTCSocketService: BehaviorSubjectHashMapAny,
    private changeDetectorRef: ChangeDetectorRef,
    private ElByClassName: ElementRef,
    private location: Location,
    private cookieService: CookieService,
    private readonly ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngAfterViewInit() {}
  async ngOnInit() {
    this.userId = this.global.userId;
    let index = 0;
    if (this.isBrowser) {
      this.streamLifeService.getAllStreamersDummy().subscribe((response) => {
        index = parseInt(sessionStorage.getItem("currentStreamer"));
        if(isNaN(index)){
          sessionStorage.setItem('currentStreamer', '0');
          sessionStorage.setItem('streamerList', JSON.stringify(response));
          this.location.replaceState("/" + response.streamers[0].username);
        } else {
          this.location.replaceState("/" + response.streamers[index].username);
        }
      });
    }
    let roomID;
    if (this.isBrowser) {
      index = parseInt(sessionStorage.getItem("currentStreamer"));
    console.log(`INDEX:  ${index}`);
    if (!isNaN(index)) {
      console.log("INSIDE");
      roomID = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].user_id;
      console.log(roomID);
      this.socket = SocketClientInstance.Socket;
      this.socket.on("connect", () => {
        this.socket.emit("notify", {user_id: this.userId}); 
      });
      this.socket.on("viewCount", async (data) => {
        console.log(data);
        if (data.user_id !== this.userId) {
          this.viewerCountService.setViewerCount(data.viewerCount);
        }
      });
      this.socket.on("notification", async (data:any) => {
        const notificationModel = new NotificationModel(data['pic_id'],data['username'],data['message']);
        this.notificationData = [notificationModel,...this.notificationData];
        const snd = new Audio('assets/notification.mp3');
        this.notificationCount++;
        console.log(Number(data.amount));
        if (data.amount) {
          this.walletAmount = (Number(data.amount) / Math.pow(10,2)).toFixed(2);
        }
        if (data.tips) {
          this.totalTipsCount = Number(data.tips);
        }
        this.changeDetectorRef.detectChanges();
        snd.play();
      });
      const webRTCSocket = WebRTCSocketClientInstance.Socket;
      webRTCSocket.emit("test","test");
      
      this.webRTCSocketService.set('webRTCSocket', webRTCSocket); 
      this.webRTCSocketService.get('webRTCSocket')
        .pipe(filter( (socket: any) => socket != null))
        .subscribe((socket: any) => {
          socket.on('connect_error', (err) => {
            console.log(`connect_error due to=======> ${err.message}`);
            try {
              socket.io.opts.transports = ["polling", "websocket"];
            } catch (err: any) {
              this.socketConnected = false;
            }
          });
          socket.on("roomJoined", async (data:any) => {
            console.log("ROOM JOINED");
            this.webRTCDeviceService.createDevice(data);
          });
          socket.on('connection-success', ({ socketId }) => {
            console.log(socketId);
            this.socketConnected = true;
          });
      });
    }
    const cookieUserInfoStr = this.cookieService.get('user_info');
    if (cookieUserInfoStr) {
      this.isLoggedIn = true;
      const cookieUserInfo = JSON.parse(cookieUserInfoStr);
      this.userId = cookieUserInfo.user_id;    
    } else { 
      this.isLoggedIn = false;    
    }
    if (this.userId != "") {
      this.getUserInfo();
      this.getWalletBalance();
    }
    if (Object.keys(this.userId).length !== 0) {
      this.getNotifications();
      this.followingService.getfollowers({ "follower_id": this.userId, "key": "followers" }).subscribe((response) => {
        const arrayData: any = response.data;
        this.totalFollowers = arrayData.length;  
        if (Object.keys(arrayData).length !== 0) {
        arrayData.forEach((key: any, val: any) => {
          this.streamLifeService.getOnlineUsers({ "user_id": key.user_id }).subscribe((response) => {
            this.followers.push({
              username: response.data.username,
              imgUrl: response.data.file_name != '' ? response.data.file_name : "assets/images/no-avatar.png",
              isFollowerlive: response.data.online_status,
            });
          }, (err) => {
            console.log(err);
          });
        });
        }
      }, (err) => {
        console.log(err);
      });
      this.followingService.getfollowers({ "user_id": this.userId, "key": "following" }).subscribe((response) => {
        const arrayData: any = response.data;
        this.totalFollowing = arrayData.length;
        if (Object.keys(arrayData).length !== 0) {
        arrayData.forEach((key: any, val: any) => {
          this.streamLifeService.getOnlineUsers({ "user_id": key.follower_id }).subscribe((response) => {
            this.following.push({
              username: response.data.username,
              imgUrl: response.data.file_name != '' ? response.data.file_name : "assets/images/no-avatar.png",
              isFollowingLive: response.data.online_status,
            });
          }, (err) => {
            console.log(err);
          });
        });
        }
      }, (err) => {
        console.log(err);
      });
    }
    }
  }
  getUserInfo() {
    this.userService.getUserDetails({ "user_id": this.userId }).subscribe((response) => {
      if (response.status) {
        this.profileImgUrl = response.data.file_url != "" ? response.data.file_url : "assets/images/no-avatar.png";
    if (this.isBrowser) {
        sessionStorage.setItem('profileImage', this.profileImgUrl);
    }
        this.email = response.data.email;
        this.username = response.data.username;
        this.no_img_class = '';
      } else {
        this.profileImgUrl = 'assets/images/no-avatar.png';
    if (this.isBrowser) {
        sessionStorage.setItem('profileImage', this.profileImgUrl);
    }
        this.email = "";
        this.username = "";
        this.no_img_class = this.no_img_class;
      }
    }, (err) => {
      console.log(err);
    });
  }
  getNotifications() {   
    this.streamLifeService.getNotifications({ "user_id": this.userId }).subscribe((notifications) => {
      this.notificationData = [...notifications];
      this.notificationCount = this.notificationData.length;
    })
  }
  deleteNotifications(){
    this.streamLifeService.deleteNotifications({ "user_id": this.userId }).subscribe((response) => {
      if (response['status']) {
        console.log('Deleted Successfully');
        this.getNotifications();
      }else{
        console.log('something went wrong please try again later');
      }
    });
  }
  clickStreamChatToggle(event:any) {
    this.streamChatToggle = !this.streamChatToggle;
    document.body.classList.toggle('streamchat-colaps');
    document.getElementById("streamingArea").classList.toggle('streamAreaHeight');
    // document.getElementById("streamHeaderText").classList.toggle('streamHeaderDisplay');
    // document.getElementById("streamHeaderDivider").classList.toggle('streamHeaderDisplay');
    // event.target.classList.toggle('streamchat-trigger');
    document.getElementById("streamChatCarat").classList.toggle('streamchat-trigger');
  }
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
  openSignUpDialog() {
    const dialogRef = this.dialog.open(SignUpDialog, {
      width: '815px',
      maxWidth: '90vw',
      panelClass: 'sign-up-dialog',
    });
  }
  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'sign-up-dialog'
    });
    dialogRef.afterClosed().subscribe(() => { 
      this.ngOnInit();
      this.reloadPageEvent.emit(true); 
    });
  }
  onSelectFile(event) {
    console.log(event.target.files);
    let formData = new FormData();
    formData.append("pic", event.target.files[0]);
    formData.append("user_id", this.userId);
    if (event.target.files && event.target.files[0]) {
      const blobData =  event.target.files[0];
      this.userService.uploadProfilePic(formData).subscribe((response) => {
        if (response.status) {
          Swal.fire({
            icon: 'success',
            title: response.message,
            showConfirmButton: false,
            timer: 2500
          });
          this.profileImgUrl = response.imgUrl;
          if (this.isBrowser) {
                sessionStorage.setItem('profileImage', this.profileImgUrl);
          }
          var reader = new FileReader();
          reader.readAsDataURL(blobData); // read file as data url
          reader.onload = (event) => { // called once readAsDataURL is completed
            this.uploadImage = event.target.result;
          }
        } else {
          Swal.fire({
            icon: 'info',
            title: response.message,
            showConfirmButton: false,
            timer: 2500
          });
          
        }
        this.reloadPageEvent.emit(true);
      }, (err) => {
        console.log(err);
        if (err.status === 413) { 
          Swal.fire({
            icon: 'info',
            title: err.statusText + ". Size limit is 30 MB.",
            showConfirmButton: false,
            timer: 2500
          });
        }
      });
    }
  }
  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialog, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'sign-up-dialog',
      data: {
        user_id: this.userId,
      }
    });
  }
  getWalletBalance() {
    this.paymentService.getTotalBalance({ "user_id": this.userId }).subscribe((response) => {
      if (response.status) {
        this.walletAmount = (response.data.balance / Math.pow(10,2)).toFixed(2);
        this.totalTipsCount = !response.data.tips_amount ? 0 : response.data.tips_amount;
      } else {
        this.walletAmount = (0.00).toFixed(2);
      }
    }, (err) => {
      console.log(err);
    });
  }
  openChangeBankInformationDialog(){
    const dialogRef = this.dialog.open(ChangeBankInformationDialog, {
      width: '100%',
      maxWidth: '600px',
      panelClass: 'fullwidth-management-dialog',
      data: {
        user_id: this.userId,
      }
    });
  }
  doLogout() {
    let currentStreamer = "";
    if (this.isBrowser) {
      const index = parseInt(sessionStorage.getItem("currentStreamer"));
      currentStreamer = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].user_id
    }
    this.socket.emit("goodbye", {streamer: currentStreamer, user_id: this.userId});
    this.cookieService.deleteAll();
    this.userService.setUserInfo(null);
    this.ngOnInit();
    this.reloadPageEvent.emit(true);
  }
  clickLeftSidebar(event:any) { 
    this.leftSidebar = !this.leftSidebar;
    this.isShowCount = this.isShowCount;
    document.body.classList.toggle('leftsidebar-show');
    // event.target.classList.toggle('streamchat-trigger');
    document.getElementById("followCarat").classList.toggle('streamchat-trigger');
  }
  onEvent(event) {
    event.stopPropagation();
  }
}
