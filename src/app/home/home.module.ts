import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ToastsContainer } from '../services/toast-container.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PostComponent } from './poast-modal/post.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PostComponent,
  ],
  exports: [LoginComponent, SignUpComponent, ResetPasswordComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    PickerModule,
    FormsModule,
    ReactiveFormsModule,
    ToastsContainer,
  ],
})
export class HomeModule {}
