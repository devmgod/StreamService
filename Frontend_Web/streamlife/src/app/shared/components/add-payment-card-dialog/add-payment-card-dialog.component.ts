import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment.service';
import * as cardValidator from "card-validator";
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { GlobalConstants } from 'src/app/global_constant/global-constants';
@Component({
	selector: 'add-payment-card-dialog',
	templateUrl: './add-payment-card-dialog.html'
})
export class AddPaymentCardDialog implements OnInit {
  public paymentCardForm: FormGroup;
  public submitted: boolean = false;
  public years: any = [];
  public months: any = [];
  public countries: any = [];
  public userId: string = "";
  public states: any = [];
  public validationRes: any;
  public numberRegEx = '^[ X0-9]*$';
  public cardNumberInput: AbstractControl;
  public uploadImage: string | ArrayBuffer;
  public savedCards: any = [];
  public cardImagePath: string = "";
  private savedCardsCheckState: any = [];
  private saveCard: boolean = false;
  private fingerprintSet: boolean = false;
	@ViewChild('ccNumber') ccNumberField: ElementRef;
  constructor(
    public global: GlobalConstants,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    private paymentService: PaymentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    dialogRef.disableClose = true;
    this.userId = this.global.userId;
  }
  switchCardToken() { 
    if (this.fingerprintSet) this.fingerprintSet = false;
  }
  cardSelect(e, card) {
    if (!this.fingerprintSet) this.fingerprintSet = true;
    if (card.brand === "amex") {
      this.cardNumberInput.setValue("XXXX XXXXXX X" + card.last4);
    } else { 
      this.cardNumberInput.setValue("XXXX XXXX XXXX " + card.last4);
    }
    document.getElementById("cardMonth").classList.add("blackText");
    document.getElementById("cardYear").classList.add("blackText");
    document.getElementById("cardCountry").classList.add("blackText");
    this.paymentCardForm.get("name_on_card").setValue(card.name);
    this.paymentCardForm.get("month").setValue(card.month);
    this.paymentCardForm.get("year").setValue(card.year);
    this.paymentCardForm.get("country").setValue(card.country);
    this.paymentCardForm.get("postalcode").setValue(card.postalcode);
    this.paymentCardForm.get("fingerprint").setValue(card.fingerprint);
  }
  inputSelect(e) {
    const element = e.target || e.srcElement || e.currentTarget;
    element.classList.add('blackText');  
  } 
  get f() { return this.paymentCardForm.controls; }
  async ngOnInit() {
    this.initializePaymentForm();
    await this.paymentService.getCardData({user_id: this.userId}).subscribe((response) => {
      this.savedCards = response.data;
      this.savedCards.forEach((card) => {
        card["checkedState"] = false;
        if (card.brand === "amex") {
          card["path"] = "assets/images/cardicons/amex.svg";
          card["maskedPattern"] = "XXXX XXXXXX X";
          card["style"] = "margin-top: -2px;";
        }
        if (card.brand === "diners_club") {
          card["path"] = "assets/images/cardicons/discover.png";
          card["maskedPattern"] = "XXXX XXXX XXXX ";
        }
        if (card.brand === "cartes_bancaires") {
          card["path"] = "assets/images/cardicons/cartes-bancaires-logo.png";
          card["maskedPattern"] = "XXXX XXXX XXXX ";
        }
        if (card.brand === "discover") {
          card["path"] = "assets/images/cardicons/discover.png";
          card["maskedPattern"] = "XXXX XXXX XXXX ";
        }
        if (card.brand === "jcb") {
          card["path"] = "assets/images/cardicons/jcb.png";
          card["maskedPattern"] = "XXXX XXXX XXXX ";
        }
        if (card.brand === "mastercard") {
          card["path"] = "assets/images/cardicons/mastercard.svg";
          card["maskedPattern"] = "XXXX XXXX XXXX ";
        }
        if (card.brand === "unionpay") {
          card["path"] = "assets/images/cardicons/unionpay.png";
          card["maskedPattern"] = "XXXX XXXX XXXX ";
        }
        if (card.brand === "visa") {
          card["path"] = "assets/images/cardicons/visa.png";
          card["maskedPattern"] = "XXXX XXXX XXXX ";
        }
        if (card.brand === "Unknown") {
          card["path"] = "";
          card["maskedPattern"] = "XXXX XXXX XXXX ";
        }
      });
    });
    this.uploadImage = sessionStorage.getItem('profileImage'); 
    let currentYear: number = new Date().getFullYear();
    for(let i = (currentYear); i < (currentYear + 30); i++) {
      this.years.push(i);
    }
    this.cardNumberInput = this.paymentCardForm.get('card_number');
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
    await this.paymentService.getCountries().subscribe((response) => {
      console.log(response);
      if(response.status) {
       this.countries = response.data;   
      } else {
        this.dialogRef.close();   
        Swal.fire({
          icon: 'error',
          title: "Something went wrong - Payment Down",
          showConfirmButton: false,
          timer: 2000
        });
      }
     }, (err) => {
      console.log(err);
    });
  }
  public deletePaymentMethod(e, card_id, fingerprint) { 
    e.preventDefault();
    this.paymentService.deletePaymentMethod({user_id: this.userId, payment_method: card_id, fingerprint}).subscribe((response) => {
      if (response.status) {
        this.savedCards.splice(this.savedCards.findIndex(({cardFingerprint}) => {cardFingerprint === fingerprint}), 1);
      } else {
        console.log("card not saved");
      }
    }, (err) => {
      console.log(err);
    });
  }
  creditCardNumberSpacing(e) {
    const input = e.target;
    let trimmedCardNum = input.value.replace(/\s+/g, '');
    if (trimmedCardNum.length > 16) {
      trimmedCardNum = trimmedCardNum.substr(0, 16);
    }
    const partitions = trimmedCardNum.startsWith('34') || trimmedCardNum.startsWith('37') 
                       ? [4,6,5] 
                       : [4,4,4,4];
    const numbers = [];
    let position = 0;
    partitions.forEach((partition) => {
      const part = trimmedCardNum.substr(position, partition);
      if (part) numbers.push(part);
      position += partition;
    })
    this.cardNumberInput.setValue(numbers.join(' '));
    if (input < input.value.length - 1) {
      input.setSelectionRange(input, input, 'none');
    }
  }
  initializePaymentForm() {
    let itemPrice:string = "";
    const itemCount = Number(this.data.items);
    if (itemCount === 1 || itemCount < 51) itemPrice = this.global.getProductPrices()[Number(1).toString()];
    if (itemCount >= 51 && itemCount < 100) itemPrice = this.global.getProductPrices()[itemCount.toString()];
    if (itemCount === 100) itemPrice = this.global.getProductPrices()[Number(100).toString()];
    if (itemCount === 200) itemPrice = this.global.getProductPrices()[Number(200).toString()];
    if (itemCount !== 200 && itemCount !== 100 && itemCount > 100) itemPrice = this.global.getProductPrices()[Number(99).toString()];
    this.paymentCardForm = this.formBuilder.group({
      name_on_card: ['', [Validators.required]],
      card_number: ['', [Validators.required, Validators.minLength(19), Validators.pattern(this.numberRegEx)]],
      month: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
      cvc: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
      country: ['', [Validators.required]],
      postalcode: ['', [Validators.required, Validators.maxLength(12)]],
      items: this.data.items,
      price: itemPrice,
      fingerprint: '',
      username: JSON.parse(this.cookieService.get('user_info')).username,
      user_id: JSON.parse(this.cookieService.get('user_info')).user_id,
      paid_to_user: this.data.paid_to_user,
      email: JSON.parse(this.cookieService.get('user_info')).email,
      payment_for: this.data.payment_for,
      agree: ['']
    });
    console.log(this.data.paid_to_user);
  }
  onSubmit(values: any) {
    this.submitted = true;
    let rememberCardObj: any = {
      name_on_card: this.paymentCardForm.value.name_on_card,
      card_number: this.paymentCardForm.value.card_number,
      month: this.paymentCardForm.value.month,
      year: this.paymentCardForm.value.year,
      cvc: this.paymentCardForm.value.cvc,
      country: this.paymentCardForm.value.country,
      postalcode: this.paymentCardForm.value.postalcode,
      user_id: this.paymentCardForm.value.user_id,
      email: this.paymentCardForm.value.email
    };
    if (!this.fingerprintSet) delete this.paymentCardForm.value["fingerprint"];
    if (this.paymentCardForm.status == 'VALID') {
      if (this.data.payment_for === "tips") {
        this.paymentService.initPayment(this.paymentCardForm.value).subscribe((response) => {
          if (response.status) {
            this.dialogRef.close();
            Swal.fire({
              icon: 'success',
              title: response.message,
              showConfirmButton: false,
              timer: 2000
            });
          } else{
            Swal.fire({
              icon: 'error',
              title: response.message,
              showConfirmButton: false,
              timer: 2000
            });
          }
        }, (err) => {
          console.log(err);
        });
      }
    }
  }
}
