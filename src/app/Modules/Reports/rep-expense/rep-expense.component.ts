import { Component, OnInit } from '@angular/core';
import { ServeService } from '../../../serve.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rep-expense',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rep-expense.component.html',
  styleUrl: './rep-expense.component.css'
})
export class RepExpenseComponent implements OnInit{
  expenses: any;
  totalexpenses:any;
  receiptpic: any;
  expDet:any;

  constructor(
    private serve: ServeService
  ){}
  ngOnInit(): void {
    const staffId = localStorage.getItem('staffID');
    this.serve.getIncomeRepExpenses(staffId).subscribe((data: any) => {
      this.expenses = data.data;
      this.receiptpic = `http://localhost:8000/storage/${data.Expense.Receipt_filenameimg}`;
      this.totalexpenses = data.totalDayExpenses;
    })
  }

  dispExpReceipt(expId: any){
    this.serve.getExpReceipt(expId).subscribe(
      (response) => {
        this.expDet = response[0];
        console.log(this.expDet);
        console.log("HAHAHAHAHAH")
      }
    )
  }
}
