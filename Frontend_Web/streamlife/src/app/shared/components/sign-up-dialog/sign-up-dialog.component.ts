import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MustMatch } from 'src/app/_helper/must-match.validator';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
declare var jQuery: any;
@Component({
  selector: 'sign-up-dialog',
  templateUrl: './sign-up-dialog.html'
})
// tslint:disable-next-line: component-class-suffix
export class SignUpDialog implements OnInit {
  public years: any = [];
  public months: any = [];
  public days: any = [];
  public loader: boolean = false;
  public registerForm: FormGroup;
  public submitted: boolean = false;
  public validatorAlert: boolean = false;
  public isRequired:boolean;
  selectedValue: number = 30;  
  constructor(
    private router: Router, 
    public dialog: MatDialog,    
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService
  ) { }
  /**
   * Check if the router url contains the specified route
   *
   * @param {string} route
   * @returns
   * @memberof MyComponent
   */
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
  /**
   * on init
   */
  ngOnInit() {
    this.buildRegisterForm();
    let currentYear: number = new Date().getFullYear();
    for(let i = (currentYear -50); i < (currentYear + 50); i++) {
      this.years.push(i);
    }
    for(let i = 1; i < 13; i++) {
      this.months.push(i);
    }
    for(let j = 1; j < 32; j++) {
      this.days.push(j);
    }
  }
  public numberRegEx = /\-?\d*\.?\d{1,2}/;
  public regexPatterns = {
    days: "(0?[1-9]|[12][0-9]|3[01])",
    month: "(0?[1-9]|1[0-2])",
    year: "(195[0-9]|19[6-9][0-9]|20[01][0-9]|202[01])",
    username: "^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^.]$"
  };
  buildRegisterForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(this.regexPatterns.username)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      month: ['', [Validators.required, Validators.maxLength(2), Validators.pattern(this.regexPatterns.month)]],
      day: ['', [Validators.required, Validators.maxLength(2), Validators.pattern(this.regexPatterns.days)]],
      year: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4), Validators.pattern(this.regexPatterns.year)]]
    }, { validators: MustMatch('password', 'confirm_password') });
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  onSubmit(values) {
    this.loader = true;
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.loader = false;
      return;
    }
    this.userService.createUser(this.registerForm.value).subscribe((response) => {
      console.log(this.registerForm.value);
      if (response.status) {
        // Swal.fire({
        //   icon: 'success',
        //   title: response.message,
        //   showConfirmButton: false,
        //   timer: 2500
        // })
        // this.dialog.closeAll();
        // this.registerForm.reset();
        let loginObj = { email: this.registerForm.value.email,  password: this.registerForm.value.confirm_password };
        console.log(loginObj);
        this.userService.loginUser(loginObj).subscribe((response) => {
          if(response.status) { 
            // sessionStorage.setItem('jwt-token', response.token);
            // sessionStorage.setItem('user_info', JSON.stringify({ user_id: response.data.user_id, name: response.data.username }));
            this.cookieService.set('jwt-token', response.token);
            this.cookieService.set('user_info', JSON.stringify({ 
              user_id: response.data.user_id, 
              username: response.data.username, 
              name: response.data.name,
              email: response.data.email
            }));
          
            // window.location.reload();
            this.refresh();
            jQuery(".signup-btn").hide();
            jQuery(".login-btn").hide();
            jQuery(".logout-btn").show();
            jQuery(".username").text(response.data.username);
            this.dialog.closeAll();
            this.router.navigate(['/'+response.data.username]);  
          } else {
            Swal.fire({
              icon: 'error',
              title: response.message,
              showConfirmButton: false,
              timer: 2000
            });
          }
          this.loader = false;
        }, (err) => {
          console.log(err);
        });      
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
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
 
  refresh(): void {
      window.location.reload();
  }
}
