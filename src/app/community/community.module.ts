import { NgModule } from '@angular/core';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { MyCommunityComponent } from './my-communities/my-community.component';
import { JoinedCommunityComponent } from './joined-communities/joined-community.component';
import { LocalCommunityComponent } from './local-communities/local-community.component';
import { AddCommunityModalComponent } from './add-community-modal/add-community-modal.component';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  declarations: [
    CommunityComponent,
    MyCommunityComponent,
    JoinedCommunityComponent,
    LocalCommunityComponent,
    AddCommunityModalComponent,
  ],
  imports: [CommunityRoutingModule, SharedModule],
  exports: [
    MyCommunityComponent,
    JoinedCommunityComponent,
    LocalCommunityComponent,
  ],
})
export class CommunityModule {}
