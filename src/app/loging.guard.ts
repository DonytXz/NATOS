import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService, safeReturnUrl } from './servicios/login.service';

@Injectable({ providedIn: 'root' })
export class LogingGuard {
  constructor(private router: Router, private loginservicio: LoginService) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.loginservicio.eslogueado() || this.router.createUrlTree(['/acceso'], {
      queryParams: { returnUrl: safeReturnUrl(state.url) }
    });
  }
}
