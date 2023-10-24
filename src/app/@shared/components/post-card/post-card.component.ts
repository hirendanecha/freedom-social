import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { ReplyCommentModalComponent } from '../../modals/reply-comment-modal/reply-comment-modal.component';
import { getTagUsersFromAnchorTags } from '../../utils/utils';

declare var jwplayer: any;
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
  @ViewChild('parentPostCommentElement', { static: false }) parentPostCommentElement: ElementRef;

  profileId = '';
  isOpenCommentsPostId: number = null;

  commentList: any = [];
  replyCommentList: any = [];
  isReply = false;

  commentId = null;
  commentData: any = {
    file: null,
    url: '',
    tags: []
  };
  isParent: boolean = false;
  postComment = {};
  isCommentsLoader: boolean = false;
  isPostComment: boolean = false;
  webUrl = environment.webUrl;
  player: any
  isExpand = false;
  commentCount = 0;
  commentMessageInputValue: string = '';
  commentMessageTags: any[];

  constructor(
    private seeFirstUserService: SeeFirstUserService,
    private unsubscribeProfileService: UnsubscribeProfileService,
    private socketService: SocketService,
    private postService: PostService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.profileId = localStorage.getItem('profileId');
  }

  ngOnInit(): void {
    this.playvideo(this.post?.id);
    this.viewComments(this.post?.id);
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
    // post['hide'] = true;

    this.unsubscribeProfileService.create({ profileId: this.profileId, unsubscribeProfileId: post?.profileid }).subscribe({
      next: (res) => {
        this.getPostList.emit()
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

  editComment(comment): void {
    if (comment.parentCommentId) {
      const modalRef = this.modalService.open(ReplyCommentModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = 'Edit Comment';
      modalRef.componentInstance.confirmButtonLabel = 'Comment';
      modalRef.componentInstance.cancelButtonLabel = 'Cancel';
      modalRef.componentInstance.data = comment;
      modalRef.result.then((res) => {
        if (res) {
          this.commentData['tags'] = res?.tags;
          this.commentData.comment = res?.comment;
          this.commentData.postId = res?.postId;
          this.commentData.profileId = res?.profileId;
          this.commentData['id'] = res?.id
          this.commentData.parentCommentId = res?.parentCommentId
          this.commentData['file'] = res?.file
          this.commentData['imageUrl'] = res?.url
          this.uploadCommentFileAndAddComment();
        }
      });
    } else {
      // this.renderer.setProperty(
      //   this.parentPostCommentElement?.nativeElement,
      //   'innerHTML',
      //   comment.comment
      // );
      this.isReply = false;
      this.commentMessageInputValue = comment.comment
      this.commentData['id'] = comment.id
      if (comment.imageUrl) {
        this.commentData['imageUrl'] = comment.imageUrl
        this.isParent = true;
      }
    }
    console.log(comment);
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

  reactLikeOnPost(post: any) {
    post.likescount = post?.likescount + 1;
    post.totalReactCount = post?.totalReactCount + 1;
    post.react = 'L';
    const data = {
      postId: post.id,
      profileId: this.profileId,
      likeCount: post.likescount,
      actionType: 'L',
      toProfileId: post.profileid,
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
      toProfileId: post.profileid,
    };
    this.likeDisLikePost(data);
  }

  likeDisLikePost(data): void {
    this.socketService.likeFeedPost(data, (res) => {
      console.log('likeOrDislike', res);
      return;
    });

    this.socketService.socket.on('likeOrDislike', (res) => {
      if (res[0]) {
        console.log('likeOrDislike', res[0], this.post);
        if (this.post.id === res[0]?.id) {
          this.post.likescount = res[0]?.likescount;
        }
      }
    })
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
    this.isCommentsLoader = true;
    const data = {
      postId: id,
      profileId: this.profileId
    }
    this.postService.getComments(data).subscribe({
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
          const replyCount = res.data.replyCommnetsList.filter((ele1) => {
            return ele1.parentCommentId;
          })
          this.commentCount = this.commentList.length + replyCount.length;
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isCommentsLoader = false;
      }
    });
  }

  deleteComments(comment): void {
    this.postService.deleteComments(comment.id).subscribe({
      next: (res: any) => {
        this.toastService.success(res.message);
        this.viewComments(comment?.postId);
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

  likeComments(comment) {
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
    this.likeDisLikePostComment(data);

  }

  disLikeComments(comment) {
    if (comment.react == 'L') {
      comment.likeCount = comment.likeCount - 1;
    }
    comment.react = null;
    const data = {
      postId: comment.postId,
      commentId: comment.id,
      profileId: Number(this.profileId),
      toProfileId: Number(comment.profileId),
      likeCount: comment.likeCount,
    };
    this.likeDisLikePostComment(data);
    // this.socketService.likeFeedComments(data, (res) => {
    //   return;
    // });
  }

  likeDisLikePostComment(data): void {
    this.socketService.likeFeedComments(data, (res) => {
      console.log('likeFeedComments', res);
      return;
    });

    this.socketService.socket.on('likeOrDislikeComments', (res) => {
      if (res[0]) {
        console.log('likeFeedComments', res[0]);
        if (res[0].parentCommentId) {
          let index = this.commentList.findIndex(obj => obj.id === res[0].id);
          let index1 = this.commentList.findIndex(obj => obj.replyCommnetsList.findIndex(ele => ele.id === res[0].id));
          if (index !== -1) {
            this.commentList[index].replyCommnetsList[index1].likeCount = res[0].likeCount;
          }
        } else {
          let index = this.commentList.findIndex(obj => obj.id === res[0].id);
          if (index !== -1) {
            this.commentList[index].likeCount = res[0].likeCount;
          }
        }
        // if (this.post.id === res[0]?.id) {
        //   this.post.likescount = res[0]?.likescount;
        // }
      }
    })
  }

  commentOnPost(postId, commentId = null): void {
    // const postComment = parentPostCommentElement.innerHTML;
    this.commentData.tags = getTagUsersFromAnchorTags(this.commentMessageTags);
    console.log(this.commentData)
    if (this.isPostComment === false) {
      if (this.commentData.comment || this.commentData?.file?.name) {
        this.isPostComment = true;
        // this.commentData.comment = postComment;
        this.commentData.postId = postId;
        this.commentData.profileId = this.profileId;
        if (commentId) {
          this.commentData['parentCommentId'] = commentId;
        }
        this.uploadCommentFileAndAddComment();
        this.commentMessageInputValue = null;
        // parentPostCommentElement.innerHTML = ''
      } else {
        this.toastService.clear();
        this.toastService.danger('Please enter comment');
      }
    }
  }

  uploadCommentFileAndAddComment(): void {
    if (this.commentData?.comment || this.commentData?.file?.name) {
      if (this.commentData?.file?.name) {
        this.spinner.show();
        this.postService.upload(this.commentData?.file, this.profileId).subscribe({
          next: (res: any) => {
            this.spinner.hide();
            if (this.commentData.file?.size < 5120000) {
              if (res?.body?.url) {
                this.commentData['file'] = null;
                this.commentData['imageUrl'] = res?.body?.url;
                this.addComment();
              }
            } else {
              this.toastService.warring('Image is too large!');
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
        this.isPostComment = false;
        console.log(data[0]);
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
      this.viewComments(this.post?.id);
    } else {
      this.socketService.commentOnPost(this.commentData, (data) => {
        this.toastService.success('comment added on post');
        this.commentData.comment = '';
        this.commentData = {}
        // parentPostCommentElement.innerText = '';
      });
      this.socketService.socket.on('comments-on-post', (data: any) => {
        this.isPostComment = false;
        console.log(data[0]);
        this.commentList.push(data[0]);
        this.commentData.comment = '';
        this.commentData.tags = [];
        this.commentMessageTags = []
        this.commentMessageInputValue = ''
        setTimeout(() => {
          this.commentMessageInputValue = ''
        }, 100);
        this.commentData = {}
        this.viewComments(this.post?.id);
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
    if (file?.size < 5120000) {
      if (file.type.includes('image/')) {
        this.commentData['file'] = file;
        this.commentData['imageUrl'] = URL.createObjectURL(file);
      } else {
        this.toastService.danger(`sorry ${file.type} are not allowed!`)
      }
    } else {
      this.toastService.warring('Image is too large!');
    }
  }

  removePostSelectedFile(): void {
    this.commentData['file'] = null;
    this.commentData['imageUrl'] = '';
  }

  playvideo(id: any) {
    let i = setInterval(() => {
      if (this.player) {
        this.player.remove();
      }
      const config = {
        file: this.post?.streamname,
        image: this.post?.thumbfilename,
        mute: false,
        autostart: false,
        volume: 30,
        height: '308px',
        width: 'auto',
        pipIcon: "disabled",
        displaydescription: true,
        playbackRateControls: false,
        aspectratio: "16:9",
        autoPause: {
          viewability: true
        },
        controls: true,
        events: {
          onError: function (e: any) {
            console.log(e);
          },
        },
      }
      this.player = jwplayer('jwVideo-' + id).setup({
        ...config
      });
      this.player.load();
      if (this.player) clearInterval(i)
    }, 1000)
  }


  onTagUserInputChangeEvent(data: any): void {
    console.log('comments-data', data)
    this.commentData.comment = data?.html;
    this.commentMessageTags = data?.tags;
  }
}
