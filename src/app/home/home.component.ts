import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbDropdown, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PostComponent } from './poast-modal/post.component';
import { LiveComponent } from '../live-modal/live.component';
import { MyProfileComponent } from '../left-side-bar/my-profile.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../services/post.service';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { slideUp } from '../animations/slideUp';
import { DeletePostComponent } from '../@shared/delete-post-dialog/delete-post.component';
import { UnsubscribeProfileService } from '../services/unsubscribe-profile.service';
import { SeeFirstUserService } from '../services/see-first-user.service';
import { CustomerService } from '../services/customer.service';
import { ToastService } from '../services/toaster.service';
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
  isOpen = false;
  userList = [];
  userNameSearch = '';
  @ViewChild('userSearchDropdownRef', { static: false, read: NgbDropdown })
  userSearchNgbDropdown: NgbDropdown;
  seeFirstList: any = [];
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    public sharedService: SharedService,
    private router: Router,
    private socketService: SocketService,
    private unsubscribeProfileService: UnsubscribeProfileService,
    private seeFirstUserService: SeeFirstUserService,
    private customerService: CustomerService,
    private toaster: ToastService
  ) {
    this.profileId = sessionStorage.getItem('profileId');
  }

  ngOnInit(): void {
    this.getPostList();
  }

  ngAfterViewInit(): void {
    console.log(this.socketService.socket);
    if (!this.socketService.socket.connected) {
      this.socketService.socket.connect();
    }
    this.socketService.socket.emit('join', { room: this.profileId });
    this.socketService.socket.on('notification', (data) => {
      console.log('notification data ==>', data);
      this.sharedService.isNotify = true;
    });
  }

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
  }

  openEmojiMenu(): void {
    this.emojiMenuDialog = this.modalService.open(this.emojiMenu, {
      keyboard: true,
      size: 'xs',
      modalDialogClass: 'emoji-menu-panale',
    });
  }

  reactLikeOnPost(post) {
    post.likescount = post.likescount + 1;
    post.totalReactCount = post.totalReactCount + 1;
    post.react = 'L';
    const data = {
      postId: post.id,
      profileId: this.profileId,
      toProfileId: Number(post.profileid),
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
      postId: post.id,
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
      postId: post.id,
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
      postId: post.id,
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
      postId: post.id,
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
      postId: post.id,
      profileId: this.profileId,
      likeCount: post.likescount,
    };
    this.likeDisLikePost(data);
  }

  likeDisLikePost(data): void {
    this.socketService.likeFeedPost(data, (res) => {
      console.log(res);
    });
    // this.socketService.socket.on(
    //   'new-post',
    //   (data) => {
    //     this.spinner.hide();
    //     this.postList = data;
    //   },
    //   (error) => {
    //     this.spinner.hide();
    //     console.log(error);
    //   }
    // );
  }

  openDropDown(id) {
    this.postId = id;
    // if (this.postId) {
    //   this.isExpand = true;
    // } else {
    //   this.isExpand = false;
    // }
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
    this.socketService.getPost(
      { profileId: this.profileId, page: page, size: 15 },
      (post) => {
        // this.spinner.hide();
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
    this.socketService.socket.on(
      'new-post',
      (data) => {
        this.spinner.hide();
        this.postList = data;
        this.postList.map((ele: any) => {
          ele.totalReactCount =
            ele.likescount +
            ele.wowcount +
            ele.haliriouscount +
            ele.lovecount +
            ele.sadcount;
          return ele;
        });
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
    this.getSeeFirstIdByProfileId(this.profileId);
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
          res.data.forEach((element) => {
            element.totalReactCount =
              element.likescount +
              element.wowcount +
              element.haliriouscount +
              element.lovecount +
              element.sadcount;
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

  seeFirst(postProfileId: number): void {
    this.seeFirstUserService
      .create({ profileId: this.profileId, seeFirstProfileId: postProfileId })
      .subscribe({
        next: (res) => {
          console.log('Res : ', res);
          this.getPostList();
        },
      });

    this.postId = null;
  }

  unsubscribe(post: any): void {
    post['hide'] = true;

    this.unsubscribeProfileService
      .create({
        profileId: this.profileId,
        unsubscribeProfileId: post?.profileid,
      })
      .subscribe({
        next: (res) => {
          console.log('Res : ', res);
        },
      });

    this.postId = null;
  }

  goToViewProfile(id: any): void {
    this.router.navigate([`settings/general/view-profile/${id}`]);
    this.postId = null;
  }

  getLinkData(des: any): void {
    // const defaultValue = des.split('http')[0];
    // console.log(defaultValue);
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
          (res: any) => {
            if (res.meta.image) {
              this.spinner.hide();
              this.postData = {
                metaimage: res.meta?.image?.url,
                metalink: res?.meta?.url || element,
                postdescription: des.split('http')[0],
                metadescription: res?.meta?.description,
                title: res?.meta?.title,
                profileId: this.profileId,
              };
              return this.postData;
            } else {
              this.spinner.hide();
              this.postData = {
                profileId: this.profileId,
                postdescription: des,
              };
              return this.postData;
            }
          },
          (error) => {
            this.spinner.hide();
            this.postData = {
              profileId: this.profileId,
              postdescription: des,
            };
            return this.postData;
          }
        );
      } else {
        this.spinner.hide();
        this.postData = {
          profileId: this.profileId,
          postdescription: des,
        };
        return this.postData;
      }
    });
  }

  messageOnKeyEvent(event: any): void {
    const text = event.target.value;
    const atSymbolIndex = text.lastIndexOf('@');
    console.log('atSymbolIndex : ', atSymbolIndex);

    if (atSymbolIndex !== -1) {
      const query = text.substring(atSymbolIndex + 1);

      if (query) {
        this.getUserList(query);
      } else {
        this.userList = [];
        this.userSearchNgbDropdown.close();
      }
    } else {
      this.userList = [];
      this.userSearchNgbDropdown.close();
    }

    // if (lastChar === '@' || this.userNameSearch) {
    //   this.userNameSearch += lastChar;
    //   console.log('userNameSearch : ', this.userNameSearch);
    //   // value.startsWith('@')

    //   // this.getUserList(value.slice(1));
    //   // console.log('this.userList : ', this.userList);
    // }
  }

  getUserList(search: string): void {
    this.customerService.getProfileList(search).subscribe({
      next: (res: any) => {
        if (res?.data?.length > 0) {
          this.userList = res.data;
          this.userSearchNgbDropdown.open();
        } else {
          this.userList = [];
          this.userSearchNgbDropdown.close();
        }
      },
      error: () => {
        this.userList = [];
        this.userSearchNgbDropdown.close();
      },
    });
  }

  selectTagUser(user: string): void {
    console.log('user : ', user);
  }

  deletePost(post): void {
    this.postId = null;
    console.log(post.id);
    const modalRef = this.modalService.open(DeletePostComponent, {
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
        this.postService.deletePost(post.id).subscribe(
          (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.spinner.hide();
              this.getPostList();
            }
          },
          (error) => {
            this.spinner.hide();
          }
        );
      }
    });
  }

  // getUserList(): void {
  //   this.customerService.getProfileList(this.message).subscribe(
  //     (res: any) => {
  //       if (res) {
  //         this.userList = res.data;
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  removeSeeFirstUser(id: number): void {
    this.seeFirstUserService.remove(Number(this.profileId), id).subscribe({
      next: (res) => {
        this.getPostList();
      },
    });
    this.postId = null;
  }

  getSeeFirstIdByProfileId(id): void {
    this.seeFirstUserService.getSeeFirstIdByProfileId(id).subscribe(
      (res: any) => {
        if (res) {
          res.forEach((element) => {
            this.seeFirstList.push(element.SeeFirstProfileId);
          });
          console.log(this.seeFirstList);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
