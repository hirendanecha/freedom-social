import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    SettingComponent,
    EditProfileComponent
  ],
  imports: [
    SettingRoutingModule,
    CommonModule
  ]
})
export class SettingModule { }
