import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private userService: UserService,
    private cookieService: CookieService
  ) { }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  
  login(userData: any) {
    this.userService.loginUser(userData).subscribe((response) => {
      if(response.status){
        this.cookieService.set('jwt-token', response.token);
        this.cookieService.set('user_info', JSON.stringify({ user_id: response.data[0].user_id, name: response.data[0].name }));
       
        this.loggedIn.next(true);
      }else{        
        this.loggedIn.next(false);
      }
     }, (err) => {
      console.log(err);
    });
  }
  logout() {
    this.loggedIn.next(false);    
    this.cookieService.deleteAll();
  }

}
