import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PaymentService } from 'src/app/services/payment.service';
import { GlobalConstants } from 'src/app/global_constant/global-constants';
import Swal from 'sweetalert2';
import { TermsOfServiceDialog } from '../terms-of-service-dialog/terms-of-service-dialog.component';
declare var jQuery: any;
@Component({
  selector: 'change-bank-information',
  templateUrl: './change-bank-information.html'
})
export class ChangeBankInformationDialog implements OnInit {
  public payoutsForm: FormGroup;
  public hide: boolean = true;
  public loader: boolean = false;
  public submitted: boolean = false;
  public identityFile: any = {};
  public countries: any = [];
  public months: any = [];
  public states: any = [];
  public arr: any = [];
  public years: any = [];
  public days: any = [];
  public userEmail: string = this.global.userEmail;
  public userId: string = this.global.userId;
  public phoneNumberRegex = '^((\\+?\\d{1,2}-?)|0)?[\\s.-]?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private paymentService: PaymentService,
    private global: GlobalConstants,
    public dialog: MatDialog,
    private bankInfoDialogRef: MatDialogRef<ChangeBankInformationDialog>,
    private dialogRef: MatDialogRef<TermsOfServiceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
  }
  ngOnInit() {    
    this.initializePayoutsForm();
    this.getCountry();
    this.getStates("US");
    this.months = [
      {name: "January", value: 1},
      {name: "February", value: 2}, 
      {name: "March", value: 3}, 
      {name: "April", value: 4}, 
      {name: "May", value: 5}, 
      {name: "June", value: 6}, 
      {name: "July", value: 7}, 
      {name: "August", value: 8}, 
      {name: "September", value: 9}, 
      {name: "October", value: 10}, 
      {name: "November", value: 11}, 
      {name: "December", value: 12}
    ];
    let currentYear: number = new Date().getFullYear();
    for (let i = (currentYear - 123); i < (currentYear - 13); i++) {
      this.years.unshift(i);
    }
  }
  daysInMonth (month: number) {
    return new Date(new Date().getFullYear(), month, 0).getDate();
  }
  inputSelect(e) {
    const element = e.target || e.srcElement || e.currentTarget;
    element.classList.add('blackText');  
  } 
  inputSelectMonth(e) {
    this.inputSelect(e);
    const days = this.daysInMonth(e.target.value); 
    this.days = Array(days).fill(0).map((x,i)=>{return i + 1});
  } 
  getCountry() {
    this.paymentService.getCountries().subscribe((response) => {
      if(response.status) {
       this.countries = response.data;  
      }
     }, (err) => {
      console.log(err);
    });
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.identityFile = event.target.files;
    }
  }
  initializePayoutsForm() {
    this.payoutsForm = this.formBuilder.group({
      user_id: this.userId,
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDay: ['', [Validators.required]],
      birthMonth: ['', [Validators.required]],
      birthYear: ['', [Validators.required]],
      address: ['', [Validators.required]],
      postalcode: ['', [Validators.required, Validators.maxLength(12)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['US'],
      email: this.userEmail,
      phone: ['', [Validators.required, Validators.pattern(this.phoneNumberRegex)]],
      bankCountry: ['US'],
      accountNumber: ['', [Validators.required]],
      routingNumber: ['', [Validators.required]],
      identityFile: ['',[Validators.required]]
    });
  }
  get f() { return this.payoutsForm.controls; }
  getStates(countryCode: string) {
    this.paymentService.getStates({countryCode}).subscribe((response) => {
      if(response.status) {
       this.states = response.data;  
      }
     }, (err) => {
      console.log(err);
    });
  }
  openTOS() {
    this.submitted = true;
    if (this.payoutsForm.valid) {
      this.bankInfoDialogRef.close();
      const dialogRef = this.dialog.open(TermsOfServiceDialog, {
        width: '100%',
        maxWidth: '600px',
        panelClass: 'fullwidth-management-dialog',
        data: {
          user_id: this.userId,
          first_name: this.payoutsForm.value.firstName,
          last_name: this.payoutsForm.value.lastName,
          day: this.payoutsForm.value.birthDay,
          month: this.payoutsForm.value.birthMonth,
          year: this.payoutsForm.value.birthYear,
          address_line: this.payoutsForm.value.address,
          postal_code: this.payoutsForm.value.postalcode,
          city: this.payoutsForm.value.city,
          state: this.payoutsForm.value.state,
          country: this.payoutsForm.value.country,
          email: this.userEmail,
          phone: this.payoutsForm.value.phone,
          bankCountry: this.payoutsForm.value.bankCountry,
          accountNumber: this.payoutsForm.value.accountNumber,
          routingNumber: this.payoutsForm.value.routingNumber,
          identityFile: this.identityFile[0]
        }
      });
    }
  }
}  
