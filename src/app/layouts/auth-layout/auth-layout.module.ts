import { NgModule } from '@angular/core';

import { AuthLayoutRoutingModule } from './auth-layout-routing.module';
import { AuthLayoutComponent } from './auth-layout.component';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AuthHeaderComponent } from './components/auth-header/auth-header.component';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AuthHeaderComponent
  ],
  imports: [
    SharedModule,
    AuthLayoutRoutingModule
  ]
})
export class AuthLayoutModule { }
