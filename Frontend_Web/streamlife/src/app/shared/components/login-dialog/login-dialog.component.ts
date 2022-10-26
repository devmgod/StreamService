import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GlobalConstants } from 'src/app/global_constant/global-constants';
import { SignUpDialog } from '../../components/sign-up-dialog/sign-up-dialog.component';
import { ForgotPasswordDialog } from '../../components/forgot-password-dialog/forgot-password.component';
import { CookieService } from 'ngx-cookie-service';
declare var jQuery: any;
@Component({
	selector: 'login-dialog',
	templateUrl: './login-dialog.html'
})
export class LoginDialog implements OnInit {
  public hide: boolean = true;
  public loader: boolean = false;
  public loginForm: FormGroup;
  public submitted: boolean = false;
  public token: string = "";
	constructor(
    private router: Router, 
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    public global: GlobalConstants,
    public dialogRef: MatDialogRef<any>,
    private cookieService: CookieService
  ) {}
    hasRoute(route: string) {
      return this.router.url.includes(route);
    }
   ngOnInit() {
    this.buildLoginForm();
   }	
   buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  get f() { return this.loginForm.controls; }
  onSubmit(values){
    this.loader = true;
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.loader = false;
      return;
    }
    this.userService.loginUser(this.loginForm.value).subscribe((response) => {
      if(response.status){
          this.cookieService.set('jwt-token', response.token, 400);
          this.cookieService.set('user_info', JSON.stringify({ 
            user_id: response.data.user_id, 
            username: response.data.username, 
            email: response.data.email
          }), 400);
          this.userService.setUserInfo({ 
            user_id: response.data.user_id, 
            username: response.data.username, 
            name: response.data.name,
            email: response.data.email
          });
          Swal.fire({
            icon: 'success',
            title: 'Login successfully.',
            showConfirmButton: false,
            timer: 2500
          });        
          this.dialog.closeAll();          
      } else {
        Swal.fire({
          icon: 'error',
          title: response.message,
          showConfirmButton: false,
          timer: 2000
        })
      }
      this.loader = false;
     }, (err) => {
      console.log(err);
    });
  }  
  clickToForgotPassword(){
    this.dialogRef.close();
    this.openForgotPasswordDialog();
  }
  refresh(): void {
    window.location.reload();
  }
  openForgotPasswordDialog() { 
    const dialogRef = this.dialog.open(ForgotPasswordDialog, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'sign-up-dialog',
      data: {
        user_id: this.global.userId,
      }
    });
  }
}  
