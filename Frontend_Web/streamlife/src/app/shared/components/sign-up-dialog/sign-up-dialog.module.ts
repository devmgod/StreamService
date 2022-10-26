import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { SignUpDialog } from './sign-up-dialog.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


@NgModule({
  declarations: [SignUpDialog],
  imports: [
    SharedModule,
    PerfectScrollbarModule
  ]
})
export class SignUpDialogModule { }
