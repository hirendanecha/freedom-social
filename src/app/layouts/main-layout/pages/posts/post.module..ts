import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PostRoutingModule } from './post-routing.module';
import { UserPostDetailsComponent } from './user-posts/user-posts-details.component';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  declarations: [UserPostDetailsComponent],
  providers: [],
  imports: [PostRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostModule {}
