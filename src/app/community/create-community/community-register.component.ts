import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { async, debounceTime, fromEvent } from 'rxjs';
import { Community, Customer } from 'src/app/constant/customer';
import { AuthService } from 'src/app/services/auth.service';
import { CommunityService } from 'src/app/services/community.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastService } from 'src/app/services/toaster.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';
@Component({
  selector: 'app-community-register',
  templateUrl: './community-register.component.html',
  styleUrls: ['./community-register.component.css'],
})
export class CommunityRegisterComponent implements OnInit, AfterViewInit {
  customer = new Customer();
  communityDetails = new Community();
  communityForm!: FormGroup;
  isragister = false;
  registrationMessage = '';
  confirm_password = '';
  msg = '';
  userId = '';
  submitted = false;
  allCountryData: any;
  type = 'danger';
  defaultCountry = 'US';
  selectedFile: File;
  logoImg: any;
  coverImg: any;

  @ViewChild('zipCode') zipCode: ElementRef;
  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private communityService: CommunityService,
    private uploadService: UploadFilesService,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.userId = window.sessionStorage.user_id;
    this.getAllCountries();
    this.getCustomer();

    this.communityForm = this.fb.group({
      CommunityName: [null, [Validators.required]],
      CommunityDescription: [null, [Validators.required]],
      logoImg: [null, [Validators.required]],
      coverImg: [null, [Validators.required]],
    });
  }

  ngAfterViewInit(): void {}

  getCustomer(): void {
    this.spinner.show();
    const id = window.sessionStorage.user_id;
    this.customerService.getCustomer(id).subscribe(
      (data: any) => {
        if (data[0]) {
          this.spinner.hide();
          this.customer = data[0];
        }
        console.log(data);
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  onSubmit() {
    this.spinner.show();
    this.getProfilePic();
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
              this.changeUserType();
              console.log(res);
              this.createCommunityAdmin(res.data);
              this.router.navigateByUrl('/home');
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

  getAllCountries() {
    this.customerService.getCountriesData().subscribe(
      (result) => {
        this.allCountryData = result;
      },
      (error) => {
        console.log(error);
      }
    );
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
    this.uploadService.upload(file[0], this.userId, defaultType).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.spinner.hide();
        } else if (event instanceof HttpResponse) {
          this.spinner.hide();
          this.selectedFile = undefined;
          this.cd.detectChanges();
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

  getProfilePic() {
    this.spinner.show();
    this.communityService.getLogoImg(this.userId).subscribe(
      (res: any) => {
        if (res.length) {
          this.spinner.hide();
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
          this.spinner.hide();
          this.coverImg = res[0];
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  changeUserType() {
    this.communityService.changeAccountType(this.userId).subscribe(
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
