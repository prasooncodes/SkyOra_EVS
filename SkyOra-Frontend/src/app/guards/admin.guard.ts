import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.auth.getCurrentUser();
    const role = (user && user.role) ? user.role.toString().toLowerCase() : '';
    if (role.includes('admin')) {
      return true;
    }
    return this.router.createUrlTree(['/error']);
  }
}
