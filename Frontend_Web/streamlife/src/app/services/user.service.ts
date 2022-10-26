import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userInfo = new BehaviorSubject<any>(null);

  constructor( private http: HttpClient, 
    private cookieService:CookieService
) { }

  createUser(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/save-user", requestData);
  }
  loginUser(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/login-user", requestData);
  }
  getUserDetails(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-user-details", requestData);
  }
  updateStreamerInformation(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/update-streamer-information", requestData);
  }
  uploadProfilePic(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/upload-pic", requestData);
  }
  getUserProfileDetails(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-user-details", requestData);
  }
  changePassword(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/change-password", requestData);
  }
  sendPasswordResetLink(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/send-password-reset-link", requestData);
  }
  resetPassword(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/reset-password", requestData);
  }
  sendPayoutInformation(requestData: any) {
    let headers = new HttpHeaders({'X-Access-Token': this.cookieService.get('jwt-token')});
    return this.http.post(environment.baseApiUrl + "/send-payout-information", requestData, { headers: headers });
  } 

  observable = new Subject<any> ();

  getNotifications(msg: any) {
    console.log("msg:", msg);
      this.observable.next(msg);
      // observer.complete(); 
      // this.observable.error(new Error("error message"));
  }
  setUserInfo(userInfo: any){
    this.userInfo.next(userInfo);
  }
  
}
