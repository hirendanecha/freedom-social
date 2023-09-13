import { NgModule } from '@angular/core';

import { AddCommunityModalComponent } from './add-community-modal/add-community-modal.component';
import { SharedModule } from '../@shared/shared.module';
import { CommunitiesRoutingModule } from './communities-routing.module';
import { CommunitiesComponent } from './communities.component';

@NgModule({
  declarations: [
    CommunitiesComponent,
    AddCommunityModalComponent,
  ],
  imports: [CommunitiesRoutingModule, SharedModule],
})
export class CommunitiesModule {}
