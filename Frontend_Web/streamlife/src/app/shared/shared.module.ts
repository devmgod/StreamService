import { NgModule } from '@angular/core';
import { PageHeader } from './components/header/header.component';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './materials.module';
import { SignUpDialog } from '../shared/components/sign-up-dialog/sign-up-dialog.component';
import { LoginDialog } from '../shared/components/login-dialog/login-dialog.component';
import { ChangePasswordDialog } from './components/change-password-dialog/change-password.component';
import { ChangeBankInformationDialog } from "./components/change-bank-information-dialog/change-bank-information.component"
import { TermsOfServiceDialog } from "./components/terms-of-service-dialog/terms-of-service-dialog.component"
import { ForgotPasswordDialog } from './components/forgot-password-dialog/forgot-password.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AddPaymentCardDialog } from './components/add-payment-card-dialog/add-payment-card-dialog.component';
import { MyWalletDialog } from './components/my-wallet-dialog/my-wallet.component';
import { PageLeftSidebar } from './components/left-sidebar/left-sidebar.component';
import { GoLiveComponent } from './components/go-live/go-live.component';
import { WebRTCDialog } from './components/webRTC-dialog/webRTC-dialog.component';
@NgModule({
  imports: [
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule
  ],
  declarations: [
    PageHeader,
    PageLeftSidebar,
    SignUpDialog,
    LoginDialog,
    ChangePasswordDialog,
    ChangeBankInformationDialog,
    TermsOfServiceDialog,
    ForgotPasswordDialog,
    AddPaymentCardDialog,
    MyWalletDialog,
    GoLiveComponent,
    WebRTCDialog,

  ],
  providers: [],
  entryComponents: [],
  exports: [
    MaterialModule,
    PageHeader,
    PageLeftSidebar
  ]
})
export class SharedModule { }
