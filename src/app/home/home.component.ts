import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PostComponent } from '../poast-modal/post.component';
import { LiveComponent } from '../live-modal/live.component';
import { CreatePostComponent } from '../create-post-modal/create-post.component';
import { MyListComponent } from '../right-side-bar/my-list.component';
import { MyProfileComponent } from '../left-side-bar/my-profile.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../services/post.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
  @ViewChild('emojiMenu') emojiMenu: EventEmitter<NgbModalRef[]> | undefined;
  emojiMenuDialog: any;
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private postService: PostService
  ) {}

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
    // modelRef.result.then(res => {
    //   return res = user_id
    // });
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

  createPost() {
    const modalRef = this.modalService.open(CreatePostComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
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

  openDropDown() {
    this.isExpand = !this.isExpand;
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
    this.spinner.show();
    this.postService.getPosts().subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }
}
