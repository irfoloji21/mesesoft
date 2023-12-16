import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Kullanıcının oturum durumunu kontrol et
    if (this.authService.getUser()) {
      // Kullanıcı oturum açmışsa rotaya izin ver
      return true;
    }

    // Kullanıcı oturum açmamışsa login sayfasına yönlendir
    this.router.navigate(['/login']);
    return false;
  }
}
