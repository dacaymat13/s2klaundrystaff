import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServeService } from '../../../serve.service';

@Component({
  selector: 'app-view-transaction-cust',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './view-transaction-cust.component.html',
  styleUrl: './view-transaction-cust.component.css'
})
export class ViewTransactionCustComponent implements OnInit{
  
  cust_id = {id:localStorage.getItem('custId')}
   his_id = {id:localStorage.getItem('Transac_ID')}
   custs:any;
   histo: any;
   totalAmount: any;
   cust: any;
   totalpayment: any;
   balance: any;
   data:any;
   totalPayment: any;
   histoss: any;
   trans_id: any;
   payment: any;
   trackingnumber: any;
   totalamount: any;
   addservices: any;
   service: any;
   isLoading: boolean = false;
   alltotal: any;
   totalplus: any;
 
   constructor(
     private admin: ServeService
   ){}
   ngOnInit(): void {
     this.spinner();
    //  this.admin.findcustomer(this.cust_id.id).subscribe(
    //    (result: any) => {
    //      this.cust = result; 
    //      console.log(result);
    //    }
    //  );
     this.admin.findtransactionprint(this.his_id.id).subscribe(
       (result: any) => {
         this.histo = result.data; 
         this.trackingnumber = result.data[0].Tracking_number;
         this.payment = result.data[0].totalPaymentAmount;
         this.totalpayment = result.price;
         this.totalamount = result.totalamount;
         this.addservices = result.addprice;
         this.balance = result.data[0].balanceAmount; 
         this.service = result.servicedata;
         this.alltotal = this.totalpayment + this.addservices;
 
         this.totalplus =  this.payment - this.totalpayment - this.addservices 
 
         console.log( this.histo,this.payment,this.totalpayment,this.trackingnumber, this.totalplus );
       }
     );
     
   }
   spinner(){
     this.isLoading = true
 
     setTimeout(() => {
       this.isLoading = false;
     },3000);
   }

}