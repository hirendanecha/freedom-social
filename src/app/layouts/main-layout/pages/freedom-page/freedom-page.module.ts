import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { FreedomPageRoutingModule } from './freedom-page-routing.module';
import { AddFreedomPageComponent } from './add-page-modal/add-page-modal.component';
import { FreedomPageComponent } from './freedom-page.component';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  declarations: [
    FreedomPageComponent,
  ],
  imports: [FreedomPageRoutingModule, SharedModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class FreedomPageModule { }
