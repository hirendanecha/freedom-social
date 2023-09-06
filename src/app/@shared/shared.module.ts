import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsComponent } from './toaster/toaster.component';
import { MyListComponent } from '../right-side-bar/my-list.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

const sharedComponents = [
  ConfirmationModalComponent,
  MyListComponent
];

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgbDropdownModule,
  NgbNavModule,
  ToastsComponent,
];

@NgModule({
  declarations: sharedComponents,
  imports: sharedModules,
  exports: [...sharedModules, ...sharedComponents],
})
export class SharedModule {}
