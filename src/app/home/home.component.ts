import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Renderer2,
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
import { CommunityService } from '../services/community.service';
import { CommunityPostService } from '../services/community-post.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [slideUp],
})
export class HomeComponent implements OnInit, AfterViewInit {
  isLike = false;
  isExpand = false;
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
  postData: any = {
    profileId: '',
    postdescription: '',
    meta: {},
    tags: [],
  };
  @ViewChild('emojiMenu') emojiMenu: EventEmitter<NgbModalRef[]> | undefined;
  emojiMenuDialog: any;
  isSubmitted = false;
  activePage = 1;
  postId = '';
  profileId = '';
  isOpen = false;
  userList = [];
  userNameSearch = '';

  communityId: number;
  communityDetails: any;
  activeCommunityTab: number = 1;

  @ViewChild('userSearchDropdownRef', { static:false, read: NgbDropdown }) userSearchNgbDropdown: NgbDropdown;
  @ViewChild('postMessageInput', { static: false }) postMessageInput: ElementRef;

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
    private renderer: Renderer2,
    private toaster: ToastService,
    private communityService: CommunityService,
    private communityPostService: CommunityPostService
  ) {
    this.communityId = +history?.state?.data?.id;
    this.profileId = sessionStorage.getItem('profileId');

    this.postData.profileId = this.profileId;
    this.postData.communityId = this.communityId;
  }

  ngOnInit(): void {
    if (this.communityId) {
      this.getCommunityDetails();
    }

    this.getPostList();
  }

  ngAfterViewInit(): void {
    console.log(this.socketService.socket);
    if (!this.socketService.socket.connected) {
      this.socketService.socket.connect();
    }
    this.socketService.socket.emit('join', { room: this.profileId });
    this.socketService.socket.on('notification', (data: any) => {
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
          this.socketService.socket.on('create-new-post', (data: any) => {
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

  reactLikeOnPost(post: { likescount: number; totalReactCount: number; react: string; id: any; profileid: any; }) {
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
  reactLoveOnPost(post: { lovecount: number; totalReactCount: number; react: string; id: any; }) {
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
  reactWowOnPost(post: { wowcount: number; totalReactCount: number; react: string; id: any; }) {
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
  reactHaliriousOnPost(post: { haliriouscount: number; totalReactCount: number; react: string; id: any; }) {
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
  reactSadOnPost(post: { sadcount: number; totalReactCount: number; react: string; id: any; }) {
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

  dislikeFeedPost(post: { react: string; likescount: number; lovecount: number; haliriouscount: number; wowcount: number; sadcount: number; totalReactCount: number; id: any; }) {
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

  likeDisLikePost(data: { postId: any; profileId: string; toProfileId?: number; likeCount: any; actionType?: string; }): void {
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

  openDropDown(id: string) {
    this.postId = id;
    // if (this.postId) {
    //   this.isExpand = true;
    // } else {
    //   this.isExpand = false;
    // }
  }

  addEmoji(event: { emoji: { native: any } }) {
    // const { message } = this;
    // const text = `${message}${event.emoji.native}`;
    // this.message = text;
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

  getCommunityDetails(): void {
    this.spinner.show();
    this.communityService.getCommunityById(this.communityId).subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide();
          if (res?.[0]?.Id) {
            const details = res?.[0];
            if (details?.memberList?.length > 0) {
              details['memberIds'] = details?.memberList?.map((member: any) => member?.profileId);
            }
            this.communityDetails = details;
            console.log('communityDetails : ', this.communityDetails);
          }
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  createCommunityAdmin(member: any): void {
    let data = {};
    if (member.isAdmin === 'Y') {
      data = {
        id: member?.Id,
        isAdmin: 'N',
      };
    } else {
      data = {
        id: member?.Id,
        isAdmin: 'Y',
      };
    }
    this.communityService.createCommunityAdmin(data).subscribe(
      (res: any) => {
        if (res) {
          this.toaster.success(res.message);
          this.getCommunityDetails();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPostList(): void {
    const page = this.activePage;
    this.spinner.show();
    this.socketService.getPost(
      { profileId: this.profileId, communityId: this.communityId, page: page, size: 15 },
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
      (data: any) => {
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
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        console.log(error);
      }
    );
    this.getSeeFirstIdByProfileId(+this.profileId);
  }

  createPost(): void {
    const anchorTags = this.postMessageInput?.nativeElement?.children;

    this.postData.tags = [];
    for (const key in anchorTags) {
      if (Object.prototype.hasOwnProperty.call(anchorTags, key)) {
        const tag = anchorTags[key];

        this.postData.tags.push({ id: tag?.getAttribute('data-id'), name: tag?.innerHTML });
      }
    }

    console.log('this.postData : ', this.postData);

    if (this.postData?.postdescription) {
      this.spinner.show();
      this.socketService.createPost(this.postData, (data) => {
        this.spinner.hide();
        this.toaster.success('Post created successfully.');
        return data;
      });

      this.clearUserSearchData();
      this.renderer.setProperty(this.postMessageInput.nativeElement, 'innerHTML', '');

      this.socketService.socket.on(
        'create-new-post',
        (res: any) => {
          this.postList.push(res);
          this.spinner.hide();
          this.getPostList();
        },
        (error: any) => {
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
          res.data.forEach((element: { totalReactCount: any; likescount: any; wowcount: any; haliriouscount: any; lovecount: any; sadcount: any; }) => {
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

  getLinkData(): void {
    const postHtml = this.postMessageInput.nativeElement.innerHTML;
    const matches = postHtml.match(/(((https?:\/\/)|(www\.))[^\s]+)/gi);
    console.log('matches : ', matches);

    if (matches?.length > 0) {
      const url = matches[0];

      if (!this.postData?.meta?.url?.includes(url)) {
        this.spinner.show();
        this.postService.getMetaData({ url }).subscribe({
          next: (res: any) => {
            if (res?.meta?.image) {
              this.postData.meta = {
                title: res?.meta?.title,
                metadescription: res?.meta?.description,
                metaimage: res.meta?.image?.url,
                metalink: res?.meta?.url || url,
                url: url
              };
            }

            this.spinner.hide();
          },
          error: () => {
            this.spinner.hide();
          }
        });
      }
    }


    // const defaultValue = des.split('http')[0];
    // console.log(defaultValue);

    // const value = des.split(' ');
    // console.log('des : ', des);
    // console.log(value);
    // value.forEach((element) => {
    //   if (
    //     element.includes('http://') ||
    //     element.includes('https://') ||
    //     element.includes('www.')
    //   ) {
    //     this.spinner.show();
    //     this.postService.getMetaData({ url: element }).subscribe(
    //       (res: any) => {
    //         if (res.meta.image) {
    //           this.spinner.hide();
    //           this.postData = {
    //             metaimage: res.meta?.image?.url,
    //             metalink: res?.meta?.url || element,
    //             postdescription: des.split('http')[0],
    //             metadescription: res?.meta?.description,
    //             title: res?.meta?.title,
    //             profileId: this.profileId,
    //           };
    //           return this.postData;
    //         } else {
    //           this.spinner.hide();
    //           this.postData = {
    //             profileId: this.profileId,
    //             postdescription: des,
    //           };
    //           return this.postData;
    //         }
    //       },
    //       (error) => {
    //         this.spinner.hide();
    //         this.postData = {
    //           profileId: this.profileId,
    //           postdescription: des,
    //         };
    //         return this.postData;
    //       }
    //     );
    //   } else {
    //     this.spinner.hide();
    //     this.postData = {
    //       profileId: this.profileId,
    //       postdescription: des,
    //     };
    //     return this.postData;
    //   }
    // });
  }

  messageOnKeyEvent(): void {
    this.getLinkData();

    const text = this.postMessageInput.nativeElement.innerHTML;
    const atSymbolIndex = text.lastIndexOf("@");

    if (atSymbolIndex !== -1) {
      this.userNameSearch = text.substring(atSymbolIndex + 1);
      console.log('userNameSearch : ', this.userNameSearch);

      if (this.userNameSearch?.length > 2) {
        this.getUserList(this.userNameSearch);
      } else {
        this.clearUserSearchData();
      }
    } else {
      this.clearUserSearchData();
    }

    this.postData.postdescription = text;

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
          this.clearUserSearchData();
        }
      },
      error: () => {
        this.clearUserSearchData();
      }
    });
  }

  clearUserSearchData(): void {
    this.userNameSearch = '';
    this.userList = [];
    this.userSearchNgbDropdown.close();
  }

  selectTagUser(user: any): void {
    const postHtml = this.postMessageInput.nativeElement.innerHTML;
    const text = postHtml.replace(`@${this.userNameSearch}`, `<a href="/settings/general/view-profile/${user?.Id}" class="text-warning" data-id="${user?.Id}">@${user?.Username}</a>`)
    console.log('postHtml : ', postHtml);

    this.renderer.setProperty(this.postMessageInput.nativeElement, 'innerHTML', text);

    this.postData.postdescription = text;
  }

  removeTagUser(nameRef: any): void {
    console.log('NameRef : ', nameRef);
  }

  deletePost(post: { id: any; }): void {
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

  getSeeFirstIdByProfileId(id: number): void {
    this.seeFirstUserService.getSeeFirstIdByProfileId(id).subscribe(
      (res: any) => {
        if (res) {
          res.forEach((element: { SeeFirstProfileId: any; }) => {
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
