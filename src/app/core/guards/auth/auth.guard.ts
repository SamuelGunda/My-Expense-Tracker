import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authServ = inject(AuthService);
  const router = inject(Router);

  return authServ.userIdState$.pipe(
    take(1),
    map((token) => {
      if (token) {
        return true;
      } else {
        router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }),
  );
};
