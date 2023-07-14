import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { PipeModule } from '../pipe/pipe.module';

@NgModule({
  declarations: [SettingComponent, EditProfileComponent, UploadFilesComponent],
  imports: [
    SettingRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
  ],
})
export class SettingModule {}
