import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MyWalletDialog } from './my-wallet.component';


@NgModule({
  declarations: [MyWalletDialog],
  imports: [
    SharedModule,
  ]
})
export class MyWalletDialogModule { }
