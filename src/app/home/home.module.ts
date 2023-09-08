import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PostComponent } from './poast-modal/post.component';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PostComponent
  ],
  exports: [LoginComponent, SignUpComponent, ResetPasswordComponent],
  imports: [HomeRoutingModule, PickerModule, SharedModule],
})
export class HomeModule {}
