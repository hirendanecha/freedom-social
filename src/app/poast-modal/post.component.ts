import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../services/post.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() closeIcon: boolean | undefined;

  selectedFiles: any = [];
  selectedFile: any;
  pid = '';
  postData: any = {};
  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    private cd: ChangeDetectorRef,
    public sharedService: SharedService,
    private router: Router
  ) {
    this.sharedService.getProfilePic();
  }

  ngOnInit(): void {
    this.pid = window.sessionStorage.user_id;
  }

  selectFiles(event) {
    console.log(event.target.files);
    this.selectedFiles = event.target.files;
    this.upload(this.selectedFiles, 'post');
  }

  upload(files, defaultType): any {
    // if (file.size / (1024 * 1024) > 5) {
    //   return 'Image file size exceeds 5 MB!';
    // }

    this.spinner.show();
    this.postService.upload(files[0], this.pid, defaultType).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.spinner.hide();
        } else if (event instanceof HttpResponse) {
          this.spinner.hide();
          this.selectedFiles = undefined;
          this.cd.detectChanges();
          this.getSelectedImg();
        }
        // return '';
      },
      (err) => {
        this.spinner.hide();
        this.selectedFiles = undefined;
        return 'Could not upload the file:';
      }
    );
  }

  getSelectedImg(): void {
    this.postService.getPostImg().subscribe((res: any) => {
      console.log(res);
      this.selectedFile = res[0].url;
    });
  }

  addPost(): void {
    this.postData.profileid = this?.sharedService?.userData?.profileId;
    this.postData.imageUrl = this.selectedFile;
    console.log(this.postData);
    this.spinner.show();
    if (this.postData) {
      this.postService.createPost(this.postData).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log(res);
          this.activeModal.close();
          this.router.navigate(['home']);
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
    }
  }
}
