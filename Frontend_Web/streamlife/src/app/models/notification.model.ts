export class NotificationModel {
    public imageUrl: string;
    public username: string;
    public message: string;

    constructor(imageUrl:string, username:string, message:string){
        this.imageUrl = imageUrl;
        this.username = username;
        this.message = message;
    }
  }
  