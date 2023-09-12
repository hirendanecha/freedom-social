import { NgModule } from '@angular/core';

import { SettingRoutingModule } from './setting-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PipeModule } from '../pipe/pipe.module';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { SharedModule } from '../@shared/shared.module';
import { SeeFirstUserComponent } from './see-first-user/see-first-user.component';
import { UnsubscribedUsersComponent } from './unsubscribed-users/unsubscribed-users.component';

@NgModule({
  declarations: [
    EditProfileComponent,
    ViewProfileComponent,
    SeeFirstUserComponent,
    UnsubscribedUsersComponent
  ],
  imports: [SettingRoutingModule, SharedModule, PipeModule],
})
export class SettingModule {}
