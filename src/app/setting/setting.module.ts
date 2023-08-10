import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { PipeModule } from '../pipe/pipe.module';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { UserPostComponent } from './user-posts/user-post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommunityModule } from '../community/community.module';

@NgModule({
  declarations: [
    SettingComponent,
    EditProfileComponent,
    UploadFilesComponent,
    ViewProfileComponent,
    UserPostComponent,
  ],
  imports: [
    SettingRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    NgbModule,
    CommunityModule
  ],
  exports: [UserPostComponent],
})
export class SettingModule {}
