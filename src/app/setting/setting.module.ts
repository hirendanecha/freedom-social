import { NgModule } from '@angular/core';

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

@NgModule({
  declarations: [
    SettingComponent,
    EditProfileComponent,
    UploadFilesComponent,
    ViewProfileComponent,
    UserPostComponent
  ],
  imports: [
    SettingRoutingModule,
    SharedModule,
    PipeModule,
    NgbModule
  ],
  exports: [UserPostComponent],
})
export class SettingModule {}
