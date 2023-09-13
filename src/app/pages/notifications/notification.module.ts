import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notification-routing.module';
import { NotificationsComponent } from './notification.component';
import { SharedModule } from '../../@shared/shared.module';

@NgModule({
  declarations: [NotificationsComponent],
  imports: [SharedModule, NotificationsRoutingModule],
})
export class NotificationsModule {}
