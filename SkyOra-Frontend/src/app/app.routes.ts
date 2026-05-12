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
import { Offers } from './Component/offers/offers';
import { Addons } from './Component/addons/addons';
import { Feedback } from './Component/feedback/feedback';
import { Home1 } from './Component/home1/home1';
import { DisplayFeedback } from './Component/display-feedback/display-feedback';
import { DisplayMails } from './Component/display-mails/display-mails';
import { PassengerDetail } from './Component/passenger-detail/passenger-detail';
import { BookingByID } from './Component/booking-by-id/booking-by-id';

export const routes: Routes = [
    { path: '', component: Welcome },
    { path: 'welcome', redirectTo: '', pathMatch: 'full' },
    { path: 'users', component: User },
    {path:'home1', component:Home1},
    { path: 'flights', component: Flight },
    { path: 'bookings', component: Booking },
    { path: 'bookings/create', component: BookFlight },
    { path: 'bookflight', component: BookFlight },
    {path:'bookingsbyid', component:BookingByID},
    { path: 'bookflight/:id', component: BookFlight },
    { path: 'addflight', component: FlightAdd },
    {path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'editflight/:id', component: FlightEdit },
    {path:'about', component:Aboutus},
    {path:'contact',component:Contactus},
    {path:'network',component:NetworkComponent},
    {path:'offers',component:Offers},
    {path:'addons',component:Addons},
    {path:'feedback', component:Feedback},
    {path:'contact',component:Contactus},
    {path:'disfeedback', component:DisplayFeedback},
    {path:'dismessages', component:DisplayMails},
    {path:'passengerdetails/:id', component:PassengerDetail},
    {path:'passengerdetails', component:PassengerDetail}

];
