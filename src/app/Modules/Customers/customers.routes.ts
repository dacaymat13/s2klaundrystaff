import { Routes } from '@angular/router';
import { CustPageComponent } from './cust-page/cust-page.component';
import { CustListComponent } from './cust-list/cust-list.component';
import { CustViewComponent } from './cust-view/cust-view.component';
import { ViewTransactionCustComponent } from './view-transaction-cust/view-transaction-cust.component';

export const CustomerRoutes: Routes = [
  {path: "custpage", component: CustPageComponent,
    children: [
      {path: "custlist", component: CustListComponent},
      {path: "custview", component: ViewTransactionCustComponent},
      {path: "custhistory", component: CustViewComponent},
      {path: "", redirectTo: "custlist", pathMatch: "full"}
    ]
  },
  {path: "", redirectTo: "custpage", pathMatch: "full"}
];