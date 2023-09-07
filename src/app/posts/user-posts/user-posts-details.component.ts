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
import { ConfirmationModalComponent } from 'src/app/@shared/confirmation-modal/confirmation-modal.component';
import { PostService } from 'src/app/services/post.service';
import { SeeFirstUserService } from 'src/app/services/see-first-user.service';
import { SharedService } from 'src/app/services/shared.service';
import { SocketService } from 'src/app/services/socket.service';
import { ToastService } from 'src/app/services/toaster.service';
import { UnsubscribeProfileService } from 'src/app/services/unsubscribe-profile.service';

@Component({
  selector: 'app-user-posts-details',
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
  }
  
  ngOnInit(): void {
    this.getPostList();
  }

  getPostList(): void {
    this.spinner.show();
    const id = 70418;
    this.postService.getPostsByPostId(this.postId).subscribe(
      (res: any) => {
        if (res) {
          this.postList = res;
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  deletePost(post): void {
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
      console.log(res);
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
  commentOnPost(id): void {
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
      });
      this.socketService.socket.on('comments-on-post', (data: any) => {
        console.log(data);
        this.commentList.push(data[0]);
        this.getPostList();
      });
    } else {
      this.toaster.danger('Please enter comment');
    }
  }

  viewComments(id): void {
    this.isOpenCommentsPostId = id;
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

  replyOnComment(id, commentId): void {
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
        this.getPostList();
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
  commentOnKeyEvent(event): void {
    const text = event.target.value;
    const atSymbolIndex = text.lastIndexOf('@');

    if (atSymbolIndex !== -1) {
      this.userNameSearch = text.substring(atSymbolIndex + 1);
      console.log('userNameSearch : ', this.userNameSearch);

      // if (this.userNameSearch?.length > 2) {
      //   this.getUserList(this.userNameSearch);
      // } else {
      //   this.clearUserSearchData();
      // }
    }
    console.log(text);
    this.postComment = text;

    // if (lastChar === '@' || this.userNameSearch) {
    //   this.userNameSearch += lastChar;
    //   console.log('userNameSearch : ', this.userNameSearch);
    //   // value.startsWith('@')

    //   // this.getUserList(value.slice(1));
    //   // console.log('this.userList : ', this.userList);
    // }
  }

  goToViewProfile(id: any): void {
    this.router.navigate([`settings/general/view-profile/${id}`]);
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
          console.log('Res : ', res);
          this.getPostList();
        },
      });

    this.postId = null;
  }
}
