import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ReceivingComponent } from './receiving/receiving.component';
import { HomeHolderComponent } from './home-holder/home-holder.component';
import { ReleasingComponent } from './releasing/releasing.component';
import { AddupdLaundryComponent } from './addupd-laundry/addupd-laundry.component';

export const HomeRoutes: Routes = [
  {path: "homemain", component: HomePageComponent,
    children: [
      {path: "homepage", component: HomeHolderComponent},
      {path: "receive", component: ReceivingComponent},
      {path: "release", component: ReleasingComponent},
      {path: "laundryDetails", component: AddupdLaundryComponent},
      {path: "", redirectTo: "homepage", pathMatch: "full"}
    ]
  },
  {path: "", redirectTo: "homemain", pathMatch: "full"}
];