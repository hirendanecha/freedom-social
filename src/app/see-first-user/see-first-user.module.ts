import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeeFirstUserRoutingModule } from './see-first-user-routing.module';
import { SeeFirstUserComponent } from './see-first-user.component';


@NgModule({
  declarations: [
    SeeFirstUserComponent
  ],
  imports: [
    CommonModule,
    SeeFirstUserRoutingModule
  ]
})
export class SeeFirstUserModule { }
