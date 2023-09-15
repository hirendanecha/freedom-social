import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShellModule } from './shell/shell.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './@shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './pages/home/home.module';
import { ToastsContainerComponent } from './@shared/components/toasts-container/toasts-container.component';

@NgModule({
  declarations: [
    AppComponent,
    ToastsContainerComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    ShellModule,
    HomeModule,
    HttpClientModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
