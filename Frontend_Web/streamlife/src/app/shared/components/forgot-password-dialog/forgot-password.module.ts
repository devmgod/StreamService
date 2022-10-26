import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ForgotPasswordDialog } from './forgot-password.component';


@NgModule({
  declarations: [ForgotPasswordDialog],
  imports: [
    SharedModule,
  ]
})
export class ForgotPasswordDialogModule { }
