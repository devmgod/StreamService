import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/materials.module';
import { SharedModule } from './shared/shared.module';
import { PagesModule }   from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { GlobalConstants } from '../app/global_constant/global-constants';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { ViewerCountService } from './services/viewerCount.service';
import { HtmlElementService } from './services/htmlElement.service';
import { WebRTCDeviceService } from './services/webRTCDevice.service';
import { BehaviorSubjectHashMapAny } from './services/behaviorSubjectHashMapAny.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    MaterialModule,
    SharedModule,
    PagesModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    CookieService, GlobalConstants, ViewerCountService, HtmlElementService, WebRTCDeviceService, BehaviorSubjectHashMapAny
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

