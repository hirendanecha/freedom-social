import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { PopularComponent } from './popular/popular.component';
import { MembersComponent } from './most-member/members.component';
import { GroupComponent } from './group/group.component';
import { AddCommunityComponent } from './add-community/add-community.component';
import { CommunityRegisterComponent } from './create-community/community-register.component';
import { FormsModule } from '@angular/forms';
import { ViewCommunityComponent } from './view-community/view-community.component';
import { UserPostComponent } from '../setting/user-posts/user-post.component';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  declarations: [
    CommunityComponent,
    PopularComponent,
    MembersComponent,
    GroupComponent,
    AddCommunityComponent,
    CommunityRegisterComponent,
    ViewCommunityComponent,
  ],
  imports: [CommunityRoutingModule, SharedModule],
  exports: [PopularComponent, MembersComponent, GroupComponent],
})
export class CommunityModule {}
