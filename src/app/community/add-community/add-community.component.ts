import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Community } from 'src/app/constant/customer';
import { CommunityService } from 'src/app/services/community.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';

@Component({
  selector: 'app-add-community-modal',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.css'],
})
export class AddCommunityComponent {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() closeIcon: boolean | undefined;

  communityDetails = new Community();
  submitted = false;
  registrationMessage = '';
  type = '';
  msg = '';
  selectedFile: File;
  logoImg: any;
  coverImg: any;
  userId = '';
  constructor(
    public activeModal: NgbActiveModal,
    private uploadService: UploadFilesService,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private cd: ChangeDetectorRef
  ) {
    this.userId = window.sessionStorage.user_id;
  }

  selectFiles(event, type) {
    // console.log(event.target.files, type);
    this.selectedFile = event.target.files;
    this.upload(this.selectedFile, type);
  }

  upload(file, defaultType): any {
    if (file.size / (1024 * 1024) > 5) {
      return 'Image file size exceeds 5 MB!';
    }
    console.log(file[0], defaultType);
    this.spinner.show();
    this.communityService.upload(file[0], this.userId, defaultType).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.spinner.hide();
        } else if (event instanceof HttpResponse) {
          this.spinner.hide();
          this.selectedFile = undefined;
          this.cd.detectChanges();
          this.getProfilePic();
        }
        // return '';
      },
      (err) => {
        this.spinner.hide();
        this.selectedFile = undefined;
        return 'Could not upload the file:' + file.name;
      }
    );
  }

  onSubmit() {
    this.spinner.show();
    if (this.logoImg && this.coverImg) {
      this.communityDetails.userId = this.userId;
      this.communityDetails.logoImg = this.logoImg?.url;
      this.communityDetails.coverImg = this.coverImg?.url;
      console.log(this.communityDetails);
      if (this.communityDetails) {
        this.communityService.createCommunity(this.communityDetails).subscribe(
          (res: any) => {
            if (!res.error) {
              this.submitted = true;
              this.spinner.hide();
              console.log(res);
              this.createCommunityAdmin(res.data);
              this.activeModal.close();
              // this.router.navigateByUrl('/home');
            }
          },
          (err) => {
            this.registrationMessage = err.error.message;
            this.type = 'danger';
            this.spinner.hide();
          }
        );
      }
    }
  }

  getProfilePic() {
    // this.spinner.show();
    this.communityService.getLogoImg(this.userId).subscribe(
      (res: any) => {
        if (res.length) {
          // this.spinner.hide();
          this.logoImg = res[0];
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.communityService.getCoverImg(this.userId).subscribe(
      (res: any) => {
        if (res) {
          // this.spinner.hide();
          this.coverImg = res[0];
        }
      },
      (error) => {
        // this.spinner.hide();
        console.log(error);
      }
    );
  }

  createCommunityAdmin(id): void {
    const data = {
      userId: this.userId,
      communityId: id,
      isActive: 'Y',
      isAdmin: 'Y',
    };
    this.communityService.createCommunityAdmin(data).subscribe(
      (res: any) => {
        if (res) {
          return res;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
