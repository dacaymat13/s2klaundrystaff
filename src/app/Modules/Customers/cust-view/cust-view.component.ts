import { Component } from '@angular/core';
import { ServeService } from '../../../serve.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cust-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cust-view.component.html',
  styleUrl: './cust-view.component.css'
})
export class CustViewComponent {
  today: any = '';
  customer: any;
  datasource: any;
  custID: any;
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  error: string = '';
  highlightedDates: any;
  totTransacs: any;
  data: any;

  constructor(
    private route: Router,
    private staffservice: ServeService,
  ){
    this.today = ''; // Initialize today

    // this.filteredTransactions = this.transactions;
  }
  back(){
    this.route.navigate(['./mainpage/customers/custpage/custlist'])
  }


  ngOnInit(): void {
    const date = new Date();
    this.today = date.toISOString().split('T')[0];

    this.getTotalTransactions();
    this.loadCustomerData();
    this.loadCustomerHistory();

  }

  loadCustomerData(): void {
    this.custID = {id: localStorage.getItem('custId')};
    // this.custID = this.authService.getCustId();
    // console.log(this.custID);
    this.staffservice.getCustomerData(this.custID.id).subscribe(
      (response) => {
          this.customer = response;
          console.log(this.customer);
      },
      (error) => {
          console.error('Error fetching user data', error);
      }
    );
  }

  getTotalTransactions(){
    this.custID = localStorage.getItem('custId');
    this.staffservice.getTotalTransactions(this.custID).subscribe(
      (response) => {
        this.totTransacs = response;
        console.log(this.totTransacs);
      });
  }

  loadCustomerHistory(): void {
    this.custID = localStorage.getItem('custId');
    // console.log(this.custID);

    this.staffservice.getCustTransacHistory(this.custID).subscribe(
      (response) => {
        console.log(response);
        this.data = response.trans;
        if (Array.isArray(response)) {
          this.transactions = response;
          this.filteredTransactions = [...this.transactions];
        } else {
          console.error('API response is not an array', response);
        }
      },
      (error) => {
        console.error('Error fetching customer history', error);
      }
    );
  }

  history(id: any) {
    console.log(id);
    localStorage.setItem('Transac_ID', id);
    this.route.navigate(['/mainpage/customers/custpage/custview']);
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.today = input.value ? input.value : null; 
    this.filterTransactions();


  }

  filterTransactions(): void{
    if (this.today){
      console.log(this.today);
      const selected = new Date(this.today).toISOString().split('T')[0];
      console.log(selected);

      this.filteredTransactions = this.transactions.filter(transactions => {
        const transactionDate = new Date(transactions.Transac_date);
        console.log(transactionDate);
        console.log(transactionDate.toISOString().split('T')[0]);
        return transactionDate.toISOString().split('T')[0] === selected;
      });
    }
  }
}
