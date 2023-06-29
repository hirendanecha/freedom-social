import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './event-routing.module';
import { EventsComponent } from './events.component';
import { LocalComponent } from './local/local.component';
import { OnlineComponent } from './online/online.component';
import { TopComponent } from './top/top.component';
import { SavedComponent } from './saved/saved.component';
import { AddEventComponent } from './add-event/add-event.component';

@NgModule({
  declarations: [
    EventsComponent,
    LocalComponent,
    OnlineComponent,
    TopComponent,
    SavedComponent,
    AddEventComponent
  ],
  imports: [
    EventsRoutingModule,
    CommonModule
  ],
  exports: [
    LocalComponent,
    OnlineComponent,
    TopComponent,
    SavedComponent
  ]
})
export class EventsModule { }
