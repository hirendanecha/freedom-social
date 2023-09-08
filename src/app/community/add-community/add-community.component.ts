import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Community } from 'src/app/constant/customer';
import { CommunityService } from 'src/app/services/community.service';
import { ToastService } from 'src/app/services/toaster.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-community-modal',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.scss'],
})
export class AddCommunityComponent {
  @Input() closeIcon: boolean | undefined;

  communityDetails = new Community();
  submitted = false;
  registrationMessage = '';
  selectedFile: File;
  logoImg: any;
  coverImg: any;
  userId = '';
  profileId = '';
  originurl = environment.webUrl + 'community/';
  constructor(
    public activeModal: NgbActiveModal,
    private uploadService: UploadFilesService,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private toaster: ToastService
  ) {
    this.userId = window.sessionStorage.user_id;
    this.profileId = sessionStorage.getItem('profileId');
  }

  selectFiles(event, type) {
    this.selectedFile = event.target.files;
    this.upload(this.selectedFile, type);
  }

  upload(file, defaultType): any {
    if (file.size / (1024 * 1024) > 5) {
      return 'Image file size exceeds 5 MB!';
    }
    this.spinner.show();
    this.communityService
      .upload(file[0], this.profileId, defaultType)
      .subscribe(
        (res: any) => {
          if (res.body) {
            this.spinner.hide();
            if (defaultType === 'community-logo') {
              this.logoImg = res?.body?.url;
            } else if (defaultType === 'community-cover') {
              this.coverImg = res?.body?.url;
            }
          }
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
    if (this.communityDetails.CommunityName && this.logoImg && this.coverImg) {
      this.communityDetails.profileId = this.profileId;
      this.communityDetails.logoImg = this.logoImg;
      this.communityDetails.coverImg = this.coverImg;
      if (this.communityDetails) {
        this.communityService.createCommunity(this.communityDetails).subscribe(
          (res: any) => {
            if (!res.error) {
              this.submitted = true;
              this.spinner.hide();
              this.createCommunityAdmin(res.data);
              this.activeModal.close('success');
              this.toaster.success(res.message);
              // this.router.navigateByUrl('/home');
            }
          },
          (err) => {
            this.toaster.danger('Please change community name. this community name already in use.');
            this.spinner.hide();
          }
        );
      }
    } else {
      this.spinner.hide();
      this.toaster.danger('Please enter mandatory fields(*) data.');
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
      profileId: this.profileId,
      communityId: id,
      isActive: 'Y',
      isAdmin: 'Y',
    };
    this.communityService.joinCommunity(data).subscribe(
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
