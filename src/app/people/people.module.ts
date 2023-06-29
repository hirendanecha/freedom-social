import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PeopleComponent } from './people.component';
import { PeopleRoutingModule } from './peoplel-routing.module';
import { FriendRequestComponent } from './friend-request/friend-request.component';
import { BlockListComponent } from './block-list/block-list.component';
import { SuggesationComponent } from './suggesation/suggesation.component';

@NgModule({
  declarations: [
    PeopleComponent,
    FriendRequestComponent,
    BlockListComponent,
    SuggesationComponent
  ],
  imports: [
    PeopleRoutingModule,
    CommonModule
  ]
})
export class PeopleModule { }
