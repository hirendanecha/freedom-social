import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { PopularComponent } from './popular/popular.component';
import { MembersComponent } from './most-member/members.component';
import { GroupComponent } from './group/group.component';
import { AddCommunityComponent } from './add-community/add-community.component';

@NgModule({
  declarations: [
    CommunityComponent,
    PopularComponent,
    MembersComponent,
    GroupComponent,
    AddCommunityComponent
  ],
  imports: [
    CommunityRoutingModule,
    CommonModule
  ],
  exports: [
    PopularComponent,
    MembersComponent,
    GroupComponent
  ]
})
export class CommunityModule { }
