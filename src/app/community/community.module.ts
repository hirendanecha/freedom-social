import { NgModule } from '@angular/core';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { MyCommunityComponent } from './my-communities/my-community.component';
import { JoinedCommunityComponent } from './joined-communities/joined-community.component';
import { LocalCommunityComponent } from './local-communities/local-community.component';
import { AddCommunityComponent } from './add-community/add-community.component';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  declarations: [
    CommunityComponent,
    MyCommunityComponent,
    JoinedCommunityComponent,
    LocalCommunityComponent,
    AddCommunityComponent,
  ],
  imports: [CommunityRoutingModule, SharedModule],
  exports: [
    MyCommunityComponent,
    JoinedCommunityComponent,
    LocalCommunityComponent,
  ],
})
export class CommunityModule {}
