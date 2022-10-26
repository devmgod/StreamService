import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { LoginDialog } from './login-dialog.component';


@NgModule({
  declarations: [LoginDialog],
  imports: [
    SharedModule,
  ]
})
export class LoginDialogModule { }
