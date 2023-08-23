import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeeFirstUserComponent } from './see-first-user.component';

const routes: Routes = [
  {
    path: '',
    component: SeeFirstUserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeeFirstUserRoutingModule { }
