import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityPostService } from '../../services/community-post.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() closeIcon: boolean | undefined;
  selectedFiles: any = [];
  selectedFile: any;
  pid = '';
  postData: any = {};
  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,
    private spinner: NgxSpinnerService,
    public communityPostService: CommunityPostService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.pid = sessionStorage.getItem('profileId');
  }

  selectFiles(event) {
    console.log(event.target.files);
    this.selectedFiles = event.target.files;
    this.upload(this.selectedFiles, 'community-post');
  }

  upload(files, defaultType): any {
    // if (file.size / (1024 * 1024) > 5) {
    //   return 'Image file size exceeds 5 MB!';
    // }

    this.spinner.show();
    this.communityPostService.upload(files[0], this.pid, defaultType).subscribe(
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
    this.communityPostService.getPostImg().subscribe((res: any) => {
      console.log(res);
      this.communityPostService.selectedFile = res[0].url;
    });
  }
}
