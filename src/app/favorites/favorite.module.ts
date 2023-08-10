import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteRoutingModule } from './favorite-routing.module';
import { FavoriteComponent } from './favorite.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { CreatePostComponent } from './create-post-modal/create-post.component';
@NgModule({
  declarations: [FavoriteComponent, CreatePostComponent],
  imports: [FavoriteRoutingModule, CommonModule, PickerModule, FormsModule],
  exports: [],
})
export class FavoriteModule {}
