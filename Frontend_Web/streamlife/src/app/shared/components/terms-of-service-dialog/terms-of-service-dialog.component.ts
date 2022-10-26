import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
@Component({
	selector: 'terms-of-service-dialog',
	templateUrl: './terms-of-service-dialog.html'
})
export class TermsOfServiceDialog implements OnInit {
  public termsOfServiceForm: FormGroup;
  ssnRegex = '^\\d{9}$';
  submitted = false;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<any>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    this.buildTermsOfServiceForm();
  }
  buildTermsOfServiceForm() {
    this.termsOfServiceForm = this.formBuilder.group({
      agree: [false, Validators.requiredTrue],
      ssn: ["", [Validators.required, Validators.pattern(this.ssnRegex)]],
      user_id: this.data.user_id,
      first_name: this.data.first_name,
      last_name: this.data.last_name,
      day: this.data.day,
      month: this.data.month,
      year: this.data.year,
      address_line: this.data.address_line,
      postal_code: this.data.postal_code,
      city: this.data.city,
      state: this.data.state,
      country: this.data.country,
      email: this.data.email,
      phone: this.data.phone,
      bankCountry: this.data.bankCountry,
      accountNumber: this.data.accountNumber,
      routingNumber: this.data.routingNumber
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.termsOfServiceForm.valid) {
      console.log(this.termsOfServiceForm.value);

      const formData: FormData = new FormData();
      formData.append('pic', this.data.identityFile, this.data.identityFile.name);

      const blobOverrides = new Blob([JSON.stringify(this.termsOfServiceForm.value)], {
        type: 'application/json',
      });

      formData.append('payoutsForm', blobOverrides);
      
      this.userService.sendPayoutInformation(formData).subscribe((response) => {
        if (JSON.parse(JSON.stringify(response)).status) {
          this.dialogRef.close();
          Swal.fire({
            icon: 'success',
            title: JSON.parse(JSON.stringify(response)).message,
            showConfirmButton: false,
            timer: 2000
          });
        } else{
          Swal.fire({
            icon: 'error',
            title: JSON.parse(JSON.stringify(response)).message,
            showConfirmButton: false,
            timer: 2000
          });
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  get t() { return this.termsOfServiceForm.controls; }
}
