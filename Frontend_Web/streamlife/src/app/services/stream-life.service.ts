import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { _throw as throwError } from 'rxjs/observable/throw';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { NotificationModel } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class StreamLifeService {
  constructor( 
    private http:HttpClient, 
    private cookieService:CookieService
  ) { }
  getMessages(requestData: any) {
    return this.http.post(environment.baseApiUrl + "/get-message", requestData);
  }
  saveMessage(requestData: any) {
    let headers = new HttpHeaders({'X-Access-Token': this.cookieService.get('jwt-token')});
    return this.http.post(environment.baseApiUrl + "/save-message", requestData, { headers: headers });
  } 
  updateMessage(requestData: any) {
    return this.http.post(environment.baseApiUrl + "/update-message", requestData);
  }
  getNotifications(requestData: any) {
    let headers = new HttpHeaders({'X-Access-Token': this.cookieService.get('jwt-token')});
    return this.http.post(environment.baseApiUrl + "/get-notifications", requestData, { headers: headers }).pipe(
      map((response: any) => {
        if(response['status']){ 
          const notifications:Array<NotificationModel> = [];
          response['data'].map((notificationString) => {
            let notificationObj = JSON.parse(notificationString);
            let notificationModel = new NotificationModel(notificationObj.pic_id,notificationObj.username, notificationObj.message);
            notifications.push(notificationModel);
          })         
          return notifications;
        }
        else {
          return [];
        }
      }));
  }
  deleteNotifications(requestData: any) {
    let headers = new HttpHeaders({'X-Access-Token': this.cookieService.get('jwt-token')});
    return this.http.post(environment.baseApiUrl + "/delete-notifications", requestData, { headers: headers });
  }
  saveStream(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/save-stream", requestData);
  }
  getAllStreamersDummy(): Observable<any> {
    return this.http.get<any>('assets/json/dummy.json').pipe(
      map((data) => data),
      catchError((error) => throwError(error))
    );
  }
  getAllStreamers(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-all-streamer", requestData);
  }
  uploadStreamingPic(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/upload-streaming-image", requestData);
  }
  getOnlineUsers(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-online-user", requestData);
  }
  getTopMostStreamerData(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/streamer-top-most-data", requestData);
  }
}
