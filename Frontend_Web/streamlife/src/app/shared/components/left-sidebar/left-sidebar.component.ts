import { Component, ViewChild, ChangeDetectorRef, Inject, ElementRef, HostListener, PLATFORM_ID } from '@angular/core';
import { Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { SignUpDialog } from '../sign-up-dialog/sign-up-dialog.component'
import { LoginDialog } from '../login-dialog/login-dialog.component';
import { ChangePasswordDialog } from '../change-password-dialog/change-password.component';
import { MyWalletDialog } from '../my-wallet-dialog/my-wallet.component';
import { GlobalConstants } from 'src/app/global_constant/global-constants';
import { UserService } from 'src/app/services/user.service';
import { PaymentService } from 'src/app/services/payment.service';
import Swal from 'sweetalert2';
import { FollowingService } from 'src/app/services/following.service';
import { StreamLifeService } from 'src/app/services/stream-life.service';
import { CookieService } from 'ngx-cookie-service';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser, Location } from '@angular/common';

declare var jQuery: any;

@Component({
  selector: 'page-left-sidebar',
  templateUrl: './left-sidebar.html'
})
export class PageLeftSidebar {
   isLoggedIn: boolean = false;
   profileImgUrl: string = "assets/images/no-avatar.png";
   public email: string = "";
   public username: string = "";
   public userId: string = "";
   public walletAmount: any = "";
   uploadImage: string | ArrayBuffer;
   public followingProfileImg: string = "";
   public followersProfileImg: string = "";
   leftSidebar: boolean = false; 
   public followers: any = [];
   public following: any = [];
   public streamerInfos: any = [];
   public isFollowerLive: boolean = false;
   public isFollowingLive: boolean = false;
   public totalFollowers: number = 0;
   public totalFollowing: number = 0;
   public isShowCount: boolean = false;
   public returnClass:boolean = true;
   public videoSrc: string;
   public roomID: string = "";
   public loader: boolean = false;
   isBrowser: boolean;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    public global: GlobalConstants,
    private userService: UserService,
    private paymentService: PaymentService,
    private followingService: FollowingService,
    private streamLifeService: StreamLifeService,
    private location: Location,
    private cookieService:CookieService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.userId = this.global.userId;
  }
  ngOnInit() {
    if(this.isBrowser){
      if(this.cookieService.get('user_info')){
        // this.isLoggedIn = false;      
        jQuery(".signup-btn").hide();
        jQuery(".login-btn").hide();
        jQuery(".logout-btn").show();
      } else {
        // this.isLoggedIn = true;    
        jQuery(".signup-btn").show();
        jQuery(".login-btn").show();
        jQuery(".logout-btn").hide();
      }
    }

    if (Object.keys(this.userId).length !== 0) {
      /**
       * Get Followers list
       */
      this.getFollowerLists();
      /**
       * Get Following list
       */
      this.getFollowingList();
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    this.followingService.followingUser.subscribe((followingUser) => {
      if(followingUser){
        this.totalFollowing++;
        this.getFollowingList();
      }
    })
  }
  getFollowerLists(){
    this.followingService.getfollowers({ "follower_id": this.userId, "key": "followers" }).subscribe((response) => {
      const arrayData: any = response.data;
      this.totalFollowers = arrayData.length;
      if (Object.keys(arrayData).length !== 0) {
      arrayData.forEach((key: any, val: any) => {
        this.streamLifeService.getOnlineUsers({ "user_id": key.user_id }).subscribe((response) => {        
          this.followers.push({
            id:0,
            username: response.data.username,
            imgUrl: response.data.file_name != '' ? response.data.file_name: "assets/images/no-avatar.png",
            isFollowerlive: response.data.online_status,
            follower_id: response.data.user_id
          });            
          //this.isFollowerLive = response.data.online_status;
          // this.followersProfileImg = response.data.file_name;
        }, (err) => {
          console.log(err);
        });
      });
      }
    }, (err) => {
      console.log(err);
    });
  }

  getFollowingList(){
    this.following = [];
    this.followingService.getfollowers({ "user_id": this.userId, "key": "following" }).subscribe((response) => {
      console.log(response.data);
      const arrayData: any = response.data;
      this.totalFollowing = arrayData.length;
      if (Object.keys(arrayData).length !== 0) {
      arrayData.forEach((key: any, val: any) => { 
        this.streamLifeService.getOnlineUsers({ "user_id": key.follower_id }).subscribe((response) => {  
          this.following.push({
            id:0,
            username: response.data.username,
            imgUrl: response.data.file_name != ''?response.data.file_name: "assets/images/no-avatar.png",
            isFollowingLive: response.data.online_status,
            followed_id: response.data.user_id 
          });
          // this.followingProfileImg = response.data.file_name;
        }, (err) => {
          console.log(err);
        });
      });
      }
    });
  }
 
  deleteFollowing(event ,following_id: string) {
    event.preventDefault();   
    this.loader = true;
    this.followingService.deletefollowing({ "user_id": this.userId, "following_id": following_id }).subscribe((response) => { 
      var index = this.following.findIndex((foll) => foll.followed_id == following_id);
      this.following.splice(index, 1);
      this.totalFollowing--;
      this.followingService.checkFollowing();
      this.loader = false;;
    }, (err) => {
      console.log(err);
    });
  }
  deleteFollower(event ,follower_id: string) {
    event.preventDefault();
    this.loader = true;
    this.followingService.deletefollower({ "user_id": this.userId, "follower_id": follower_id }).subscribe((response) => {       
      var index = this.followers.indexOf(event);
      this.followers.splice(index, 1);
      this.ngOnInit();
      this.loader = false;
    }, (err) => {
      console.log(err);
    });
  }
  clickLeftSidebar(){
    this.leftSidebar = !this.leftSidebar;
    this.isShowCount = this.isShowCount;
    document.body.classList.toggle('leftsidebar-show'); 
  }
  onEvent(event) {
    event.stopPropagation();
  }
  addCurrentStreamer(username: any){
    this.streamLifeService.getAllStreamersDummy().subscribe((response) => {
      let index = response.streamers.findIndex(x => x.username === username)
      this.location.replaceState('/' + JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].username); 
      this.videoSrc = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].videoSrc;
      this.roomID = JSON.parse(sessionStorage.getItem("streamerList")).streamers[index].user_id;
      sessionStorage.setItem("currentStreamer", String(index));
      var source = document.getElementById('streaming_video');
      source.setAttribute('src', this.videoSrc); 
    });
  }
}
