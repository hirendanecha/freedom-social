import { NgModule } from '@angular/core';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { AddCommunityModalComponent } from './add-community-modal/add-community-modal.component';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  declarations: [
    CommunityComponent,
    AddCommunityModalComponent,
  ],
  imports: [CommunityRoutingModule, SharedModule],
})
export class CommunityModule {}
