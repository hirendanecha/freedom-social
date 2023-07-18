import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, fromEvent } from 'rxjs';
import { Customer } from 'src/app/constant/customer';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastService } from 'src/app/services/toaster.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
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

  @ViewChild('zipCode') zipCode: ElementRef;
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private toastService: ToastService
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
        console.log(data);
        this.customer = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  save() {
    console.log(this.customer);
    this.spinner.show();
    this.customerService.createCustomer(this.customer).subscribe(
      (data) => {
        this.spinner.hide();
        window.sessionStorage.user_id = data['Id'];
        this.registrationMessage =
          'Your account has registered successfully. Kindly login with your email and password !!!';
        this.isragister = true;
        localStorage.setItem('register', String(this.isragister));
        this.toastService.show(
          'Please check your email and click the activation link to activate your account.',
          { classname: 'bg-success text-light', delay: 10000 }
        );
        this.router.navigateByUrl('/login?isVerify=false');
      },
      (err) => {
        this.registrationMessage = err.error.message;
        this.spinner.hide();
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

  onSubmit() {
    if (!this.validatepassword()) return;

    const id = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      // this.updateCustomer();
    } else {
      this.submitted = true;
      this.save();
    }
  }

  changeCountry() {
    this.customer.Zip = '';
    this.customer.State = '';
    this.customer.City = '';
    this.customer.Place = '';
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
  changetopassword(event) {
    event.target.setAttribute('type', 'password');
    this.msg = '';
  }
}
