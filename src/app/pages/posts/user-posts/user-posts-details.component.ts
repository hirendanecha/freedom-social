import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/@shared/modals/confirmation-modal/confirmation-modal.component';
import { PostService } from 'src/app/@shared/services/post.service';
import { SeeFirstUserService } from 'src/app/@shared/services/see-first-user.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { ToastService } from 'src/app/@shared/services/toaster.service';
import { UnsubscribeProfileService } from 'src/app/@shared/services/unsubscribe-profile.service';

@Component({
  selector: 'app-post-lists-details',
  templateUrl: './user-posts-details.component.html',
  styleUrls: ['./user-posts-details.component.scss'],
})
export class UserPostDetailsComponent implements OnInit {
  profileId: any;
  postId = '';
  isExpand = false;
  @ViewChild('emojiMenu') emojiMenu: EventEmitter<NgbModalRef[]> | undefined;
  emojiMenuDialog: any;
  postList = [];
  isLike = false;
  postComment: string = '';
  @ViewChild('postMessageInput', { static: false })
  postMessageInput: ElementRef;
  @ViewChild('commentMessageInput', { static: false })
  commentMessageInput: ElementRef;
  commentDes = '';
  commentList: any = [];
  replyCommentList: any = [];
  isReply = false;
  commentId = null;
  isOpenCommentsPostId = '';
  postData: any = {
    profileid: '',
    communityId: '',
    postdescription: '',
    meta: {},
    tags: [],
    file: {},
    imageUrl: '',
  };
  userList = [];
  userNameSearch = '';
  activePage = 1;
  seeFirstList: any = [];
  commentData: any = {
    postId: '',
    comment: '',
    profileId: '',
    file: {},
    imageUrl: '',
    parentCommentId: null
  }
  isParent = false;
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    public sharedService: SharedService,
    private socketService: SocketService,
    private toaster: ToastService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private unsubscribeProfileService: UnsubscribeProfileService,
    private seeFirstUserService: SeeFirstUserService
  ) {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.profileId = +sessionStorage.getItem('profileId');
  }

  ngOnInit(): void {
    this.getPostList();
  }

  getPostList(): void {
    this.spinner.show();
    const id = 70418;
    this.postService.getPostsByPostId(this.postId).subscribe(
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
      if (res === 'success') {
        // post['hide'] = true;
        this.postService.deletePost(post.id).subscribe(
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
      postId: post.id,
      profileId: this.profileId,
      likeCount: post.likescount,
      actionType: 'L',
    };
    this.likeDisLikePost(data);
  }

  dislikeFeedPost(post) {
    if (post.react == 'L') {
      post.likescount = post.likescount - 1;
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
      return;
    });
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

  commentOnPost(parentPostCommentElement, id): void {
    this.commentData.comment = parentPostCommentElement.innerHTML;
    if (this.commentData.comment) {
      this.commentData.postId = id
      this.commentData.profileId = this.profileId;
      this.uploadPostFileAndCreatePost()
      parentPostCommentElement.innerHTML = ''
    } else {
      this.toaster.danger('Please enter comment');
    }
  }

  replyOnComment(childPostCommentElement, id, commentId): void {
    this.commentData.comment = childPostCommentElement.innerHTML;
    if (this.commentData.comment) {
      this.commentData.profileId = this.profileId;
      this.commentData.postId = id;
      this.commentData.parentCommentId = commentId;
      this.uploadPostFileAndCreatePost();
      childPostCommentElement.innerHTML = ''
    } else {
      this.toaster.danger('Please enter comment');
    }
  }

  uploadPostFileAndCreatePost(): void {
    if (this.commentData?.comment) {
      if (this.commentData?.file?.name) {
        this.spinner.show();
        this.postService.upload(this.commentData?.file, this.profileId).subscribe({
          next: (res: any) => {
            if (res?.body?.url) {
              this.commentData['file'] = null;
              this.commentData['imageUrl'] = res?.body?.url;
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
    if (this.commentData.parentCommentId) {
      this.socketService.commentOnPost(this.commentData, (data) => {
        this.toaster.success('replied on comment');
        this.postComment = '';
        this.commentData = {}
        // childPostCommentElement.innerText = '';
      });
      this.socketService.socket.on('comments-on-post', (data: any) => {
        this.commentList.map((ele: any) =>
          data.filter((ele1) => {
            if (ele.id === ele1.parentCommentId) {
              ele?.['replyCommnetsList'].push(ele1);
              return ele;
            }
          })
        );
        this.isReply = false;
        this.commentId = null;
        // this.getPostList();
      });
    } else {
      this.socketService.commentOnPost(this.commentData, (data) => {
        this.toaster.success('comment added on post');
        this.commentData.comment = '';
        this.commentData = {}
        // parentPostCommentElement.innerText = '';
      });
      this.socketService.socket.on('comments-on-post', (data: any) => {
        this.commentList.push(data[0]);
        this.isExpand = true;
        this.viewComments(data[0]?.postId);
        this.commentData.comment = '';
        this.commentData = {}
        // parentPostCommentElement.innerText = '';
      });
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
    this.postService.getComments(id).subscribe({
      next: (res) => {
        if (res) {
          // this.commentList = res.data.commmentsList.filter((ele: any) => {
          //   res.data.replyCommnetsList.some((element: any) => {
          //     if (ele?.id === element?.parentCommentId) {
          //       ele?.replyCommnetsList.push(element);
          //       return ele;
          //     }
          //   });
          // });
          this.commentList = res.data.commmentsList.map((ele: any) => ({
            ...ele,
            replyCommnetsList: res.data.replyCommnetsList.filter((ele1) => {
              return ele.id === ele1.parentCommentId;
            }),
          }));
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
        this.isExpand = false;
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
    this.socketService.likeFeedComments(data, (res) => {
      return;
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
    this.socketService.likeFeedComments(data, (res) => {
      return
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
  commentOnKeyEvent(event): void {
    const text = event.target.value;
    const atSymbolIndex = text.lastIndexOf('@');

    if (atSymbolIndex !== -1) {
      this.userNameSearch = text.substring(atSymbolIndex + 1);
      // if (this.userNameSearch?.length > 2) {
      //   this.getUserList(this.userNameSearch);
      // } else {
      //   this.clearUserSearchData();
      // }
    }
    this.postComment = text;
    // if (lastChar === '@' || this.userNameSearch) {
    //   this.userNameSearch += lastChar;
    //   // value.startsWith('@')

    //   // this.getUserList(value.slice(1));
    // }
  }

  goToViewProfile(id: any): void {
    this.router.navigate([`settings/view-profile/${id}`]);
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
          return
        },
      });

    this.postId = null;
  }

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

  seeFirst(postProfileId: number): void {
    this.seeFirstUserService
      .create({ profileId: this.profileId, seeFirstProfileId: postProfileId })
      .subscribe({
        next: (res) => {
          this.getPostList();
        },
      });

    this.postId = null;
  }


  onPostFileSelect(event: any, type: string): void {
    if (type === 'parent') {
      this.isParent = true;
    } else {
      this.isParent = false;
    }
    const file = event.target?.files?.[0] || {};
    if (file.type.includes('image/')) {
      this.commentData['file'] = file;
      this.commentData['imageUrl'] = URL.createObjectURL(file);
    } else {
      this.toaster.danger(`sorry ${file.type} are not allowed!`)
    }
  }

  removePostSelectedFile(): void {
    this.commentData['file'] = null;
    this.commentData['imageUrl'] = '';
  }
}