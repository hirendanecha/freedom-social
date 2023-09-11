import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { SeeFirstUserService } from 'src/app/services/see-first-user.service';
import { SocketService } from 'src/app/services/socket.service';
import { ToastService } from 'src/app/services/toaster.service';
import { UnsubscribeProfileService } from 'src/app/services/unsubscribe-profile.service';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';
import { slideUp } from '../../animations/slideUp';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  animations: [slideUp],
})
export class PostCardComponent {
  @Input('post') post: any={};
  @Output('getPostList') getPostList: EventEmitter<void> = new EventEmitter<void>();
  @Output('onEditPost') onEditPost: EventEmitter<any> = new EventEmitter<any>();

  profileId = '';
  seeFirstList: any = [];
  isOpenCommentsPostId = '';
  isExpand = false;

  commentList: any = [];
  replyCommentList: any = [];
  isReply = false;

  commentId = null;
  commentData: any = {
    file: null,
    url: ''
  };
  isParent: boolean = false;

  constructor(
    private seeFirstUserService: SeeFirstUserService,
    private unsubscribeProfileService: UnsubscribeProfileService,
    private socketService: SocketService,
    private postService: PostService,
    private toaster: ToastService,
    private modalService: NgbModal,
    public sharedService: SharedService,
    private router: Router
  ) {
    this.profileId = sessionStorage.getItem('profileId');
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

  removeSeeFirstUser(id: number): void {
    this.seeFirstUserService.remove(Number(this.profileId), id).subscribe({
      next: (res) => {
        if (this.getPostList) {
          this.getPostList.emit();
        }
      },
    });
  }

  seeFirst(postProfileId: number): void {
    this.seeFirstUserService.create({ profileId: this.profileId, seeFirstProfileId: postProfileId }).subscribe({
      next: (res) => {
        console.log('Res : ', res);
        if (this.getPostList) {
          this.getPostList.emit();
        }
      },
    });
  }

  unsubscribe(post: any): void {
    post['hide'] = true;

    this.unsubscribeProfileService.create({ profileId: this.profileId, unsubscribeProfileId: post?.profileid }).subscribe({
      next: (res) => {
        console.log('Res : ', res);
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
      console.log(res);
      if (res === 'success') {
        // post['hide'] = true;
        this.postService.deletePost(post.id).subscribe(
          (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              if (this.getPostList) {
                this.getPostList.emit();
              }
            }
          },
          (error) => {
            console.log('error : ', error);
          }
        );
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
      console.log(res);
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
        this.isExpand = false;
        // this.viewComments(id);
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
    const postComment = childPostCommentElement.innerHTML;

    if (postComment) {
      const commentData = {
        postId: id,
        comment: postComment,
        profileId: this.profileId,
        parentCommentId: commentId,
      };
      this.socketService.commentOnPost(commentData, (data) => {
        this.toaster.success('replied on comment');
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

  commentOnPost(parentPostCommentElement, id): void {
    const postComment = parentPostCommentElement.innerHTML;

    if (postComment) {
      const commentData = {
        postId: id,
        comment: postComment,
        profileId: this.profileId,
      };
      console.log(commentData);
      this.socketService.commentOnPost(commentData, (data) => {
        this.toaster.success('comment added on post');
        parentPostCommentElement.innerText = '';
      });
      this.socketService.socket.on('comments-on-post', (data: any) => {
        console.log(data);
        this.commentList.push(data[0]);
        this.isExpand = true;
        this.viewComments(id);
        parentPostCommentElement.innerText = '';
      });
    } else {
      this.toaster.danger('Please enter comment');
    }
  }

  onPostFileSelect(event: any, type: string): void {
    if (type === 'parent') {
      this.isParent = true;
    } else {
      this.isParent = false;
    }
    const file = event.target?.files?.[0] || {};
    console.log(file)
    if (file.type.includes('image/')) {
      this.commentData['file'] = file;
      this.commentData['imageUrl'] = URL.createObjectURL(file);
      console.log('commentImg: ', this.commentData['imageUrl']);
    } else {
      this.toaster.danger(`sorry ${file.type} are not allowed!`)
    }
  }

  removePostSelectedFile(): void {
    this.commentData['file'] = null;
    this.commentData['imageUrl'] = '';
  }
}
