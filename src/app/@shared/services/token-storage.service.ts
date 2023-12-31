import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  isUserAuthenticated: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public _credentials: any = {};

  constructor(private cookieService: CookieService,
    private router: Router,
    private toastService: ToastService,
    ) { }

  signOut(): void {
    window.sessionStorage.clear();
    const theme = window.localStorage.getItem('theme');
    window.localStorage.clear();
    this.cookieService.delete('auth-user');
    this.cookieService.deleteAll('/');
    window.localStorage.setItem('theme', theme);
    this.toastService.success('Logout successfully');
    this.router.navigate(['/']);
  }

  public saveToken(token: string): void {
    // window.sessionStorage.removeItem(TOKEN_KEY);
    // window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    // return window.localStorage.getItem(TOKEN_KEY);
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    const userStr = JSON.stringify(user);

    // window.sessionStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(USER_KEY);

    window.localStorage.setItem(USER_KEY, userStr);
    // window.localStorage.setItem(USER_KEY, userStr);
  }

  public getUser(): any {
    return JSON.parse(window.localStorage.getItem(USER_KEY));
  }

  public getCredentials(): any {
    this._credentials = this.getUser();
    const isAuthenticate = Object.keys(this._credentials || {}).length > 0;
    this.changeIsUserAuthenticated(isAuthenticate);
    return isAuthenticate;
  }

  changeIsUserAuthenticated(flag: boolean = false) {
    this.isUserAuthenticated.next(flag);
  }
}
