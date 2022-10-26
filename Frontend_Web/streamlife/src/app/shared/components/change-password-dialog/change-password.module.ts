import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ChangePasswordDialog } from './change-password.component';


@NgModule({
  declarations: [ChangePasswordDialog],
  imports: [
    SharedModule,
  ]
})
export class ChangePasswordDialogModule { }
