import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteRoutingModule } from './favorite-routing.module';
import { FavoriteComponent } from './favorite.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [FavoriteComponent],
  imports: [FavoriteRoutingModule, CommonModule, PickerModule, FormsModule],
  exports: [],
})
export class FavoriteModule {}
