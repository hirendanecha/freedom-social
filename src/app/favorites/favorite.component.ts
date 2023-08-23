import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
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
import { DeletePostComponent } from '../@shared/delete-post-dialog/delete-post.component';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
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
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    private socketService: SocketService,
    private communityPostService: CommunityPostService,
    private postService: PostService,
    private router: Router
  ) {
    this.profileId = sessionStorage.getItem('profileId');
    this.communityId = sessionStorage.getItem('communityId');
  }

  ngOnInit(): void {
    this.getPostList();
    // this.sharedService.getProfilePic();
    this.sharedService.getUserDetails();
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
    this.socketService.getCommunityPost({ page: page, size: 15 }, (data) => {
      return data;
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
      (res: any) => {
        if (res) {
          this.spinner.hide();
          res.data.forEach((element) => {
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
          (res: any) => {
            if (res.meta.image) {
              this.spinner.hide();
              this.postData = {
                imageUrl: res.meta?.image?.url,
                metalink: res?.meta?.url,
                description: des.split('http')[0],
                metadescription: res?.meta?.description,
                title: res?.meta?.title,
                profileId: this.profileId,
                communityId: this.communityId,
              };
              return this.postData;
            } else {
              this.spinner.hide();
              this.postData = {
                profileId: this.profileId,
                description: des,
                communityId: this.communityId,
              };
              return this.postData;
            }
          },
          (error) => {
            this.spinner.hide();
            this.postData = {
              profileId: this.profileId,
              description: des,
              communityId: this.communityId,
            };
            return this.postData;
          }
        );
      } else {
        this.spinner.hide();
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

  deletePost(id): void {
    this.postId = null;
    console.log(id);
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
        this.communityPostService.deletePost(id).subscribe(
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
    });
  }
}
