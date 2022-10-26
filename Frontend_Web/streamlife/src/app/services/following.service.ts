import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FollowingService {
  public followingUser = new BehaviorSubject<boolean>(false);
  public checkFollowingEvent = new BehaviorSubject<boolean>(false);
  constructor( private http: HttpClient) { }

  addfollowers(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/add-follower", requestData);
  }

  getfollowers(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-followers", requestData);
  }

  getSpecificFollower(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-specific-follower", requestData);
  }  
  
  deletefollowing(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/delete-following", requestData);
  }
  
  deletefollower(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/delete-follower", requestData);
  }
  incrementFollowing(){
    this.followingUser.next(true);
  }
  checkFollowing(){
    this.checkFollowingEvent.next(true);
  }
}
