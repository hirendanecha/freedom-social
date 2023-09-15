import { NgModule } from '@angular/core';

import { FreedomPageRoutingModule } from './freedom-page-routing.module';
import { MyPageComponent } from './my-page/my-page.component';
import { JoinedPageComponent } from './joined-pages/joined-page.component';
import { PageComponent } from './pages/pages.component';
import { AddFreedomPageComponent } from './add-page/add-page.component';
import { ViewPageComponent } from './view-page/view-page.component';
import { FreedomPageComponent } from './freedom-page.component';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  declarations: [
    FreedomPageComponent,
    MyPageComponent,
    JoinedPageComponent,
    PageComponent,
    AddFreedomPageComponent,
    ViewPageComponent,
  ],
  imports: [FreedomPageRoutingModule, SharedModule],
  exports: [
    MyPageComponent,
    JoinedPageComponent,
    PageComponent,
  ],
})
export class FreedomPageModule { }
