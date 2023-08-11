import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PostComponent } from './poast-modal/post.component';
import { LiveComponent } from '../live-modal/live.component';
import { CreatePostComponent } from '../favorites/create-post-modal/create-post.component';
import { MyListComponent } from '../right-side-bar/my-list.component';
import { MyProfileComponent } from '../left-side-bar/my-profile.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../services/post.service';
import { SharedService } from '../services/shared.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    public sharedService: SharedService,
    private router: Router,
    private socketService: SocketService
  ) {
    // this.sharedService.getProfilePic();
    this.sharedService.getUserDetails();
  }

  ngOnInit(): void {
    this.getPostList();
  }

  ngAfterViewInit(): void {}

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
      console.log(res);
      if (res === 'success') {
        this.postService.postData.profileid =
          sessionStorage.getItem('profileId');
        this.postService.postData.imageUrl = this.postService.selectedFile;
        console.log(this.postService.postData);
        // this.spinner.show();
        if (this.postService.postData) {
          // this.spinner.hide();
          this.socketService.createPost(this.postService.postData, (data) => {
            console.log(data);
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
    // modelRef.result.then(res => {
    //   return res = user_id
    // });
  }

  openEmojiMenu(): void {
    this.emojiMenuDialog = this.modalService.open(this.emojiMenu, {
      keyboard: true,
      size: 'xs',
      modalDialogClass: 'emoji-menu-panale',
    });
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

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: { emoji: { native: any } }) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
    this.message = text;
  }

  onFocus() {
    console.log('focus');
    this.showEmojiPicker = false;
  }
  onBlur() {
    console.log('onblur');
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
    this.socketService.getPost({ page: page, size: 15 }, (post) => {
      console.log('post', post);
      // this.spinner.hide();
    });
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
        console.log(data);
        this.spinner.hide();
        this.postList = data;
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  createPost(): void {
    if (this.message) {
      const id = sessionStorage.getItem('profileId');
      this.postData.profileid = id;
      this.postData.postdescription = this.message;
      console.log(this.postData);
      this.spinner.show();
      this.message = '';
      this.socketService.createPost(this.postData, (data) => {
        console.log(data);
        // this.spinner.hide();
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

  loadMore(): void {
    this.spinner.show();
    this.activePage = this.activePage + 1;
    this.postService.getPosts(this.activePage).subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide();
          res.forEach((element) => {
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

  // getMetaFromLink(event): void {
  //   console.log(event.target);
  // }

  hover(e) {
    this.isExpand = e;
    console.log(this.isExpand);
  }

  goToViewProfile(id) {
    console.log(id);
    this.postId = null;
    this.router.navigate([`settings/view-profile/${id}`]);
  }
}
