import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../services/user.service';

@Injectable()
export class GlobalConstants {
    public userInfo: any = [];
    public username: string = "";
    public name: string = "";
    public userId: string = "";
    public userEmail: string = "";
    private productPrices: any = {};
    constructor(
        private cookiesService: CookieService,
        private userService: UserService
    ) { 
      this.userService.userInfo.subscribe((userInfo) =>{
        if(userInfo){
            this.name = userInfo.name;
            this.username = userInfo.username;
            this.userId = userInfo.user_id;
            this.userEmail = userInfo.email;
        }else{
            this.name = "";
            this.username = "";
            this.userId = "";
            this.userEmail = "";
        }
      })
        if(cookiesService.get('user_info')){
            this.userInfo = JSON.parse(cookiesService.get('user_info'));
            this.name = this.userInfo.name;
            this.username = this.userInfo.username;
            this.userId = this.userInfo.user_id;
            this.userEmail = this.userInfo.email;
        }
        this.productPrices = {
          1: "price_1LRmF9DN6wXRgmiFarVzuWQh",
          51: "price_1LSY5QDN6wXRgmiFRTqno3nW",
          52: "price_1LSY5zDN6wXRgmiFzbud2V86",
          53: "price_1LSY6UDN6wXRgmiFu3T0Pxz9",
          54: "price_1LSY6qDN6wXRgmiF3JIHEnnY",
          55: "price_1LSY7VDN6wXRgmiFt4mm60Uk",
          56: "price_1LSY8iDN6wXRgmiFz8FdcjTY",
          57: "price_1LSY90DN6wXRgmiFNguwjVqA",
          58: "price_1LSY9HDN6wXRgmiF9QCzZRoM",
          59: "price_1LSY9aDN6wXRgmiFw7Q8LKXP",
          60: "price_1LSY9uDN6wXRgmiFHMtMDA37",
          61: "price_1LSYAjDN6wXRgmiF3T6IExGG",
          62: "price_1LSYB1DN6wXRgmiFfXbmLQLw",
          63: "price_1LSYBcDN6wXRgmiFowjRfowp",
          64: "price_1LSYCFDN6wXRgmiFqrLbb4b1",
          65: "price_1LSYCdDN6wXRgmiFWkYQkc6q",
          66: "price_1LSYDRDN6wXRgmiFpUor4gKP",
          67: "price_1LSYD2DN6wXRgmiFke2vg4Km",
          68: "price_1LSYE8DN6wXRgmiFpMARdQes",
          69: "price_1LSYEQDN6wXRgmiFHzHtd0vo",
          70: "price_1LSYEzDN6wXRgmiFVbwMBgef",
          71: "price_1LSYFLDN6wXRgmiFoUR9di4W",
          72: "price_1LSYFkDN6wXRgmiFD2n465uk",
          73: "price_1LSYGXDN6wXRgmiFFdrqOgIn",
          74: "price_1LSYH0DN6wXRgmiFdCA1QYjj",
          75: "price_1LSYHNDN6wXRgmiFkrUlfxqR",
          76: "price_1LSYILDN6wXRgmiFer2hmFU2",
          77: "price_1LSYJGDN6wXRgmiFHq1llJlo",
          78: "price_1LSYJXDN6wXRgmiFLWK7PNKQ",
          79: "price_1LSYJyDN6wXRgmiFw8SWRqOT",
          80: "price_1LSYKJDN6wXRgmiFCF8iCmpt",
          81: "price_1LSYL3DN6wXRgmiF2ATqqsl3",
          82: "price_1LSYNUDN6wXRgmiFHmdtd7hB",
          83: "price_1LSYO2DN6wXRgmiF3xfSDPUJ",
          84: "price_1LSYOLDN6wXRgmiFvGMZt8dv",
          85: "price_1LSYOeDN6wXRgmiFL8zg8St9",
          86: "price_1LSYSHDN6wXRgmiF3T3znXv6",
          87: "price_1LSYSeDN6wXRgmiF3TsNRmGU",
          88: "price_1LSYT3DN6wXRgmiFdYjoVz3a",
          89: "price_1LSYTcDN6wXRgmiFJoT9qqgi",
          90: "price_1LSYU8DN6wXRgmiFUo9uC5Y9",
          91: "price_1LSYUYDN6wXRgmiFc5x1gNOc",
          92: "price_1LSYV1DN6wXRgmiFKXSM5kxx",
          93: "price_1LSYVwDN6wXRgmiFpQlJLUMB",
          94: "price_1LSYVcDN6wXRgmiFuBGUPaoO",
          95: "price_1LSYWgDN6wXRgmiF1U47cLDr",
          96: "price_1LSYX4DN6wXRgmiFmIhvuUg5",
          97: "price_1LSYXXDN6wXRgmiFAB8j6eQw",
          98: "price_1LSYXvDN6wXRgmiF3jzRMR4F",
          99: "price_1LSYYPDN6wXRgmiFqMwG7o0Y",
          100: "price_1LTAe5DN6wXRgmiF2zQNixsO",
          200: "price_1LTAkrDN6wXRgmiF1FZO5I92"
        }
    }
    public getProductPrices() {
      return this.productPrices;
    }   
}
