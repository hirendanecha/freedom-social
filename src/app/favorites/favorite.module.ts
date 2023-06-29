import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteRoutingModule } from './favorite-routing.module';
import { FavoriteComponent } from './favorite.component';
@NgModule({
  declarations: [
    FavoriteComponent
  ],
  imports: [
    FavoriteRoutingModule,
    CommonModule
  ],
  exports: [
  ]
})
export class FavoriteModule { }
