import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, fromEvent } from 'rxjs';
import { Customer } from 'src/app/constant/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastService } from 'src/app/services/toaster.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  customer = new Customer();
  registerForm!: FormGroup;
  isragister = false;
  registrationMessage = '';
  confirm_password = '';
  msg = '';
  userId = '';
  submitted = false;
  allCountryData: any;
  type = 'danger';
  defaultCountry = 'US';
  profilePic = '';
  profileImg: any = {
    file: null,
    url: ''
  };

  @ViewChild('zipCode') zipCode: ElementRef;
  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private uploadService: UploadFilesService,
    private toaster: ToastService
  ) {
    this.customer.termAndPolicy = false;
  }

  ngOnInit(): void {
    this.getAllCountries();
  }

  ngAfterViewInit(): void {
    this.spinner.hide();

    fromEvent(this.zipCode.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe((event) => {
        const val = event['target'].value;
        if (val.length > 3) {
          this.onZipChange(val);
        }
      });
  }

  getCustomer(id): void {
    if (id) {
      this.customerService.getCustomer(id).subscribe(
        (data: any) => {
          this.customer = data;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  selectFiles(event) {
    const file = event.target?.files?.[0] || {};
    if (file) {
      this.profileImg['file'] = file;
      this.profileImg['url'] = URL.createObjectURL(file);
    }
  }

  upload(file, id, defaultType) {
    if (file.size / (1024 * 1024) > 5) {
      return 'Image file size exceeds 5 MB!';
    }
    this.spinner.show();
    this.uploadService.upload(file, id, defaultType).subscribe(
      (res: any) => {
        this.spinner.hide();

        if (res.body) {
          this.profilePic = res?.body?.url;
          this.creatProfile(this.customer);
        }
      },
      (err) => {
        this.spinner.hide();
        this.profileImg = {
          file: null,
          url: ''
        };
        return 'Could not upload the file:' + file.name;
      }
    );
  }

  save() {
    this.spinner.show();
    // console.log(this.registerForm.value);
    this.customerService.createCustomer(this.customer).subscribe(
      (data: any) => {
        this.spinner.hide();

        if (!data.error) {
          this.submitted = true;
          window.sessionStorage.user_id = data.data;
          this.registrationMessage =
            'Your account has registered successfully. Kindly login with your email and password !!!';
          this.scrollTop();
          this.isragister = true;
          const id = data.data;
          if (id) {
            this.upload(this.profileImg?.file, id, 'profile');
            localStorage.setItem('register', String(this.isragister));
            this.router.navigateByUrl('/login?isVerify=false');
          }
        }
      },
      (err) => {
        this.registrationMessage = err.error.message;
        this.type = 'danger';
        this.spinner.hide();
        this.scrollTop();
      }
    );
  }

  validatepassword() {
    const pattern =
      '(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z])(?=.*[0-9].*[0-9]).{8}';
    if (!this.customer.Password.match(pattern)) {
      this.msg =
        'Password must be a minimum of 8 characters and include one uppercase letter, one lowercase letter and one special character';
      this.scrollTop();
    }
    if (this.customer.Password !== this.confirm_password) {
      this.msg = 'Passwords is incorrect';
      this.scrollTop();
      return false;
    }

    return true;
  }

  onSubmit(isValid: boolean = false) {

    this.msg = '';
    if (!isValid || this.customer.termAndPolicy === false || !this.profileImg?.file?.name) {
      this.msg = 'Please enter mandatory fields(*) data and please check terms and condition.';
      this.scrollTop();
      return false;
    }

    if (!this.validatepassword()) return;

    const id = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      // this.updateCustomer();
    } else {
      // this.submitted = true;
      this.save();
    }
  }

  changeCountry() {
    this.customer.Zip = '';
    this.customer.State = '';
    this.customer.City = '';
    // this.customer.Place = '';
  }

  getAllCountries() {
    this.spinner.show();

    this.customerService.getCountriesData().subscribe(
      (result) => {
        this.spinner.hide();
        this.allCountryData = result;
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  onZipChange(event) {
    this.spinner.show();

    this.customerService.getZipData(event, this.customer?.Country).subscribe(
      (data) => {
        const zip_data = data[0];
        if (zip_data?.state) {
          this.customer.State = zip_data ? zip_data.state : '';
          this.customer.City = zip_data ? zip_data.city : '';
        } else {
          this.toaster.danger('Please check and enter valid country or zip code.');
        }

        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }
  changetopassword(event) {
    event.target.setAttribute('type', 'password');
    this.msg = '';
  }

  creatProfile(data) {
    this.spinner.show();
    const profile = {
      Username: data?.Username,
      FirstName: data?.FirstName,
      LastName: data?.LastName,
      Address: data?.Address,
      Country: data?.Country,
      City: data?.City,
      State: data?.State,
      Zip: data?.Zip,
      MobileNo: data?.MobileNo,
      UserID: window?.sessionStorage?.user_id,
      IsActive: 'N',
      ProfilePicName: this.profilePic,
    };
    this.customerService.createProfile(profile).subscribe(
      (data: any) => {
        this.spinner.hide();

        if (data) {
          const profileId = data.data;
          sessionStorage.setItem('profileId', profileId);
        }
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  clearProfileImg(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    this.profileImg = {
      file: null,
      url: ''
    };
  }

  scrollTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
