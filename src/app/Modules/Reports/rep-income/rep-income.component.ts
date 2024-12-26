import { Component } from '@angular/core';
import { ServeService } from '../../../serve.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rep-income',
  standalone: true,
  imports: [RouterLink, RouterOutlet,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './rep-income.component.html',
  styleUrl: './rep-income.component.css'
})
export class RepIncomeComponent {
  date_id =  localStorage.getItem('datetimeincome');
  income: any;
  payments: any;
  expenses: any;
  overalltotal: any;
  dateincome: any;
  totalpayments: any;
  totalexpenses: any;
  staff: any;
  currentDateTime: Date = new Date();

  constructor(
    private staffserve: ServeService,
    private route: Router
  ){}
  ngOnInit(): void {
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);

    const staffId = localStorage.getItem('staffID');

    this.staffserve.getIncomeRepPayments(staffId).subscribe((result: any) => {
      // this.payments = result.transactionPayments;
      // this.expenses = result.transactionExpenses;
      // this.totalpayments = result.totalPayments;
      // this.totalexpenses = result.totalExpense;
      // this.overalltotal = result.total;
      // this.dateincome = result.transactionPayments[0].transactionDate;
      // this.staff = result.transactionExpenses[0].adminNames;
      // console.log(this.payments,this.expenses,this.overalltotal)
      this.payments = result.data;
      this.totalpayments = result.totalDayPayments;


      console.log(result);
    });

    this.staffserve.getIncomeRepExpenses(staffId).subscribe((result: any) => {
      this.expenses = result.data;
      this.totalexpenses = result.totalDayExpenses;
      console.log(result);
    });

    this.overalltotal = this.totalpayments - this.totalexpenses; 
  }
}

