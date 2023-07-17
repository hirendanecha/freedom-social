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
import { Subject, debounceTime, fromEvent } from 'rxjs';
import { Customer } from 'src/app/constant/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
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
  @ViewChild('zipCode') zipCode: ElementRef;
  uploadListSubject: Subject<void> = new Subject<void>();
  constructor(
    private modalService: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokenStorageService,
    private uploadService: UploadFilesService
  ) {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getUserDetails(this.userId);
  }
  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate([`/login`]);
    }
    this.modalService.close();
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
        console.log(data);
        if (data) {
          this.spinner.hide();
          this.customer = data[0];
          this.getAllCountries();
          this.uploadService.getProfilePic().subscribe(
            (res) => {
              if (res.length) {
                this.spinner.hide();
                this.profilePic = res[0];
                console.log(this.profilePic);
              }
            },
            (error) => {
              this.spinner.hide();
              console.log(error);
            }
          );
          this.uploadService.getCoverPic().subscribe(
            (res) => {
              if (res.length) {
                this.coverPic = res[0];
                console.log(this.profilePic);
              }
            },
            (error) => {
              this.spinner.hide();
              console.log(error);
            }
          );
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  validatepassword() {
    console.log(this.customer.Password, this.confirm_password);
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
    this.customer.ZipCode = '';
    this.customer.State = '';
    this.customer.City = '';
    this.customer.Place = '';
  }

  changetopassword(event) {
    event.target.setAttribute('type', 'password');
    this.msg = '';
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
        console.log('ZIP DATA >> ', data);
        let zip_data = data[0];
        this.customer.State = zip_data ? zip_data.state : '';
        this.customer.City = zip_data ? zip_data.city : '';
        this.customer.Place = zip_data ? zip_data.places : '';
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateCustomer(): void {
    if (!this.profileId) {
      this.spinner.show();
      console.log(this.customer);
      this.customer.ProfilePicName = this.profilePic.url;
      this.customer.CoverPicName = this.coverPic.url;
      this.customer.Id = Number(this.userId);
      this.customerService.updateProfile(this.customer).subscribe(
        (data: any) => {
          this.spinner.hide();
          this.profileId = data.data;
          console.log(data);
          this.getUserDetails(this.userId);
        },
        (err) => {
          this.spinner.hide();
        }
      );
    }
  }
}
