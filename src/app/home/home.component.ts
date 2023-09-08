import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgbDropdown, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LiveComponent } from '../live-modal/live.component';
import { MyProfileComponent } from '../left-side-bar/my-profile.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../services/post.service';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { slideUp } from '../animations/slideUp';
import { UnsubscribeProfileService } from '../services/unsubscribe-profile.service';
import { SeeFirstUserService } from '../services/see-first-user.service';
import { CustomerService } from '../services/customer.service';
import { ToastService } from '../services/toaster.service';
import { CommunityService } from '../services/community.service';
import { CommunityPostService } from '../services/community-post.service';
import { ConfirmationModalComponent } from '../@shared/confirmation-modal/confirmation-modal.component';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [slideUp],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
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
    profileid: '',
    communityId: '',
    postdescription: '',
    meta: {},
    tags: [],
    file: {},
    imageUrl: '',
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
  postComment: string = '';

  @ViewChild('userSearchDropdownRef', { static: false, read: NgbDropdown })
  userSearchNgbDropdown: NgbDropdown;
  @ViewChild('postMessageInput', { static: false })
  postMessageInput: ElementRef;
  @ViewChild('commentMessageInput', { static: false })
  commentMessageInput: ElementRef;
  seeFirstList: any = [];
  commentDes = '';
  commentList: any = [];
  replyCommentList: any = [];
  isReply = false;
  commentId = null;
  isOpenCommentsPostId = '';
  ngUnsubscribe: Subject<void> = new Subject<void>();

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

    this.postData.profileid = +this.profileId;
    this.postData.communityId = this.communityId;
  }

  ngOnInit(): void {
    if (this.communityId) {
      this.getCommunityDetails();
    }

    this.getPostList();
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // addPost() {
  //   const modalRef = this.modalService.open(PostComponent, {
  //     centered: true,
  //     backdrop: 'static',
  //     keyboard: false,
  //   });
  //   modalRef.componentInstance.cancelButtonLabel = 'Cancel';
  //   modalRef.componentInstance.confirmButtonLabel = 'Post';
  //   modalRef.componentInstance.closeIcon = true;
  //   modalRef.result.then((res) => {
  //     if (res === 'success') {
  //       this.postService.postData.profileid =
  //         sessionStorage.getItem('profileId');
  //       this.postService.postData.imageUrl = this.postService.selectedFile;
  //       // this.spinner.show();
  //       if (this.postService.postData) {
  //         // this.spinner.hide();
  //         this.socketService.createPost(this.postService.postData, (data) => {
  //           return data;
  //         });
  //         this.socketService.socket.on('create-new-post', (data: any) => {
  //           this.postList.push(data);
  //           this.getPostList();
  //         });
  //       }
  //     }
  //     // return res = user_id
  //   });
  // }

  onPostFileSelect(event: any): void {
    const file = event.target?.files?.[0] || {};
    if (file) {
      this.postData['file'] = file;
      this.postData['imageUrl'] = URL.createObjectURL(file);
    }
    console.log('this.postData[files] : ', this.postData['file']);
  }

  removePostSelectedFile(): void {
    this.postData['file'] = null;
    this.postData['imageUrl'] = '';
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

  reactLikeOnPost(post: {
    likescount: number;
    totalReactCount: number;
    react: string;
    id: any;
    profileid: any;
  }) {
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
  reactLoveOnPost(post: {
    lovecount: number;
    totalReactCount: number;
    react: string;
    id: any;
  }) {
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
  reactWowOnPost(post: {
    wowcount: number;
    totalReactCount: number;
    react: string;
    id: any;
  }) {
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
  reactHaliriousOnPost(post: {
    haliriouscount: number;
    totalReactCount: number;
    react: string;
    id: any;
  }) {
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
  reactSadOnPost(post: {
    sadcount: number;
    totalReactCount: number;
    react: string;
    id: any;
  }) {
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

  dislikeFeedPost(post: {
    react: string;
    likescount: number;
    lovecount: number;
    haliriouscount: number;
    wowcount: number;
    sadcount: number;
    totalReactCount: number;
    id: any;
  }) {
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

  likeDisLikePost(data: {
    postId: any;
    profileId: string;
    toProfileId?: number;
    likeCount: any;
    actionType?: string;
  }): void {
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
              details['memberIds'] = details?.memberList?.map(
                (member: any) => member?.profileId
              );
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
    this.postData.profileid = +this.profileId;
    this.socketService.getPost(
      {
        profileId: this.profileId,
        communityId: this.communityId,
        page: page,
        size: 15,
      },
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
    // this.spinner.show();
    this.socketService.socket.on(
      'new-post',
      (data: any) => {
        if (data.length > 0) {
          this.postList = data;
          // this.postList.map((ele: any) => {
          //   ele.totalReactCount =
          //     ele.likescount +
          //     ele.wowcount +
          //     ele.haliriouscount +
          //     ele.lovecount +
          //     ele.sadcount;
          //   return ele;
          // });
          // this.spinner.hide();
        }
      },
      (error: any) => {
        // this.spinner.hide();
        console.log(error);
      }
    );
    this.getSeeFirstIdByProfileId(+this.profileId);
  }

  uploadPostFileAndCreatePost(): void {
    console.log('this.postData : ', this.postData);

    if (this.postData?.postdescription) {
      if (this.postData?.file?.name) {
        this.spinner.show();
        this.postService.upload(this.postData?.file, this.profileId).subscribe({
          next: (res: any) => {
            if (res?.body?.url) {
              this.postData['file'] = null;
              this.postData['imageUrl'] = res?.body?.url;
              this.submit();
            }

            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
          },
        });
      } else {
        this.submit();
      }
    }
  }

  submit(): void {
    if (this.postData.id) {
      this.editPost();
    } else {
      this.createNewPost();
    }
  }

  createNewPost(): void {
    const anchorTags = this.postMessageInput?.nativeElement?.children;

    this.postData.tags = [];
    for (const key in anchorTags) {
      if (Object.prototype.hasOwnProperty.call(anchorTags, key)) {
        const tag = anchorTags[key];

        this.postData.tags.push({
          id: tag?.getAttribute('data-id'),
          name: tag?.innerHTML,
        });
      }
    }

    console.log('this.postData : ', this.postData);

    if (this.postData?.postdescription) {
      this.spinner.show();
      this.socketService.createPost(this.postData, (data) => {
        this.spinner.hide();
        this.toaster.success('Post created successfully.');

        this.postData['postdescription'] = '';
        this.postData['meta'] = {};
        this.postData['tags'] = [];
        this.postData['file'] = {};
        this.postData['imageUrl'] = '';

        return data;
      });

      this.clearUserSearchData();
      this.renderer.setProperty(
        this.postMessageInput.nativeElement,
        'innerHTML',
        ''
      );

      this.socketService.socket.on(
        'new-post-added',
        (res: any) => {
          console.log('res: ', res);

          this.postList.push(res);
          this.spinner.hide();
          this.activePage = 1;
          this.getPostList();

          this.postData['postdescription'] = '';
          this.postData['meta'] = {};
          this.postData['tags'] = [];
          this.postData['file'] = {};
          this.postData['imageUrl'] = '';
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
          res.data.forEach(
            (element: {
              totalReactCount: any;
              likescount: any;
              wowcount: any;
              haliriouscount: any;
              lovecount: any;
              sadcount: any;
            }) => {
              // element.totalReactCount =
              //   element.likescount +
              //   element.wowcount +
              //   element.haliriouscount +
              //   element.lovecount +
              //   element.sadcount;
              this.postList.push(element);
            }
          );
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
        this.ngUnsubscribe.next();

        this.postService
          .getMetaData({ url })
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: (res: any) => {
              if (res?.meta?.image) {
                this.postData.meta = {
                  title: res?.meta?.title,
                  metadescription: res?.meta?.description,
                  metaimage: res.meta?.image?.url,
                  metalink: res?.meta?.url || url,
                  url: url,
                };
              }

              this.spinner.hide();
            },
            error: () => {
              this.spinner.hide();
            },
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
    const atSymbolIndex = text.lastIndexOf('@');

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
    console.log(text);
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
      },
    });
  }

  clearUserSearchData(): void {
    this.userNameSearch = '';
    this.userList = [];
    this.userSearchNgbDropdown.close();
  }

  selectTagUser(user: any): void {
    const postHtml = this.postMessageInput.nativeElement.innerHTML;
    const text = postHtml.replace(
      `@${this.userNameSearch}`,
      `<a href="/settings/general/view-profile/${user?.Id}" class="text-warning" data-id="${user?.Id}">@${user?.Username}</a>`
    );
    console.log('postHtml : ', postHtml);

    this.renderer.setProperty(
      this.postMessageInput.nativeElement,
      'innerHTML',
      text
    );

    this.postData.postdescription = text;
  }

  removeTagUser(nameRef: any): void {
    console.log('NameRef : ', nameRef);
  }

  deletePost(post: { id: any }): void {
    this.postId = null;
    console.log(post.id);
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
        this.postService.deletePost(post.id).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.spinner.hide();
              this.getPostList();
            }
          },
          error: (error) => {
            this.spinner.hide();
          },
        });
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

  // commentOnKeyEvent(childPostCommentElement): void {
  //   const text = childPostCommentElement.innerHTML;
  //   // const atSymbolIndex = text.lastIndexOf('@');

  //   // if (atSymbolIndex !== -1) {
  //   //   this.userNameSearch = text.substring(atSymbolIndex + 1);
  //   //   console.log('userNameSearch : ', this.userNameSearch);

  //   //   // if (this.userNameSearch?.length > 2) {
  //   //   //   this.getUserList(this.userNameSearch);
  //   //   // } else {
  //   //   //   this.clearUserSearchData();
  //   //   // }
  //   // } else {
  //   //   this.clearUserSearchData();
  //   // }
  //   // console.log(text);
  //   this.postComment = text;

  //   // if (lastChar === '@' || this.userNameSearch) {
  //   //   this.userNameSearch += lastChar;
  //   //   console.log('userNameSearch : ', this.userNameSearch);
  //   //   // value.startsWith('@')

  //   //   // this.getUserList(value.slice(1));
  //   //   // console.log('this.userList : ', this.userList);
  //   // }
  // }

  commentOnPost(parentPostCommentElement, id): void {
    this.postComment = parentPostCommentElement.innerHTML;

    if (this.postComment) {
      const commentData = {
        postId: id,
        comment: this.postComment,
        profileId: this.profileId,
      };
      console.log(commentData);
      this.socketService.commentOnPost(commentData, (data) => {
        this.toaster.success('comment added on post');
        this.postComment = '';
        parentPostCommentElement.innerText = '';
      });
      this.socketService.socket.on('comments-on-post', (data: any) => {
        console.log(data);
        this.commentList.push(data[0]);
        this.isExpand = true;
        this.viewComments(id);
        this.postComment = '';
        parentPostCommentElement.innerText = '';
      });
    } else {
      this.toaster.danger('Please enter comment');
    }
  }

  viewComments(id): void {
    this.isExpand = this.isOpenCommentsPostId == id ? false : true;
    this.isOpenCommentsPostId = id;
    if (!this.isExpand) {
      this.isOpenCommentsPostId = null;
    } else {
      this.isOpenCommentsPostId = id;
    }
    // this.isOpenCommentsPostId = id;
    this.postService.getComments(id).subscribe({
      next: (res) => {
        if (res) {
          console.log(res.data);
          // this.commentList = res.data.commmentsList.filter((ele: any) => {
          //   res.data.replyCommnetsList.some((element: any) => {
          //     if (ele?.id === element?.parentCommentId) {
          //       ele?.replyCommnetsList.push(element);
          //       return ele;
          //     }
          //   });
          //   console.log(this.commentList);
          // });
          this.commentList = res.data.commmentsList.map((ele: any) => ({
            ...ele,
            replyCommnetsList: res.data.replyCommnetsList.filter((ele1) => {
              return ele.id === ele1.parentCommentId;
            }),
          }));
          console.log(this.commentList);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteComments(id): void {
    this.postService.deleteComments(id).subscribe({
      next: (res: any) => {
        this.toaster.success(res.message);
        this.viewComments(this.isOpenCommentsPostId);
      },
      error: (error) => {
        console.log(error);
        this.toaster.danger(error.message);
      },
    });
  }

  showReplySection(id) {
    this.isReply = this.commentId == id ? false : true;
    this.commentId = id;
    if (!this.isReply) {
      this.commentId = null;
    }
  }

  replyOnComment(childPostCommentElement, id, commentId): void {
    this.postComment = childPostCommentElement.innerHTML;

    if (this.postComment) {
      const commentData = {
        postId: id,
        comment: this.postComment,
        profileId: this.profileId,
        parentCommentId: commentId,
      };
      this.socketService.commentOnPost(commentData, (data) => {
        this.toaster.success('replied on comment');
        this.postComment = '';
        childPostCommentElement.innerText = '';
      });
      this.socketService.socket.on('comments-on-post', (data: any) => {
        console.log(data);
        this.commentList.map((ele: any) =>
          data.filter((ele1) => {
            if (ele.id === ele1.parentCommentId) {
              ele?.['replyCommnetsList'].push(ele1);
              return ele;
            }
          })
        );
        console.log(this.commentList);
        this.isReply = false;
        this.commentId = null;
        // this.getPostList();
      });
    } else {
      this.toaster.danger('Please enter comment');
    }
  }

  likeComments(comment): void {
    comment.likeCount = comment.likeCount + 1;
    comment.react = 'L';
    const data = {
      postId: comment.postId,
      commentId: comment.id,
      profileId: Number(this.profileId),
      toProfileId: Number(comment.profileId),
      likeCount: comment.likeCount,
      actionType: 'L',
    };
    console.log(data);
    this.socketService.likeFeedComments(data, (res) => {
      console.log(res);
    });
  }
  disLikeComments(comment): void {
    comment.likeCount = comment.likeCount - 1;
    comment.react = null;
    const data = {
      postId: comment.postId,
      commentId: comment.id,
      profileId: Number(this.profileId),
      toProfileId: Number(comment.profileId),
      likeCount: comment.likeCount,
    };
    console.log(data);
    this.socketService.likeFeedComments(data, (res) => {
      console.log(res);
    });
  }

  getPostById(post): void {
    this.postData = post;
    post['hide'] = true;
    this.postData.imageUrl = post?.imageUrl;
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.renderer.setProperty(
      this.postMessageInput.nativeElement,
      'innerHTML',
      this.postData?.postdescription
    );
  }

  editPost(): void {
    const anchorTags = this.postMessageInput?.nativeElement?.children;
    this.postData.tags = [];
    for (const key in anchorTags) {
      if (Object.prototype.hasOwnProperty.call(anchorTags, key)) {
        const tag = anchorTags[key];

        this.postData.tags.push({
          id: tag?.getAttribute('data-id'),
          name: tag?.innerHTML,
        });
      }
    }

    console.log('this.postData : ', this.postData);

    if (this.postData?.postdescription) {
      this.spinner.show();
      this.socketService.editPost(this.postData, (data) => {
        this.spinner.hide();
        this.toaster.success('Post edited successfully.');
        return data;
      });
      this.postData['id'] = '';
      this.postData['postdescription'] = '';
      this.postData['meta'] = {};
      this.postData['tags'] = [];
      this.postData['file'] = {};
      this.postData['imageUrl'] = '';
      this.spinner.hide();

      this.clearUserSearchData();
      this.renderer.setProperty(
        this.postMessageInput.nativeElement,
        'innerHTML',
        ''
      );
      this.getPostList();

      // this.socketService.socket.on(
      //   'new-post-added',
      //   (res: any) => {
      //     this.postList.push(res);
      //     this.spinner.hide();
      //     this.getPostList();
      //     this.postData = {};
      //   },
      //   (error: any) => {
      //     this.spinner.hide();
      //     console.log(error);
      //   }
      // );
    }
  }
  resetPost() {
    if (this.postData.id) {
      this.getPostList();
    }
    this.postData = {};
    this.renderer.setProperty(
      this.postMessageInput.nativeElement,
      'innerHTML',
      ''
    );
  }

  joinCommunity(): void {
    const profileId = sessionStorage.getItem('profileId');
    const data = {
      profileId: profileId,
      communityId: this.communityDetails?.Id,
      IsActive: 'Y',
    };
    this.communityService.joinCommunity(data).subscribe(
      (res: any) => {
        if (res) {
          this.getCommunityDetails();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  removeFromCommunity(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Leave Community';
    modalRef.componentInstance.confirmButtonLabel = 'Leave';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to Leave from this community?';
    modalRef.result.then((res) => {
      console.log(res);
      if (res === 'success') {
        const profileId = Number(sessionStorage.getItem('profileId'));
        this.communityService.removeFromCommunity(this.communityDetails?.Id, profileId).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.getCommunityDetails();
            }
          },
          error: (error) => {
            console.log(error);
            this.toaster.danger(error.message);
          },
        });
      }
    });
  }

  deleteCommunity(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Delete Community';
    modalRef.componentInstance.confirmButtonLabel = 'Delete';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to delete this community?';
    modalRef.result.then((res) => {
      console.log(res);
      if (res === 'success') {
        this.communityService.deleteCommunity(this.communityDetails?.Id).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.getCommunityDetails();
            }
          },
          error: (error) => {
            console.log(error);
            this.toaster.success(error.message);
          },
        });
      }
    });
  }
}
