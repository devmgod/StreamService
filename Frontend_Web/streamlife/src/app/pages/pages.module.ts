import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule }   from '../shared/shared.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SwiperModule } from 'swiper/angular';
import { ShopDialog } from '../shared/components/shop-dialog/shop-dialog.component';
import { StreamerpageComponent } from './streamerpage/streamerpage.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
@NgModule({
  declarations: [ShopDialog, StreamerpageComponent, ResetPasswordComponent],
  entryComponents: [ShopDialog],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    SwiperModule
  ],
  providers: [],
  exports: [ StreamerpageComponent ]
})
export class PagesModule { }

