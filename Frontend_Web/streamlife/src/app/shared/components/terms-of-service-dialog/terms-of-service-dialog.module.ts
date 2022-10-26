import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { TermsOfServiceDialog } from './add-payment-card-dialog.component';


@NgModule({
  declarations: [TermsOfServiceDialog],
  imports: [
    SharedModule,
  ]
})
export class TermsOfServiceDialogModule { }
