import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LandingComponent } from './features/landing/landing.component';
import { AuthComponent } from './features/auth/auth.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { AccountDetailComponent } from './features/home/account-detail/account-detail.component';
import { NotFoundComponent } from './features/error/not-found/not-found.component';
import { TransactionFormComponent } from './features/home/transaction-form/transaction-form.component';
import { TransactionListComponent } from './features/home/transaction-list/transaction-list.component';
export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: "auth", component: AuthComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'accounts/:id',
    component: AccountDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transactions/new',
    component: TransactionFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    component: TransactionListComponent,
    canActivate: [authGuard]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' } // Redirect any unknown routes to 404 page
];
