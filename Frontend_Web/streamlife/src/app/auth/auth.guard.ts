import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private cookieService: CookieService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.cookieService.get("userInfo")) {
            return true;
        }
        
        //this.router.navigateByUrl('/login');
        window.location.href = 'https://beta.mylive.is';
        return false;
    }
}

@Injectable()
export class NotAuthGuard implements CanActivate {
    constructor(private router: Router, private cookieService: CookieService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.cookieService.get("userInfo")) {
            return true;
        }
        this.router.navigateByUrl('/');
        return false;
    }
}
