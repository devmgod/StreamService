import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

declare var jQuery: any;

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.html'
})

// tslint:disable-next-line: component-class-suffix
export class ForgotPasswordDialog implements OnInit {
  public hide: boolean = true;
  public loader: boolean = false;
  public forgotPasswordForm: FormGroup;
  public submitted: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dataValue: any
  ) { }

  /**
 * Check if the router url contains the specified route
 *
 * @param {string} route
 * @returns
 * @memberof MyComponent
 */

  /**
   * on init
   */
  ngOnInit() {
    this.buildForgotPasswordForm();
  }

  buildForgotPasswordForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  onSubmit(values) {
    this.loader = true;
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      this.loader = false;
      return;
    }
    this.userService.sendPasswordResetLink(this.forgotPasswordForm.value).subscribe((response) => {
      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 2500
        })
        this.dialogRef.close();
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