import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { AddPaymentCardDialog } from './add-payment-card-dialog.component';


@NgModule({
  declarations: [AddPaymentCardDialog],
  imports: [
    SharedModule,
  ]
})
export class AddPaymentCardDialogModule { }
