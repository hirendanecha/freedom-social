import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { PipeModule } from '../pipe/pipe.module';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { UserPostComponent } from './user-posts/user-post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommunityModule } from '../community/community.module';
import { SharedModule } from '../@shared/shared.module';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

@NgModule({
  declarations: [
    SettingComponent,
    EditProfileComponent,
    UploadFilesComponent,
    ViewProfileComponent,
    UserPostComponent,
    DeleteAccountComponent,
  ],
  imports: [SettingRoutingModule, SharedModule, PipeModule],
  exports: [UserPostComponent],
})
export class SettingModule {}
