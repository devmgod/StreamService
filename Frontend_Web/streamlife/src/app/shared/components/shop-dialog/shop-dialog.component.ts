import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from '../../../global_constant/global-constants';
import { AddPaymentCardDialog } from '../add-payment-card-dialog/add-payment-card-dialog.component';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
	selector: 'shop-dialog',
	templateUrl: './shop-dialog.html'
})
export class ShopDialog implements OnInit {
  selected = new FormControl('4');
  selectedLocation = new FormControl('1');
  public amount: number;
  public items: number;
  public isHidden: boolean = true;
  public isDisabled: boolean = true;
  public iconName: string = "";
  uploadImage: string | ArrayBuffer;
  public subscription_value: number = 0;
  public subscription_amount: string = '';
  public pay_amount: string = '';
  public products: Array<any> = [];
  private socket: any;
  public urlParam: string = "";  
	constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public global: GlobalConstants,
    private userService: UserService,
    private dialogRef: MatDialogRef<AddPaymentCardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      dialogRef.disableClose = true;
      this.urlParam = this.data.urlParam;

    setTimeout(function() {
      console.log("ssss");
      $('.ps__rail-y').css("display","none");

      $(".subs").on("mousemove", function() {
        console.log("PPPP");
        $('.ps__rail-y').css("display","block");
      });

    }, 1000);

  }
  
  onEvent(event) {
      event.stopPropagation();
  }
  ngOnInit() {
    if(this.data.payment_for == "subs") {
      this.products = [
        {quantity:1, amount: "4.99"},
        {quantity:5, amount: "24.95"},
        {quantity:10, amount: "49.90"},
        {quantity:20, amount: "99.80"},
        {quantity:40, amount: "199.60"},
        {quantity:100, amount: "499.00"}
      ];
    } else {
      this.products = [
        {quantity:1, amount: "1.99", price: "price_1LRmF9DN6wXRgmiFarVzuWQh"},
        {quantity:5, amount: "9.95", price: "price_1LS5CVDN6wXRgmiF6TKQnXi5"},
        {quantity:10, amount: "19.90", price: "price_1LS5CtDN6wXRgmiFTfReegct"},
        {quantity:20, amount: "39.80", price: "price_1LS5DJDN6wXRgmiFSGm2Kn9L"},
        {quantity:50, amount: "99.50", price: "price_1LS5DkDN6wXRgmiF2x2LlTop"},
        {quantity:100, amount: "149.99", price: "price_1LS5E6DN6wXRgmiF8Gork95Q"},
        {quantity:200, amount: "299.99", price: "price_1LS5ESDN6wXRgmiFLS9UaU2J"}
      ];
    }
  }
  OpenShopPaymentDialog() {
    if (this.data.items !== undefined && this.data.items != 0) {
      const dialogRef = this.dialog.open(AddPaymentCardDialog, {
        width: '100%',
        maxWidth: '600px',
        panelClass: 'fullwidth-management-dialog',
        data: {
          items: this.data.items,
          user_id: this.data.user_id,
          paid_to_user: this.data.paid_to_user,
          payment_for: this.data.payment_for,
          urlParam: this.data.urlParam,
          price: this.data.price
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Please select any amount',
        showConfirmButton: false,
      })
    }
  }
  addAmount(items:number, type: string, price_id: string) {
    let product_amount: number = 4.99;
    let item_type: string = 'subscriptions';
    if (type == 'tips') {
      item_type = 'tip';
      if (items <= 50) product_amount = 1.99;
      let baseValue: number = 49;
      if (items > 50 && items < 100) {
        product_amount = 1.99 - (0.01 * ((Math.abs((100 - items) - baseValue)) + 1)); 
      }
      if (items >= 100) product_amount = 1.49995;
    }
    if(items == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Please enter ' + item_type + ' quantity',
        showConfirmButton: false,
        timer: 2500
      });
    } else {
      this.pay_amount = ((items * product_amount)).toFixed(2);
      this.data.items = items;
      this.data.price = price_id; 
      this.isHidden = false;
      this.isDisabled = false;
    }
  }
  onKeypressEvent(event: any) {
    let product_amount: number = 0.00
    if(this.data.payment_for == "subs") {
      product_amount = 4.99;
    } else {
      if (event.target.value <= 50) product_amount = 1.99;
      let baseValue: number = 49;
      if (event.target.value > 50 && event.target.value < 100) {
        product_amount = 1.99 - (0.01 * ((Math.abs((100 - event.target.value) - baseValue)) + 1)); 
      }
      if (event.target.value >= 100) product_amount = 1.50;
    }
    this.data.items = event.target.value;
    this.isHidden = false;
    this.isDisabled = false;
    this.subscription_value = event.target.value;
    this.pay_amount = this.subscription_amount = ((event.target.value * product_amount)).toFixed(2);
  }
}  
