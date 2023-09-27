import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { slideUp } from 'src/app/@shared/animations/slideUp';
import { PostService } from 'src/app/@shared/services/post.service';
import { SeeFirstUserService } from 'src/app/@shared/services/see-first-user.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { SocketService } from 'src/app/@shared/services/socket.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  animations: [slideUp],
})
export class PostListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input('parentComponent') parentComponent: string = '';
  @Input('communityId') communityId: number = null;
  @Output('onEditPost') onEditPost: EventEmitter<any> = new EventEmitter<any>();

  postList = [];
  isPostLoader: boolean = false;
  seeFirstList = [];
  profileId: string = '';
  activePage = 0;
  editPostIndex: number = null;
  isLoading = false;
  hasMoreData = true;

  constructor(
    private spinner: NgxSpinnerService,
    private postService: PostService,
    public sharedService: SharedService,
    private socketService: SocketService,
    private seeFirstUserService: SeeFirstUserService,
  ) {
    this.profileId = localStorage.getItem('profileId');
  }

  ngAfterViewInit(): void {
    if (!this.socketService.socket.connected) {
      this.socketService.socket.connect();
    }

    this.socketService.socket.on('new-post-added',
      (res: any) => {
        if (res?.[0]) {
          if (this.editPostIndex >= 0) {
            this.postList[this.editPostIndex] = res?.[0];
          } else {
            this.postList.unshift(res?.[0]);
          }
        }
      },
      (error: any) => {
        console.log(error);
      }
    );

    // this.socketService.socket.on(
    //   'new-post',
    //   (data: any) => {
    //     this.spinner.hide();

    //     if (data.length > 0) {
    //       this.postList = data;
    //     }
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getPostList();
  }

  getPostList(): void {
    this.activePage = 0;
    this.postList = [];

    if (this.parentComponent === 'HomeComponent') {
      this.loadMore();
    } else {
      this.isPostLoader = true;
      this.postService.getPostsByProfileId(this.profileId).subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.postList = res?.data;
          }
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.isPostLoader = false;
        }
      });
    }
  }

@HostListener('window:scroll', ['$event'])
onScroll(event: Event) {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const thresholdFraction = 0.2;
  const threshold = windowHeight * thresholdFraction;

  if (scrollY + windowHeight >= documentHeight - threshold) {
    if (!this.isLoading && this.hasMoreData) {
        this.loadMore();
    }
  }
}

  loadMore(): void {
    this.isPostLoader = true;
    this.isLoading = true;
    
    if (!this.communityId && this.activePage === 0) {
      this.getSeeFirstIdByProfileId(+this.profileId);
    }

    this.activePage = this.activePage + 1;
    this.postService.getPosts({ profileId: this.profileId, communityId: this.communityId, page: this.activePage, size: 15 }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isPostLoader = false;
        if (res?.data?.length > 0) {
          this.postList = [...this.postList, ...res?.data];
        } else {
          this.hasMoreData = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      },
      complete: () => {
        this.isPostLoader = false;
        this.isLoading = false;
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

  onEditPostData(post: any, index: number): void {
    this.editPostIndex = index;
    this.onEditPost?.emit(post);
  }
}
