import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreedomPageComponent } from './freedom-page.component';
import { ViewPageComponent } from './view-page/view-page.component';

const routes: Routes = [
  {
    path: '',
    component: FreedomPageComponent,
  },
  {
    path: ':id',
    component: ViewPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreedomPageRoutingModule { }
