import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnsubscribedUsersRoutingModule } from './unsubscribed-users-routing.module';
import { UnsubscribedUsersComponent } from './unsubscribed-users.component';


@NgModule({
  declarations: [
    UnsubscribedUsersComponent
  ],
  imports: [
    CommonModule,
    UnsubscribedUsersRoutingModule
  ]
})
export class UnsubscribedUsersModule { }
