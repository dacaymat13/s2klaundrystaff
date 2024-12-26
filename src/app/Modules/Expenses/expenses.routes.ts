import { Routes } from '@angular/router';
import { ExpListComponent } from './exp-list/exp-list.component';
import { ExpViewComponent } from './exp-view/exp-view.component';
import { ExpPageComponent } from './exp-page/exp-page.component';

export const ExpeRoutes: Routes = [
  {path: "expmain", component: ExpPageComponent,
    children: [
      {path: "explist", component: ExpListComponent},
      {path: "expview", component: ExpViewComponent},
      {path: "", redirectTo: "explist", pathMatch: "full"}
    ]
  },
  {path: "", redirectTo: "expmain", pathMatch: "full"}
];