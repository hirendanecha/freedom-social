import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreatePostComponent } from 'src/app/create-post-modal/create-post.component';
import { LiveComponent } from 'src/app/live-modal/live.component';
import { PostComponent } from 'src/app/poast-modal/post.component';
import { PostService } from 'src/app/services/post.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-user-post',
  templateUrl: './user-post.component.html',
  styleUrls: ['./user-post.component.scss'],
})
export class UserPostComponent implements OnInit {
  @Input() profileId: any;
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
  postId = '';
  isExpand = false;
  @ViewChild('emojiMenu') emojiMenu: EventEmitter<NgbModalRef[]> | undefined;
  emojiMenuDialog: any;
  postList = [];
  isLike = false;
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getPostList();
    // this.sharedService.getProfilePic();
    // this.sharedService.getUserDetails();
  }

  getPostList(): void {
    this.spinner.show();
    this.postService.getPostsByProfileId(this.profileId).subscribe(
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
}
