import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MustMatch } from 'src/app/_helper/must-match.validator';
import Swal from 'sweetalert2';

declare var jQuery: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public token: string = "";
  public hide: boolean = true;
  public loader: boolean = false;
  public changePasswordForm: FormGroup;
  public submitted: boolean = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      this.token = params['token'];
    });

    this.buildChangePasswordForm();
  }
  buildChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      reset_token: this.token,
      password: ['', [Validators.required, Validators.minLength(6)]],
      cPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: MustMatch('password', 'cPassword')
    });
  }

  get f() { return this.changePasswordForm.controls; }

  onSubmit(values) {
    this.loader = true;
    this.submitted = true;
    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      this.loader = false;
      return;
    }
    this.userService.resetPassword(this.changePasswordForm.value).subscribe((response) => {
      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 2500
        })
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
}
