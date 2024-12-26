import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { ServeService } from '../../../serve.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare let $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-releasing',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterModule, MatTooltipModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './releasing.component.html',
  styleUrl: './releasing.component.css'
})
export class ReleasingComponent {
  displayedColumns = ['code', 'name', 'numbers', 'transacDateTime', 'type', 'amount', 'payment', 'status'];
  dataSource: any;
  transactions: any;
  private dataInterval: any;
  transactionsRel: any;
  laundryInfo: any;
  addServ:any;
  totalLaundry: any;
  totalService: any;
  payStatus: any;
  staffId: any


  payTransacID: any;
  transacDet: any;
  inputAmount: any

  @ViewChild('transactionModal') modal!:ElementRef;
  @ViewChild('exampleModal1') modal1!:ElementRef;
  @ViewChild('paymentField') inputField!: ElementRef;

  ngAfterOnInit(): void{
    console.log('Modal:', this.modal);
    console.log('Modal:', this.modal1);
  }

  constructor(
    private route: Router,
    private staffservice: ServeService
  ){}

  ngOnInit(): void {
    this.loadTransactionData();
    this.startInteraval();
  }

  ngOnDestroy() {
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
  }

  startInteraval(){
    this.dataInterval = setInterval(() => {
      this.loadTransactionData();
    }, 5000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterStatus(status: any) {
    console.log(status);
    if (status === '') {
      this.dataSource.data = this.transactions;
    } else if(status === 'unpaid') {
      this.dataSource.data = this.transactions.filter((transactions: { payment: string; }) => transactions.payment.toLowerCase() === 'unpaid');
      console.log(status)
    } else if(status === 'paid'){
      this.dataSource.data = this.transactions.filter((transactions: { payment: any; }) => ['cash', 'gcash', 'bpi'].includes(transactions.payment.toLowerCase()));
    }
    // ['cash', 'gcash', 'bpi'].includes(status)
  }

  loadTransactionData(){
    this.staffservice.getTransactionRel().subscribe(
      (response: any) => {
          this.transactions = response;
          console.log(this.transactions);
          this.dataSource = new MatTableDataSource(this.transactions);
      },
      (error: any) => {
          console.error('Error fetching user data', error);
      }
    );
  }

  navTransDet(transId: any){
    console.log(transId)
    this.staffservice.getCustTransaction(transId).subscribe(
      (response: any) => {
        this.transactions = response;
        console.log(this.transactions)
        localStorage.setItem('transId', this.transactions[0].Transac_ID);
      }
    )
  }

  forPaymentModal(id :any){

    if (this.modal1) {
      $(this.modal1.nativeElement).modal('show');
      console.log(id);

      
    this.payTransacID = id;
    this.staffservice.getCustTransaction(id).subscribe(
      (response) => {
        this.transacDet = response[0];
        console.log(response);
      }
    )

    this.staffservice.getLaundryDet(id).subscribe(
      (response: any) => {
        this.laundryInfo = response;
        console.log(this.laundryInfo);
      }
    )


    this.staffservice.getAddServDet(id).subscribe(
      (response: any) => {
        console.log(response);
        this.addServ = response;
        if(this.addServ.length === 0){
          this.addServ = null;
        }else{
          this.addServ = response;
        }
      }
    )

    this.totalPrice(id);
    } else {
      console.error('Modal is not initialized');
    }
  }

  enterAmount(id: any, inputAmount: any, totalLaundry: any, totalService: any){
    const total = totalLaundry + totalService;
    const change = inputAmount - total;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Payment Entry",
      text: "You've entered an amount of " + inputAmount + ". Your change would be " + change + ". Confirm to proceed.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.staffservice.addPayment(id, total).subscribe (
          (response) => {
            console.log(response);
          }
        )
        swalWithBootstrapButtons.fire({
          title: "Payment Entry Successful!",
          text: "Customer payment has been successfully added.",
          icon: "success",
          showConfirmButton: false,
          timer: 1000
        });
        this.loadTransactionData();
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.inputAmount = '';
        swalWithBootstrapButtons.fire({
          title: "Payment Entry Cancelled",
          icon: "error"
        });
      }
    });
  }

  updateStatuses(id: any, selectedStatus: any){
    console.log(id);
    selectedStatus = 'completed';
    if(selectedStatus != null){
      this.staffId = localStorage.getItem('staffID');
      console.log(id);
      if (selectedStatus) {
        this.staffservice.updateStatus( { status: selectedStatus }, id, this.staffId).subscribe(
          (response) => {
            console.log('Status updated successfully', response);
            Swal.fire({
              position: "top",
              icon: "success",
              title: "Update Succesful",
              text: "Transaction Laundry Status has been successfully Completed",
              showConfirmButton: false,
              timer: 1000
            });
            this.loadTransactionData();
          }, error => {
            console.error('Error updating status', error);
          });
      }
    }
  }

  doneTransac(id:any){
    if (this.modal) {
      $(this.modal.nativeElement).modal('show');
      console.log(id);

      this.getLaundryDet(id);
      this.getAddServDet(id);
      this.totalPrice(id);
      this.paymentStatus(id);

      this.staffservice.getCustTransaction(id).subscribe(
        (response) => {
          this.transactionsRel = response[0];
          console.log(response);
        }
      )
    } else {
      console.error('Modal is not initialized');
    }
  }


  getLaundryDet(id: any){
    this.staffservice.getLaundryDet(id).subscribe(
      (response: any) => {
        this.laundryInfo = response;
        console.log(this.laundryInfo);
      }
    )
  }

  getAddServDet(id: any){
    this.staffservice.getAddServDet(id).subscribe(
      (response: any) => {
        this.addServ = response;
        console.log(this.addServ);
      }
    )
  }

  totalPrice(id: any){
    this.staffservice.totalPriceLaundry(id).subscribe(
      (response: any) =>{
        this.totalLaundry = response[0].LaundryTotal;
        console.log(this.totalLaundry)
      }
    )

    this.staffservice.totalPriceService(id).subscribe(
      (response: any) =>{
        if(response.length >= 0){
          this.totalService = response[0].Total;
          console.log(this.totalService);
        }else{

        }
        
      }
    )
  }

  paymentStatus(id: any){
    this.staffservice.paymentStatus(id).subscribe(
      (response: any) =>{
        this.payStatus = response;
        console.log(this.payStatus);
      }
    )
  }

  back(){
    this.loadTransactionData();
  }




  // doneTransac(id: any){
  //   console.log(id);
  //   this.staffservice.doneTransac(id).subscribe(
  //     (response: any) => {
  //       this.transactions = response;
  //       console.log(this.transactions)
  //       location.reload();
  //     }
  //   )
  // }
}
