import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PostComponent } from '../home/poast-modal/post.component';
import { LiveComponent } from '../live-modal/live.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../services/post.service';
import { SharedService } from '../services/shared.service';
import { SocketService } from '../services/socket.service';
import { CommunityPostService } from '../services/community-post.service';
import { CreatePostComponent } from './create-post-modal/create-post.component';
import { Router } from '@angular/router';
import { slideUp } from '../@shared/animations/slideUp';
import { ToastService } from '../services/toaster.service';
import { ConfirmationModalComponent } from '../@shared/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
  animations: [slideUp],
})
export class FavoriteComponent implements OnInit, AfterViewInit {
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
  @ViewChild('emojiMenu') emojiMenu: EventEmitter<NgbModalRef[]> | undefined;
  emojiMenuDialog: any;
  postList = [];
  isLike = false;
  postId = '';
  isExpand = false;
  activePage = 1;
  postData: any = {};
  profileId = '';
  communityId = '';
  seeFirstList: any = [];
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    private socketService: SocketService,
    private communityPostService: CommunityPostService,
    private postService: PostService,
    private router: Router,
    private toaster: ToastService
  ) {
    this.profileId = sessionStorage.getItem('profileId');
    this.communityId = sessionStorage.getItem('communityId');
  }

  ngOnInit(): void {
    this.getPostList();
    // this.sharedService.getProfilePic();
    this.sharedService.getUserDetails();
  }

  ngAfterViewInit(): void {
    console.log(this.socketService.socket);
    if (!this.socketService.socket.connected) {
      this.socketService.socket.connect();
    }
    console.log(this.socketService.socket);

    this.socketService.socket.emit('join', { room: this.profileId });
    this.socketService.socket.on('notification', (data) => {
      console.log('notification data ==>', data);
      this.sharedService.isNotify = true;
    });
  }

  addPost() {
    const modalRef = this.modalService.open(CreatePostComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
    modalRef.componentInstance.closeIcon = true;
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.communityPostService.postData.profileid =
          sessionStorage.getItem('profileId');
        this.communityPostService.postData.communityId =
          sessionStorage.getItem('communityId');
        this.communityPostService.postData.imageUrl =
          this.communityPostService.selectedFile;
        this.spinner.show();
        if (this.communityPostService.postData) {
          this.spinner.hide();
          this.socketService.createCommunityPost(
            this.communityPostService.postData,
            (data) => {
              return data;
            }
          );
          this.socketService.socket.on('create-community-post', (data) => {
            this.postList.push(data);
            this.getPostList();
          });
        }
      }
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

  addEmoji(event: { emoji: { native: any } }) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
    this.message = text;
  }

  openEmojiMenu(): void {
    this.emojiMenuDialog = this.modalService.open(this.emojiMenu, {
      keyboard: true,
      size: 'xs',
      modalDialogClass: 'emoji-menu-panale',
    });
  }

  getPostList(): void {
    this.spinner.show();
    const page = this.activePage;
    this.socketService.getCommunityPost(
      { profileId: this.profileId, page: page, size: 15 },
      (data) => {
        return data;
      }
    );

    this.socketService.socket.on(
      'community-post',
      (data) => {
        this.spinner.hide();
        this.postList = data;
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );

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
  }

  loadMore(): void {
    this.spinner.show();
    this.activePage = this.activePage + 1;
    this.communityPostService.getPosts(this.activePage).subscribe(
      {
        next: (res: any) => {
          if (res) {
            this.spinner.hide();
            res.data.forEach((element) => {
              this.postList.push(element);
            });
          }
        },
        error:
          (error) => {
            this.spinner.hide();
            console.log(error);
          }
      });
  }

  createNewPost(): void {
    if (this.postData) {
      this.message = '';
      this.socketService.createCommunityPost(this.postData, (data) => {
        this.spinner.hide();
      });
      this.socketService.socket.on('create-community-post', (res) => {
        this.postList.push(res);
        this.getPostList();
      });
      // if (this.postData) {
      //   this.postService.createPost(this.postData).subscribe(
      //     (res: any) => {
      //       this.spinner.hide();
      //       console.log(res);
      //       this.getPostList();
      //     },
      //     (error) => {
      //       this.spinner.hide();
      //       console.log(error);
      //     }
      //   );
      // }
    }
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

  getLinkData(des: any): void {
    const defaultValue = des.split('http')[0];
    console.log(defaultValue);
    const value = des.split(' ');
    console.log(value);
    value.forEach((element) => {
      if (
        element.includes('http://') ||
        element.includes('https://') ||
        element.includes('www.')
      ) {
        this.spinner.show();
        this.postService.getMetaData({ url: element }).subscribe(
          {
            next: (res: any) => {
              this.spinner.hide();
              if (res.meta.image) {
                this.postData = {
                  metaimage: res.meta?.image?.url,
                  metalink: res?.meta?.url || element,
                  description: des.split('http')[0],
                  metadescription: res?.meta?.description,
                  title: res?.meta?.title,
                  profileId: this.profileId,
                  communityId: this.communityId,
                };
                return this.postData;
              } else {
                this.postData = {
                  profileId: this.profileId,
                  description: des,
                  communityId: this.communityId,
                };
                return this.postData;
              }
            },
            error:
              (error) => {
                this.spinner.hide();
                this.postData = {
                  profileId: this.profileId,
                  description: des,
                  communityId: this.communityId,
                };
                return this.postData;
              }
          });
      } else {
        this.postData = {
          profileId: this.profileId,
          description: des,
          communityId: this.communityId,
        };
        return this.postData;
      }
    });
  }

  goToViewProfile(id: any): void {
    this.router.navigate([`settings/view-profile/${id}`]);
    this.postId = null;
  }

  deletePost(post): void {
    this.postId = null;
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Delete Post';
    modalRef.componentInstance.confirmButtonLabel = 'Delete';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to delete this post?';
    modalRef.result.then((res) => {
      console.log(res);
      if (res === 'success') {
        // post['hide'] = true;
        this.communityPostService.deletePost(post.Id).subscribe(
          {
            next: (res: any) => {
              this.spinner.hide();
              if (res) {
                this.toaster.success(res.message);
                this.getPostList();
              }
            },
            error:
              (error) => {
                this.spinner.hide();
              }
          });
      }
    });
  }

  reactLikeOnPost(post) {
    post.likescount = post.likescount + 1;
    post.totalReactCount = post.totalReactCount + 1;
    post.react = 'L';
    const data = {
      communityPostId: post.Id,
      profileId: this.profileId,
      toProfileId: Number(post.profileId),
      likeCount: post.likescount,
      actionType: 'L',
    };
    this.likeDisLikePost(data);
  }
  reactLoveOnPost(post) {
    post.lovecount = post.lovecount + 1;
    post.totalReactCount = post.totalReactCount + 1;
    post.react = 'LO';
    const data = {
      communityPostId: post.Id,
      profileId: this.profileId,
      likeCount: post.lovecount,
      actionType: 'LO',
    };
    this.likeDisLikePost(data);
  }
  reactWowOnPost(post) {
    post.wowcount = post.wowcount + 1;
    post.totalReactCount = post.totalReactCount + 1;
    post.react = 'WO';
    const data = {
      communityPostId: post.Id,
      profileId: this.profileId,
      likeCount: post.wowcount,
      actionType: 'WO',
    };
    this.likeDisLikePost(data);
  }
  reactHaliriousOnPost(post) {
    post.haliriouscount = post.haliriouscount + 1;
    post.totalReactCount = post.totalReactCount + 1;
    post.react = 'HA';
    const data = {
      communityPostId: post.Id,
      profileId: this.profileId,
      likeCount: post.haliriouscount,
      actionType: 'HA',
    };
    this.likeDisLikePost(data);
  }
  reactSadOnPost(post) {
    post.sadcount = post.sadcount + 1;
    post.totalReactCount = post.totalReactCount + 1;
    post.react = 'SA';
    const data = {
      communityPostId: post.Id,
      profileId: this.profileId,
      likeCount: post.sadcount,
      actionType: 'SA',
    };
    this.likeDisLikePost(data);
  }

  dislikeFeedPost(post) {
    if (post.react == 'L') {
      post.likescount = post.likescount - 1;
    } else if (post.react == 'LO') {
      post.lovecount = post.lovecount - 1;
    } else if (post.react == 'HA') {
      post.haliriouscount = post.haliriouscount - 1;
    } else if (post.react == 'WO') {
      post.wowcount = post.wowcount - 1;
    } else if (post.react == 'SA') {
      post.sadcount = post.sadcount - 1;
    }
    post.totalReactCount = post.totalReactCount - 1;
    post.react = null;
    const data = {
      communityPostId: post.Id,
      profileId: this.profileId,
      likeCount: post.likescount,
    };
    this.likeDisLikePost(data);
  }

  likeDisLikePost(data): void {
    this.socketService.likeFeedPost(data, (res) => {
      console.log(res);
    });
    this.socketService.socket.on(
      'community-post',
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

  getSeeFirstIdByProfileId(id): void {
    // this.seeFirstUserService.getSeeFirstIdByProfileId(id).subscribe(
    //   (res: any) => {
    //     if (res) {
    //       res.forEach((element) => {
    //         this.seeFirstList.push(element.SeeFirstProfileId);
    //       });
    //       console.log(this.seeFirstList);
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  removeSeeFirstUser(id: number): void {
    // this.seeFirstUserService.remove(Number(this.profileId), id).subscribe({
    //   next: (res) => {
    //     this.getPostList();
    //   },
    // });
    this.postId = null;
  }

  unsubscribe(post: any): void {
    // post['hide'] = true;

    // this.unsubscribeProfileService
    //   .create({
    //     profileId: this.profileId,
    //     unsubscribeProfileId: post?.profileid,
    //   })
    //   .subscribe({
    //     next: (res) => {
    //       console.log('Res : ', res);
    //     },
    //   });

    this.postId = null;
  }

  seeFirst(postProfileId: number): void {
    // this.seeFirstUserService
    //   .create({ profileId: this.profileId, seeFirstProfileId: postProfileId })
    //   .subscribe({
    //     next: (res) => {
    //       console.log('Res : ', res);
    //       this.getPostList();
    //     },
    //   });

    this.postId = null;
  }
}
