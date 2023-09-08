import { NgModule } from '@angular/core';
import { FavoriteRoutingModule } from './favorite-routing.module';
import { FavoriteComponent } from './favorite.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CreatePostComponent } from './create-post-modal/create-post.component';
import { SharedModule } from '../@shared/shared.module';
@NgModule({
  declarations: [FavoriteComponent, CreatePostComponent],
  imports: [FavoriteRoutingModule, PickerModule, SharedModule],
  exports: [],
})
export class FavoriteModule {}
