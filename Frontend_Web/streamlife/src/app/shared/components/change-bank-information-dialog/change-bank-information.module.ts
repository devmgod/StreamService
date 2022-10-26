import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ChangeBankInformationDialog } from './change-bank-information.component';


@NgModule({
  declarations: [ChangeBankInformationDialog],
  imports: [
    SharedModule,
  ]
})
export class ChangeBankInformationDialogModule { }
