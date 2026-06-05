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
import { OfferDetails } from './Component/offers/offers-details';
import { Addons } from './Component/addons/addons';
import { Feedback } from './Component/feedback/feedback';
import { Home1 } from './Component/home1/home1';
import { DisplayFeedback } from './Component/display-feedback/display-feedback';
import { DisplayMails } from './Component/display-mails/display-mails';
import { PassengerDetail } from './Component/passenger-detail/passenger-detail';
import { BookingByID } from './Component/booking-by-id/booking-by-id';
import { PaymentGateway } from './Component/payment-gateway/payment-gateway';
import { BookingCart } from './Component/booking-cart/booking-cart';
import { ManageAccount } from './Component/manage-account/manage-account';
import { TermsConditions } from './Component/terms-conditions/terms-conditions';
import { AdminRegistration } from './Component/admin-registration/admin-registration';
import { Menu } from './Component/menu/menu';
import { TravelCertificate } from './Component/travel-certificate/travel-certificate';
import { PetPolicy } from './Component/pet-policy/pet-policy';
import { ExcessBaggage } from './Component/excess-baggage/excess-baggage';
import { PaymentSuccess } from './Component/payment-success/payment-success';
import { Error } from './Component/error/error';
import { MenuCart } from './Component/menu-cart/menu-cart';
import { ManageBooking } from './Component/manage-booking/manage-booking';
import { EditBooking } from './Component/edit-booking/edit-booking';
import { Inprogress } from './Component/inprogress/inprogress';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { Seatselection } from './Component/seatselection/seatselection';

export const routes: Routes = [
    {path: '', component: Welcome },
    {path: 'welcome', redirectTo: '', pathMatch: 'full' },
    {path: 'users', component: User },
    {path:'home1', component:Home1},
    {path: 'flights', component: Flight },
    {path: 'bookings', component: Booking, canActivate: [AuthGuard] },
    {path: 'bookings/create', component: BookFlight, canActivate: [AuthGuard] },
    {path: 'bookflight', component: BookFlight, canActivate: [AuthGuard] },
    {path:'bookingsbyid', component:BookingByID, canActivate: [AuthGuard]},
    {path: 'bookflight/:id', component: BookFlight, canActivate: [AuthGuard] },
    {path: 'addflight', component: FlightAdd, canActivate: [AdminGuard] },
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent },
    {path: 'editflight/:id', component: FlightEdit, canActivate: [AdminGuard] },
    {path:'about', component:Aboutus},
    {path:'contact',component:Contactus},
    {path:'network',component:NetworkComponent},
    {path:'offers',component:Offers},
    {path:'offers/:category', component: OfferDetails},
    {path:'addons',component:Addons},
    {path:'feedback', component:Feedback},
    {path:'contact',component:Contactus},
    {path:'disfeedback', component:DisplayFeedback},
    {path:'dismessages', component:DisplayMails},
    {path:'passengerdetails/:id', component:PassengerDetail},
    {path:'passengerdetails', component:PassengerDetail},
    {path:'booking-cart', component: BookingCart, canActivate: [AuthGuard]},
    {path:'payment',component:PaymentGateway},
    {path:'payment-success', component: PaymentSuccess},
    {path:'manageaccount', component: ManageAccount, canActivate: [AuthGuard]},
    {path:'admin-register', component: AdminRegistration},
    {path:'menu',component:Menu},
    {path:'travel',component:TravelCertificate},
    {path:'pet-policy', component: PetPolicy},
    {path:'excess-baggage', component: ExcessBaggage},
    {path:'error', component: Error},
    {path:'terms', component: TermsConditions},
    {path:'menu-cart',component:MenuCart},
    {path:'manage-bookings', component: ManageBooking, canActivate: [AdminGuard]},
    {path:'edit-booking/:id', component: EditBooking, canActivate: [AdminGuard]},
    {path:'admin-register', component: AdminRegistration, canActivate: [AdminGuard]},
    {path:'inprogress', component: Inprogress},
    {path:'seatselect',component:Seatselection}

];
