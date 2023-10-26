import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from 'src/app/@shared/services/post.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {

  postId: string = '';
  post: any = {};

  constructor(
    private spinner: NgxSpinnerService,
    private postService: PostService,
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private seoService: SeoService
  ) {
    this.postId = this.route.snapshot.paramMap.get('id');
    console.log('route', this.route)
  }

  ngOnInit(): void {
    if (this.postId) {
      this.getPostsByPostId();
    }
  }

  getPostsByPostId(): void {
    this.spinner.show();

    this.postService.getPostsByPostId(this.postId).subscribe(
      {
        next: (res: any) => {
          this.spinner.hide();
          if (res?.[0]) {
            this.post = res?.[0];
            const html = document.createElement('div');
            html.innerHTML = this.post?.postdescription || this.post?.metadescription;
            const data = {
              title: this.post?.title,
              url: `${environment.webUrl}post/${this.postId}`,
              description: html.textContent,
              image: this.post?.imageUrl,
              video: this.post?.streamname
            }
            this.seoService.updateSeoMetaData(data, true);
          }
        },
        error:
          (error) => {
            this.spinner.hide();
            console.log(error);
          }
      });
  }
}
