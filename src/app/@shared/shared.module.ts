import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeletePostComponent } from './delete-post-dialog/delete-post.component';
import { NgbDropdown, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsComponent } from './toaster/toaster.component';

const sharedComponents = [DeletePostComponent];

const sharedModules = [
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
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
