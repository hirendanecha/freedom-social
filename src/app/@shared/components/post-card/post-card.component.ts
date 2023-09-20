import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/@shared/services/post.service';
import { SeeFirstUserService } from 'src/app/@shared/services/see-first-user.service';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { UnsubscribeProfileService } from 'src/app/@shared/services/unsubscribe-profile.service';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { slideUp } from '../../animations/slideUp';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  animations: [slideUp],
})
export class PostCardComponent {
  @Input('post') post: any = {};
  @Input('seeFirstList') seeFirstList: any = [];
  @Output('getPostList') getPostList: EventEmitter<void> = new EventEmitter<void>();
  @Output('onEditPost') onEditPost: EventEmitter<any> = new EventEmitter<any>();

  profileId = '';
  isOpenCommentsPostId: number = null;

  commentList: any = [];
  replyCommentList: any = [];
  isReply = false;

  commentId = null;
  commentData: any = {
    file: null,
    url: ''
  };
  isParent: boolean = false;
  postComment = {};

  constructor(
    private seeFirstUserService: SeeFirstUserService,
    private unsubscribeProfileService: UnsubscribeProfileService,
    private socketService: SocketService,
    private postService: PostService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    private router: Router
  ) {
    this.profileId = sessionStorage.getItem('profileId');
  }

  removeSeeFirstUser(id: number): void {
    this.seeFirstUserService.remove(Number(this.profileId), id).subscribe({
      next: (res) => {
        this.getPostList?.emit();
      },
    });
  }

  seeFirst(postProfileId: number): void {
    this.seeFirstUserService.create({ profileId: this.profileId, seeFirstProfileId: postProfileId }).subscribe({
      next: (res) => {
        this.getPostList?.emit();
      },
    });
  }

  unsubscribe(post: any): void {
    post['hide'] = true;

    this.unsubscribeProfileService.create({ profileId: this.profileId, unsubscribeProfileId: post?.profileid }).subscribe({
      next: (res) => {
        return true;
      },
    });
  }

  goToViewProfile(id: any): void {
    this.router.navigate([`settings/view-profile/${id}`]);
  }

  editPost(post): void {
    if (this.onEditPost) {
      this.onEditPost.emit(post);
    }
  }

  deletePost(post): void {
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
              if (res) {
                this.toastService.success(res.message);
                this.getPostList.emit();
              }
            },
            error:
              (error) => {
                console.log('error : ', error);
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
      return;
    });
    // this.socketService.socket.on(
    //   'new-post',
    //   (data) => {
    //     this.postList = data;
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  viewComments(id: number): void {
    // this.isExpand = this.isOpenCommentsPostId == id ? false : true;
    // this.isOpenCommentsPostId = id;
    // if (!this.isExpand) {
    //   this.isOpenCommentsPostId = null;
    // } else {
    //   this.isOpenCommentsPostId = id;
    // }

    this.isOpenCommentsPostId = id;

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
        this.toastService.success(res.message);
        this.viewComments(id);
      },
      error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);
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
      return;
    });
  }

  commentOnPost(parentPostCommentElement, postId, commentId = null): void {
    const postComment = parentPostCommentElement.innerHTML;

    if (postComment || this.commentData?.file?.name) {
      this.commentData.comment = postComment;
      this.commentData.postId = postId;
      this.commentData.profileId = this.profileId;

      if (commentId) {
        this.commentData['parentCommentId'] = commentId;
      }

      this.uploadCommentFileAndAddComment()
      parentPostCommentElement.innerHTML = ''
    } else {
      this.toastService.danger('Please enter comment');
    }
  }

  uploadCommentFileAndAddComment(): void {
    if (this.commentData?.comment || this.commentData?.file?.name) {
      if (this.commentData?.file?.name) {
        this.spinner.show();
        this.postService.upload(this.commentData?.file, this.profileId).subscribe({
          next: (res: any) => {
            this.spinner.hide();
            if (res?.body?.url) {
              this.commentData['file'] = null;
              this.commentData['imageUrl'] = res?.body?.url;
              this.addComment();
            }
          },
          error: (err) => {
            this.spinner.hide();
          },
        });
      } else {
        this.addComment();
      }
    }
  }

  addComment(): void {
    if (this.commentData?.parentCommentId) {
      this.socketService.commentOnPost(this.commentData, (data) => {
        this.toastService.success('replied on comment');
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
      });
    } else {
      this.socketService.commentOnPost(this.commentData, (data) => {
        this.toastService.success('comment added on post');
        this.commentData.comment = '';
        this.commentData = {}
        // parentPostCommentElement.innerText = '';
      });
      this.socketService.socket.on('comments-on-post', (data: any) => {
        this.commentList.push(data[0]);
        this.viewComments(data[0]?.postId);
        this.commentData.comment = '';
        this.commentData = {}
        // parentPostCommentElement.innerText = '';
      });
    }
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
      this.toastService.danger(`sorry ${file.type} are not allowed!`)
    }
  }

  removePostSelectedFile(): void {
    this.commentData['file'] = null;
    this.commentData['imageUrl'] = '';
  }
}
