import { Component, OnInit } from '@angular/core';
import { ServeService } from '../../../serve.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rep-remit',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './rep-remit.component.html',
  styleUrl: './rep-remit.component.css'
})
export class RepRemitComponent implements OnInit{
  isLoading: boolean = false;
  expenses: any;
  totalexpenses: any;
  overalltotal: any;
  totalpayments: any;
  payments: any;
  cash: any;
  staffID: any;
  receiveDate: any;
  inputRemAmount: any;
  constructor(
    private serve: ServeService
  ){}

  ngOnInit(): void {
    
    this.staffID = localStorage.getItem('staffID');
    const staffId = localStorage.getItem('staffID');
    console.log(this.staffID);
    this.getCash();

    this.serve.getIncomeRepPayments(staffId).subscribe((result: any) => {
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

    this.serve.getIncomeRepExpenses(staffId).subscribe((result: any) => {
      this.expenses = result.data;
      this.totalexpenses = result.totalDayExpenses;
      console.log(result);
    });
  }
  isDisabled: boolean = true;

  getCash(){
    this.isLoading = true;
    const staffId = localStorage.getItem('staffID');
    this.serve.getCash(staffId).subscribe((data: any) => {
      console.log(data)
      this.cash = data.data[0];
      this.isLoading = false;
      // this.expense = data.expenses;
      // this.payment = data.payment;
      // this.totalexpense = data.totalexpenses;
      // this.totalpayment = data.totalpayment;
      // this.overalltotal = data.overalltal;
    });
  }

  receive(iniDate: any){
    console.log(iniDate)
    this.serve.receiveInitial(this.staffID,iniDate).subscribe((result: any) => {
      this.receiveDate = result;
      console.log(result);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Initial Cash has been received successfully. You can now start your transactions.",
        showConfirmButton: false,
        timer: 2000
      });
      this.getCash();
    })
  }

  enterAmount(amount: any, cashId: any){
    console.log(this.inputRemAmount)
    console.log(amount);
    const staffId = localStorage.getItem('staffID');
    this.serve.enterAmount(staffId, amount, cashId).subscribe((data: any) => {
      console.log(data)
    });
  }
  // openForm() {
  //   this.isDisabled = true;
  //   const totalAmount = 5000.00;
  //   Swal.fire({
  //     title: 'Cash Count',
  //     html: `
  //     <h3 >Cashier in Charge: Marites Ka</h3>
  //       <form id="denominationForm">
  //         <table class="table">
  //           <thead>
  //             <tr>
  //               <th class="col-md-3">Amount</th>
  //               <th>Count</th>
  //               <th class="col-md-3">Amount</th>
  //               <th>Count</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             <tr>
  //               <td>1000</td>
  //               <td><input type="number" id="denom1000" class="form-control" placeholder="Count of 1000"></td>
  //               <td>500</td>
  //               <td><input type="number" id="denom500" class="form-control" placeholder="Count of 500"></td>
  //             </tr>
  //             <tr>
  //               <td>200</td>
  //               <td><input type="number" id="denom200" class="form-control" placeholder="Count of 200"></td>
  //               <td>100</td>
  //               <td><input type="number" id="denom100" class="form-control" placeholder="Count of 100"></td>
  //             </tr>
  //             <tr>
  //               <td>50</td>
  //               <td><input type="number" id="denom50" class="form-control" placeholder="Count of 50"></td>
  //               <td>20</td>
  //               <td><input type="number" id="denom20" class="form-control" placeholder="Count of 20"></td>
  //             </tr>
  //             <tr>
  //               <td>10</td>
  //               <td><input type="number" id="denom10" class="form-control" placeholder="Count of 10"></td>
  //               <td>5</td>
  //               <td><input type="number" id="denom5" class="form-control" placeholder="Count of 5"></td>
  //             </tr>
  //             <tr>
  //               <td>1</td>
  //               <td><input type="number" id="denom1" class="form-control" placeholder="Count of 1"></td>
  //               <td></td>
  //               <td></td>
  //             </tr>
  //           </tbody>
  //         </table>
  //       </form>
  //     `,
  //     confirmButtonText: 'Calculate Total',
  //     showCancelButton: true,
  //     cancelButtonText: 'Cancel',
  //     preConfirm: () => {
  //       // Retrieve values from the form
  //       const denom1000 = +(document.getElementById('denom1000') as HTMLInputElement).value || 0;
  //       const denom500 = +(document.getElementById('denom500') as HTMLInputElement).value || 0;
  //       const denom200 = +(document.getElementById('denom200') as HTMLInputElement).value || 0;
  //       const denom100 = +(document.getElementById('denom100') as HTMLInputElement).value || 0;
  //       const denom50 = +(document.getElementById('denom50') as HTMLInputElement).value || 0;
  //       const denom20 = +(document.getElementById('denom20') as HTMLInputElement).value || 0;
  //       const denom10 = +(document.getElementById('denom10') as HTMLInputElement).value || 0;
  //       const denom5 = +(document.getElementById('denom5') as HTMLInputElement).value || 0;
  //       const denom1 = +(document.getElementById('denom1') as HTMLInputElement).value || 0;

  //       // Calculate the total amount
  //       const totalAmount = (denom1000 * 1000) +
  //                           (denom500 * 500) +
  //                           (denom200 * 200) +
  //                           (denom100 * 100) +
  //                           (denom50 * 50) +
  //                           (denom20 * 20) +
  //                           (denom10 * 10) +
  //                           (denom5 * 5) +
  //                           (denom1 * 1);

  //       return {
  //         totalAmount
  //       };
  //     }
  //   }).then((result) => {
  //     // if (result.isConfirmed) {
  //     //   const { totalAmount } = result.value;
  //     //   Swal.fire({
  //     //     html: <p>Total Amount: ${totalAmount}.00</p>,
  //     //     icon: 'info'
  //     //   }).then((result) => {
  //     //     if (result.isConfirmed || result.isDismissed) {
  //     //       // Assign the total amount to cashCount
  //     //       this.cashCount = totalAmount;
  //     //     }
  //     //   });
  //     // }
  //   });
  // }
}
