import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PeopleComponent } from './people.component';
import { PeopleRoutingModule } from './peoplel-routing.module';

@NgModule({
  declarations: [
    PeopleComponent
  ],
  imports: [
    PeopleRoutingModule,
    CommonModule
  ]
})
export class PeopleModule { }
