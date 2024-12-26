import { Routes } from '@angular/router';
import { StaffLoginComponent } from './staff-login/staff-login.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { ExpeRoutes } from './Modules/Expenses/expenses.routes';
import { HomeRoutes } from './Modules/Home/home.routes';
import { CustomerRoutes } from './Modules/Customers/customers.routes';
import { ReportRoutes } from './Modules/Reports/reports.routes';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {path: "login", component: StaffLoginComponent},
  {path: "mainpage", component: MainpageComponent, canActivate: [authGuard],
    children: [
      {
        path: "home",
        loadChildren: () => import('./Modules/Home/home.routes').then(r=>HomeRoutes)
      },
      {
        path: "expenses",
        loadChildren: () => import('./Modules/Expenses/expenses.routes').then(r=>ExpeRoutes)
      },
      {
        path: "customers",
        loadChildren: () => import('./Modules/Customers/customers.routes').then(r=>CustomerRoutes)
      },
      {
        path: "reports",
        loadChildren: () => import('./Modules/Reports/reports.routes').then(r=>ReportRoutes)
      },
      {path: "", redirectTo: "home", pathMatch: "full"}
    ]
  },
  {path: "", redirectTo: "login", pathMatch: "full"}
];
