import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { MustMatch } from 'src/app/_helper/must-match.validator';

declare var jQuery: any;

@Component({
  selector: 'change-password',
  templateUrl: './change-password.html'
})

// tslint:disable-next-line: component-class-suffix
export class ChangePasswordDialog implements OnInit {
  public hide: boolean = true;
  public loader: boolean = false;
  public changePasswordForm: FormGroup;
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
    this.buildChangePasswordForm();
  }

  buildChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      user_id: this.dataValue.user_id,
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

    this.userService.changePassword(this.changePasswordForm.value).subscribe((response) => {
      if(response.status){ 
        Swal.fire({
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 2500
        })
        this.dialogRef.close(); 
      }else{        
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
