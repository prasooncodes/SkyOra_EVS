import { Routes } from '@angular/router';
import { User } from './Component/user/user';
import { Flight } from './Component/flight/flight';
import { Welcome } from './Component/welcome/welcome';
import { Booking } from './Component/booking/booking';
import { LoginComponent } from './Component/auth/login';
import { RegisterComponent } from './Component/auth/register';

export const routes: Routes = [
    { path: '', component: Welcome },
    { path: 'welcome', redirectTo: '', pathMatch: 'full' },
    { path: 'users', component: User },
    { path: 'flights', component: Flight },
    { path: 'bookings', component: Booking },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];
