import { Routes } from '@angular/router';
import { User } from './Component/user/user';
import { Flight } from './Component/flight/flight';
import { Welcome } from './Component/welcome/welcome';
import { Booking } from './Component/booking/booking';

export const routes: Routes = [
    { path: '', component: Welcome },
    { path: 'welcome', redirectTo: '', pathMatch: 'full' },
    { path: 'users', component: User },
    { path: 'flights', component: Flight },
    { path: 'bookings', component: Booking }
];
