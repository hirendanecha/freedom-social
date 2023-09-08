import { NgModule } from '@angular/core';

import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { PipeModule } from '../pipe/pipe.module';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  declarations: [
    SettingComponent,
    EditProfileComponent,
    UploadFilesComponent,
    ViewProfileComponent
  ],
  imports: [SettingRoutingModule, SharedModule, PipeModule],
})
export class SettingModule {}
