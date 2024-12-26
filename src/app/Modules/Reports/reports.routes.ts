import { Routes } from '@angular/router';
import { RepPageComponent } from './rep-page/rep-page.component';
import { RepIncomeComponent } from './rep-income/rep-income.component';
import { RepExpenseComponent } from './rep-expense/rep-expense.component';
import { RepRemitComponent } from './rep-remit/rep-remit.component';
import { RepHolderComponent } from './rep-holder/rep-holder.component';

export const ReportRoutes: Routes = [
  {path: "repPage", component: RepPageComponent,
    children: [
      {path: "repHolder", component: RepHolderComponent},
      {path: "repIncome", component: RepIncomeComponent},
      {path: "repExpense", component: RepExpenseComponent},
      {path: "repRemitance", component: RepRemitComponent},
      {path: "", redirectTo: "repHolder", pathMatch: "full"}
    ]
  },
  {path: "", redirectTo: "repPage", pathMatch: "full"},
];