import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeletePostComponent } from './delete-post-dialog/delete-post.component';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

const sharedComponents = [DeletePostComponent];

const sharedModules = [
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  CdkMenuTrigger,
  CdkMenu,
  CdkMenuItem,
];

@NgModule({
  declarations: sharedComponents,
  imports: sharedModules,
  exports: [...sharedModules, ...sharedComponents],
})
export class SharedModule {}
