import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastsComponent } from './toaster/toaster.component';
import { MyListComponent } from '../right-side-bar/my-list.component';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { MyProfileComponent } from '../left-side-bar/my-profile.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';

const sharedComponents = [
  ConfirmationModalComponent,
  MyListComponent,
  MyProfileComponent,
  PostListComponent
];

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgbDropdownModule,
  NgbNavModule,
  ToastsComponent,
  NgbCollapseModule,
  NgbModule,
  NgxSpinnerModule,
  RouterModule,
];

@NgModule({
  declarations: sharedComponents,
  imports: sharedModules,
  exports: [...sharedModules, ...sharedComponents],
})
export class SharedModule {}
