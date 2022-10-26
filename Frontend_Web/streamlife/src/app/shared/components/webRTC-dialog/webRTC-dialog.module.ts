import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { WebRTCDialog } from './webRTC-dialog.component';

@NgModule({
  declarations: [WebRTCDialog],
  imports: [
    SharedModule,
  ]
})
export class WebRTCDialogModule { }
