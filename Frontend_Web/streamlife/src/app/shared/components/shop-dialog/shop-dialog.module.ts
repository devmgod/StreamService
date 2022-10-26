import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ShopDialog } from './shop-dialog.component';

@NgModule({
  declarations: [ShopDialog, NumbersOnly],
  imports: [
    SharedModule,
  ]
})
export class ShopDialogModule { }
