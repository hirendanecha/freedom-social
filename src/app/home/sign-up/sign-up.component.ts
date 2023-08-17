import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
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
  selectedFile: any;
  profilePic = '';

  @ViewChild('zipCode') zipCode: ElementRef;
  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private toastService: ToastService,
    private cd: ChangeDetectorRef,
    private uploadService: UploadFilesService
  ) {}

  ngOnInit(): void {
    this.getAllCountries();
  }

  ngAfterViewInit(): void {
    fromEvent(this.zipCode.nativeElement, 'input')
      .pipe(debounceTime(1000))
      .subscribe((event) => {
        this.onZipChange(event['target'].value);
      });
  }

  getCustomer(id): void {
    this.customerService.getCustomer(id).subscribe(
      (data: any) => {
        this.customer = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  selectFiles(event) {
    this.selectedFile = event.target.files;
  }

  upload(file, id, defaultType) {
    if (file.size / (1024 * 1024) > 5) {
      return 'Image file size exceeds 5 MB!';
    }
    this.spinner.show();
    this.uploadService.upload(file[0], id, defaultType).subscribe(
      (res: any) => {
        if (res.body) {
          this.spinner.hide();
          this.profilePic = res?.body?.url;
          this.creatProfile(this.customer);
        }
      },
      (err) => {
        this.spinner.hide();
        this.selectedFile = undefined;
        return 'Could not upload the file:' + file.name;
      }
    );
  }

  save() {
    this.spinner.show();
    this.customerService.createCustomer(this.customer).subscribe(
      (data: any) => {
        if (!data.error) {
          this.submitted = true;
          this.spinner.hide();
          window.sessionStorage.user_id = data.data;
          this.registrationMessage =
            'Your account has registered successfully. Kindly login with your email and password !!!';
          this.isragister = true;
          const id = data.data;
          if (id) {
            this.upload(this.selectedFile, id, 'profile');
            localStorage.setItem('register', String(this.isragister));
            this.router.navigateByUrl('/login?isVerify=false');
          }
        }
      },
      (err) => {
        this.registrationMessage = err.error.message;
        this.type = 'danger';
        this.spinner.hide();
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
      this.msg = 'Passwords is incorrect';
      return false;
    }

    return true;
  }

  onSubmit() {
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
    this.customerService.getCountriesData().subscribe(
      (result) => {
        this.allCountryData = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onZipChange(event) {
    this.customerService.getZipData(event, this.customer?.Country).subscribe(
      (data) => {
        let zip_data = data[0];
        this.customer.State = zip_data ? zip_data.state : '';
        this.customer.City = zip_data ? zip_data.city : '';
        // this.customer.Place = zip_data ? zip_data.places : '';
      },
      (err) => {
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
      City: data?.FirstName,
      State: data?.State,
      Zip: data?.Zip,
      MobileNo: data?.MobileNo,
      UserID: window?.sessionStorage?.user_id,
      IsActive: 'N',
      ProfilePicName: this.profilePic,
    };
    this.customerService.createProfile(profile).subscribe(
      (data: any) => {
        if (data) {
          this.spinner.hide();
          const profileId = data.data;
          sessionStorage.setItem('profileId', profileId);
        }
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }
}
