import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    HomeRoutingModule,
    CommonModule,
    PickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [LoginComponent, SignUpComponent],
})
export class HomeModule {}
