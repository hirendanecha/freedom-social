import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnsubscribedUsersComponent } from './unsubscribed-users.component';

const routes: Routes = [
  {
    path: '',
    component: UnsubscribedUsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnsubscribedUsersRoutingModule { }
