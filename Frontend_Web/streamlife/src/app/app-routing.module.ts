import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { StreamerpageComponent } from './pages/streamerpage/streamerpage.component';
import { LoginDialog } from './shared/components/login-dialog/login-dialog.component'

const routes: Routes = [ 
  { path: ':username',  pathMatch: 'full', component: StreamerpageComponent },
  // { path: ':streamer_username',  component: StreamerpageComponent },
  { path: 'forgot-password/:token',  component: ResetPasswordComponent },
  { path: '**', component: StreamerpageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

