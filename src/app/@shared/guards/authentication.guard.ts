import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (isPlatformBrowser(this.platformId)) {
      if (this.tokenService.getCredentials()) {
        return true;
      }

      this.router.navigate(['/login'], {
        queryParams: { redirect: state.url },
      });

      return false;
    } else if (isPlatformServer(this.platformId)) {
      return true;
    }
  }
}
