import { Routes } from '@angular/router';
import { UserServices } from './services/user';
import { Flight } from './Component/flight/flight';
import { Welcome } from './Component/welcome/welcome';
import { Booking } from './Component/booking/booking';
import { FlightAdd } from './Component/flight-add/flight-add';
import { FlightEdit } from './Component/flight-edit/flight-edit';
import { User } from './Component/user/user';
import { RegisterComponent } from './Component/auth/register';
import { LoginComponent } from './Component/auth/login';

export const routes: Routes = [
    { path: '', component: Welcome },
    { path: 'welcome', redirectTo: '', pathMatch: 'full' },
    { path: 'users', component: User },
    { path: 'flights', component: Flight },
    { path: 'bookings', component: Booking },
    { path: 'addflight', component: FlightAdd },
    {path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'editflight/:id', component: FlightEdit }
];
