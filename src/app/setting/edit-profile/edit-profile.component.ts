import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, debounceTime, forkJoin, fromEvent, of } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/@shared/modals/confirmation-modal/confirmation-modal.component';
import { Customer } from 'src/app/constant/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { PostService } from 'src/app/services/post.service';
import { SharedService } from 'src/app/services/shared.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, AfterViewInit {
  customer: Customer = new Customer();
  registerForm!: FormGroup;
  isragister = false;
  registrationMessage = '';
  confirm_password = '';
  msg = '';
  allCountryData: any;
  userId = '';
  profilePic: any = {};
  coverPic: any = {};
  profileId = '';
  profileData: any = {};
  @ViewChild('zipCode') zipCode: ElementRef;
  uploadListSubject: Subject<void> = new Subject<void>();
  profileImg: any = {
    file: null,
    url: ''
  };
  profileCoverImg: any = {
    file: null,
    url: ''
  };

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokenStorageService,
    private postService: PostService,
    public sharedService: SharedService
  ) {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.profileId = sessionStorage.getItem('profileId');
    if (this.profileId) {
      this.getProfile(this.profileId);
    } else {
      this.getUserDetails(this.userId);
    }
  }

  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate([`/login`]);
    }
    this.modalService.dismissAll();
  }

  ngAfterViewInit(): void {
    fromEvent(this.zipCode.nativeElement, 'input')
      .pipe(debounceTime(1000))
      .subscribe((event) => {
        this.onZipChange(event['target'].value);
      });
  }

  getUserDetails(id): void {
    this.spinner.show();
    this.customerService.getCustomer(id).subscribe(
      (data: any) => {
        if (data) {
          this.spinner.hide();
          this.customer = data[0];
          this.getAllCountries();
          // this.uploadService.getProfilePic(this.customer.Id).subscribe(
          //   (res) => {
          //     if (res.length) {
          //       this.spinner.hide();
          //       this.sharedService['userData']['ProfilePicName'] = res[0];
          //     }
          //   },
          //   (error) => {
          //     this.spinner.hide();
          //     console.log(error);
          //   }
          // );
          // this.uploadService.getCoverPic(this.customer.Id).subscribe(
          //   (res) => {
          //     if (res.length) {
          //       this.coverPic = res[0];
          //     }
          //   },
          //   (error) => {
          //     this.spinner.hide();
          //     console.log(error);
          //   }
          // );
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  validatepassword() {
    const pattern =
      '(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z])(?=.*[0-9].*[0-9]).{8}';
    if (!this.customer.Password.match(pattern)) {
      this.msg =
        'Password must be a minimum of 8 characters and include one uppercase letter, one lowercase letter and one special character';
    }
    if (this.customer.Password !== this.confirm_password) {
      this.msg = 'Passwords does not match.';
      return false;
    }

    return true;
  }

  changeCountry() {
    this.customer.Zip = '';
    this.customer.State = '';
    this.customer.City = '';
    // this.customer.Place = '';
  }

  changetopassword(event) {
    event.target.setAttribute('type', 'password');
    this.msg = '';
  }

  getAllCountries() {
    this.customerService.getCountriesData().subscribe(
      {
        next: (result) => {
          this.allCountryData = result;
        },
        error:
          (error) => {
            console.log(error);
          }
      });
  }

  onZipChange(event) {
    this.customerService.getZipData(event, this.customer?.Country).subscribe(
      {
        next: (data) => {
          let zip_data = data[0];
          this.customer.State = zip_data ? zip_data.state : '';
          this.customer.City = zip_data ? zip_data.city : '';
          // this.customer.Place = zip_data ? zip_data.places : '';
        },
        error:
          (err) => {
            console.log(err);
          }
      });
  }

  confirmAndUpdateCustomer(): void {
    if (this.profileId) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = 'Update Profile';
      modalRef.componentInstance.confirmButtonLabel = 'Update';
      modalRef.componentInstance.cancelButtonLabel = 'Cancel';
      modalRef.componentInstance.message = 'Are you sure want to update profile details?';

      modalRef.result.then((res) => {
        console.log(res);
        if (res === 'success') {
          this.uploadImgAndUpdateCustomer();
        }
      });
    }

  }

  uploadImgAndUpdateCustomer(): void {
    let uploadObs = {};
    if (this.profileImg?.file?.name) {
      uploadObs['profileImg'] = this.postService.upload(this.profileImg?.file, this.profileId, 'profile');
    }

    if (this.profileCoverImg?.file?.name) {
      uploadObs['profileCoverImg'] = this.postService.upload(this.profileCoverImg?.file, this.profileId, 'profile-cover');
    }

    if (Object.keys(uploadObs)?.length > 0) {
      this.spinner.show();

      forkJoin(uploadObs).subscribe({
        next: (res: any) => {
          if (res?.profileImg?.body?.url) {
            this.profileImg['file'] = null;
            this.profileImg['url'] = res?.profileImg?.body?.url;
            this.sharedService['userData']['ProfilePicName'] = this.profileImg['url'];
          }

          if (res?.profileCoverImg?.body?.url) {
            this.profileCoverImg['file'] = null;
            this.profileCoverImg['url'] = res?.profileCoverImg?.body?.url;
            this.sharedService['userData']['CoverPicName'] = this.profileCoverImg['url'];
          }

          this.updateCustomer();
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
        },
      });
    } else {
      this.updateCustomer();
    }
  }

  updateCustomer(): void {
    if (this.profileId) {
      this.spinner.show();
      this.customer.ProfilePicName = this.profileImg?.url || this.customer.ProfilePicName;
      this.customer.CoverPicName = this.profileCoverImg?.url || this.customer.CoverPicName;
      this.customer.IsActive = 'Y';

      this.customerService.updateProfile(this.profileId, this.customer).subscribe({
        next: (res: any) => {
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        }
      });
    }
  }

  getProfile(id): void {
    this.spinner.show();
    this.customerService.getProfile(id).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.data) {
          this.customer = res.data[0];
          this.getAllCountries();
        }
      },
      error:
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
    });
  }

  onProfileImgChange(event: any): void {
    const file = event.target?.files?.[0] || {};
    if (file) {
      this.profileImg['file'] = file;
      this.profileImg['url'] = URL.createObjectURL(file);
    }
  }

  onProfileCoverImgChange(event: any): void {
    const file = event.target?.files?.[0] || {};
    if (file) {
      this.profileCoverImg['file'] = file;
      this.profileCoverImg['url'] = URL.createObjectURL(file);
    }
  }
}
