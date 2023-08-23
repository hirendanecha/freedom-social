import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PostComponent } from './poast-modal/post.component';
import { LiveComponent } from '../live-modal/live.component';
import { MyProfileComponent } from '../left-side-bar/my-profile.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../services/post.service';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { slideUp } from '../animations/slideUp';
import { UnsubscribeProfileService } from '../services/unsubscribe.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [slideUp],
})
export class HomeComponent implements OnInit, AfterViewInit {
  isLike = false;
  isExpand = false;
  message = '';
  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'messenger',
    'apple',
  ];
  postList: any = [];
  postData: any = {};
  @ViewChild('emojiMenu') emojiMenu: EventEmitter<NgbModalRef[]> | undefined;
  emojiMenuDialog: any;
  isSubmitted = false;
  activePage = 1;
  postId = '';
  profileId = '';
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    public sharedService: SharedService,
    private router: Router,
    private socketService: SocketService,
    private unsubscribeProfileService: UnsubscribeProfileService
  ) {
    this.profileId = sessionStorage.getItem('profileId');
  }

  ngOnInit(): void {
    this.getPostList();
  }

  ngAfterViewInit(): void {}

  addPost() {
    const modalRef = this.modalService.open(PostComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
    modalRef.componentInstance.closeIcon = true;
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.postService.postData.profileid =
          sessionStorage.getItem('profileId');
        this.postService.postData.imageUrl = this.postService.selectedFile;
        // this.spinner.show();
        if (this.postService.postData) {
          // this.spinner.hide();
          this.socketService.createPost(this.postService.postData, (data) => {
            return data;
          });
          this.socketService.socket.on('create-new-post', (data) => {
            this.postList.push(data);
            this.getPostList();
          });
        }
      }
      // return res = user_id
    });
  }

  goLive() {
    const modalRef = this.modalService.open(LiveComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Go Live';
    modalRef.componentInstance.closeIcon = true;
    // modelRef.result.then(res => {
    //   return res = user_id
    // });
  }

  openEmojiMenu(): void {
    this.emojiMenuDialog = this.modalService.open(this.emojiMenu, {
      keyboard: true,
      size: 'xs',
      modalDialogClass: 'emoji-menu-panale',
    });
  }

  clickOnLike() {
    this.isLike = !this.isLike;
  }

  openDropDown(id) {
    this.postId = id;
    if (this.postId) {
      this.isExpand = true;
    } else {
      this.isExpand = false;
    }
  }

  addEmoji(event: { emoji: { native: any } }) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
    this.message = text;
  }

  openMenuList() {
    const modalRef = this.modalService.open(MyProfileComponent, {
      centered: true,
      keyboard: false,
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
    modalRef.componentInstance.closeIcon = true;
  }

  getPostList(): void {
    const page = this.activePage;
    this.spinner.show();
    this.socketService.getPost({ profileId: this.profileId, page: page, size: 15 }, (post) => {
      // this.spinner.hide();
    });
    // this.postService.getPosts(page).subscribe(
    //   (res: any) => {
    //     if (res) {
    //       this.postList = res;
    //       this.spinner.hide();
    //     }
    //   },
    //   (error) => {
    //     this.spinner.hide();
    //     console.log(error);
    //   }
    // );
    this.socketService.socket.on(
      'new-post',
      (data) => {
        this.spinner.hide();
        this.postList = data;
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  createPost(): void {
    if (this.postData) {
      this.message = '';
      this.spinner.show();
      this.socketService.createPost(this.postData, (data) => {
        return data;
      });
      this.socketService.socket.on(
        'create-new-post',
        (res) => {
          this.postList.push(res);
          this.spinner.hide();
          this.getPostList();
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
    }
  }

  loadMore(): void {
    this.spinner.show();
    this.activePage = this.activePage + 1;
    this.postService.getPosts(this.activePage).subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide();
          res.forEach((element) => {
            this.postList.push(element);
          });
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  unsubscribe(post: any): void {
    post['hide'] = true;

    this.unsubscribeProfileService.create({ profileId: this.profileId, unsubscribeProfileId: post?.profileid }).subscribe({
      next: (res) => {
        console.log('Res : ', res);
      }
    });
  }

  goToViewProfile(id: any): void {
    this.router.navigate([`settings/view-profile/${id}`]);
    this.postId = null;
  }

  getLinkData(des: any): void {
    const value = des;
    if (
      value.includes('http://') ||
      value.includes('https://') ||
      value.includes('www.')
    ) {
      this.spinner.show();
      this.postService.getMetaData({ url: value }).subscribe(
        (res: any) => {
          if (res.meta.image) {
            this.spinner.hide();
            this.postData = {
              imageUrl: res.meta?.image?.url,
              metalink: res?.meta?.url,
              postdescription: res?.meta?.description,
              profileId: this.profileId,
            };
            return this.postData;
          } else {
            this.spinner.hide();
            this.postData = {
              profileId: this.profileId,
              postdescription: value,
            };
            return this.postData;
          }
        },
        (error) => {
          this.spinner.hide();
          this.postData = {
            profileId: this.profileId,
            postdescription: value,
          };
          return this.postData;
        }
      );
    } else {
      this.spinner.hide();
      this.postData = {
        profileId: this.profileId,
        postdescription: value,
      };
      return this.postData;
    }
  }

  deletePost(id): void {
    this.spinner.show();
    this.postId = null;
    this.postService.deletePost(id).subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide();
          this.getPostList();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
}
