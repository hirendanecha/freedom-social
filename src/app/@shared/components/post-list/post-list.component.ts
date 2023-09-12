import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { slideUp } from 'src/app/@shared/animations/slideUp';
import { PostService } from 'src/app/services/post.service';
import { SeeFirstUserService } from 'src/app/services/see-first-user.service';
import { SharedService } from 'src/app/services/shared.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  animations: [slideUp],
})
export class PostListComponent implements OnInit {
  @Input('parentComponent') parentComponent = '';
  @Output('onEditPost') onEditPost: EventEmitter<any> = new EventEmitter<any>();

  postList = [];
  seeFirstList = [];
  communityId: number;
  profileId: string = '';
  activePage = 1;


  constructor(
    private spinner: NgxSpinnerService,
    private postService: PostService,
    public sharedService: SharedService,
    private socketService: SocketService,
    private seeFirstUserService: SeeFirstUserService,
    private router: Router
  ) {
    this.communityId = +history?.state?.data?.id;
    this.profileId = sessionStorage.getItem('profileId');
  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.communityId = +history?.state?.data?.id;

        this.getPostList();
      }
    });

    this.socketService.socket.on(
      'new-post',
      (data: any) => {
        if (data.length > 0) {
          this.postList = data;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getPostList(): void {
    this.activePage = 1;
    this.postList = [];

    if (this.parentComponent === 'HomeComponent') {
      this.socketService.getPost(
        {
          profileId: this.profileId,
          communityId: this.communityId,
          page: this.activePage,
          size: 15,
        },
        (post) => {
          // this.spinner.hide();
        }
      );

      this.getSeeFirstIdByProfileId(+this.profileId);
    } else {
      this.spinner.show();

      this.postService.getPostsByProfileId(this.profileId).subscribe(
        {
          next: (res: any) => {
            this.spinner.hide();
            if (res) {
              this.postList = res;
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

 loadMore(): void {
    this.spinner.show();
    this.activePage = this.activePage + 1;
    this.postService.getPosts(this.activePage).subscribe(
      {
        next: (res: any) => {
          this.spinner.hide();

          if (res?.data?.length > 0) {
            this.postList = [...this.postList, ...res?.data];
          }
        },
        error:
          (error) => {
            this.spinner.hide();
            console.log(error);
          }
      });
  }

  getSeeFirstIdByProfileId(id: number): void {
    this.seeFirstUserService.getSeeFirstIdByProfileId(id).subscribe({
      next: (res: any) => {
        if (res) {
          res.forEach((element: { SeeFirstProfileId: any }) => {
            this.seeFirstList.push(element.SeeFirstProfileId);
          });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
