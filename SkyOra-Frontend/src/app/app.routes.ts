import { Routes } from '@angular/router';
import { User } from './Component/user/user';
import { UserServices } from './services/user';
import { Flight } from './Component/flight/flight';
import { Welcome } from './Component/welcome/welcome';
import { Booking } from './Component/booking/booking';
import { FlightAdd } from './Component/flight-add/flight-add';
import { FlightEdit } from './Component/flight-edit/flight-edit';
import { RegisterComponent } from './Component/auth/register';
import { LoginComponent } from './Component/auth/login';
import { BookFlight } from './Component/book-flight/book-flight';
import { Aboutus } from './Component/aboutus/aboutus';
import { Contactus } from './Component/contactus/contactus';
import { NetworkComponent } from './Component/my-network/my-network';

export const routes: Routes = [
    { path: '', component: Welcome },
    { path: 'welcome', redirectTo: '', pathMatch: 'full' },
    { path: 'users', component: User },
    { path: 'flights', component: Flight },
    { path: 'bookings', component: Booking },
    { path: 'bookings/create', component: BookFlight },
    { path: 'bookflight', component: BookFlight },
    { path: 'bookflight/:id', component: BookFlight },
    { path: 'addflight', component: FlightAdd },
    {path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'editflight/:id', component: FlightEdit },
    {path:'about', component:Aboutus},
    {path:'contact',component:Contactus},
    {path:'network',component:NetworkComponent}
];
