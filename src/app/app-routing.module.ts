import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './LandingPage/home.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditProfileComponent } from '../../src/app/edit-profile/edit-profile.component';
import { ViewCentresComponent } from './view-centres/view-centres.component';
import { GaurdService } from './Services/gaurd.service';
import { ContactedUserProfileComponent } from './contacted-user-profile/contacted-user-profile.component';
const routes: Routes = [
  { path: '', pathMatch: 'full',component: HomeComponent },
  { path: 'home',redirectTo: '',  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate:[GaurdService]},
  { path: 'EditProfile', component: EditProfileComponent, canActivate:[GaurdService]},
  { path: 'viewCentres', component: ViewCentresComponent},
  { path: 'contactedUserProfiles/:userId/:status', component:ContactedUserProfileComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes , {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
