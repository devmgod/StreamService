import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { MustMatch } from 'src/app/_helper/must-match.validator';
import { PaymentService } from 'src/app/services/payment.service';

declare var jQuery: any;

@Component({
  selector: 'my-wallet',
  templateUrl: './my-wallet.html'
})

// tslint:disable-next-line: component-class-suffix
export class MyWalletDialog implements OnInit {
  public hide: boolean = true;
  public loader: boolean = false;
  public myWalletForm: FormGroup;
  public submitted: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private paymentService: PaymentService,
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
    this.buildMyWalletForm();
  }

  buildMyWalletForm() {
    this.myWalletForm = this.formBuilder.group({
      user_id: this.dataValue.user_id,
      amount: [this.dataValue.transfer_amount, [Validators.required]],
      country: ['', [Validators.required]],
      currency: ['', [Validators.required]],
     /* account_holder_name: ['', [Validators.required]],
      account_holder_type: 'individual',
      routing_number: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      account_number: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]*/
    });
  }

  get f() { return this.myWalletForm.controls; }

  onSubmit(values) {
    this.loader = true;
    this.submitted = true;
    // stop here if form is invalid
    if (this.myWalletForm.invalid) {
      this.loader = false;
      return;
    }

    this.paymentService.transferWalletbalance(this.myWalletForm.value).subscribe((response) => {
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
