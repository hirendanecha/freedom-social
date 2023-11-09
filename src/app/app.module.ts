import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './@shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastsContainerComponent } from './@shared/components/toasts-container/toasts-container.component';
import { AuthenticationGuard } from './@shared/guards/authentication.guard';
import { CookieService } from 'ngx-cookie-service';
import { LandingPageComponent } from './layouts/auth-layout/pages/landing-page/landing-page.component';
import { MetafrenzyModule } from 'ngx-metafrenzy';
import {provideClientHydration} from '@angular/platform-browser';


@NgModule({
  declarations: [
    AppComponent,
    ToastsContainerComponent,
    LandingPageComponent
  ],
  providers: [AuthenticationGuard, CookieService, provideClientHydration()],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
