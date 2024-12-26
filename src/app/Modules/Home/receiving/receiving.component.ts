import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServeService } from '../../../serve.service';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
declare let $: any;

@Component({
  selector: 'app-receiving',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, CommonModule, FormsModule, MatButtonModule, MatTooltipModule],
  templateUrl: './receiving.component.html',
  styleUrl: './receiving.component.css'
})
export class ReceivingComponent implements OnInit {
  load: boolean = false;

  transactions: any;
  transactionsArray: any[] = [];
  displayedColumns = ['code', 'name', 'numbers', 'date', 'time', 'type', 'amount', 'payment', 'status'];
  dataSource: any;
  private dataInterval: any;

  transacDet: any;
  laundryInfo: any;
  addServ: any;

  transID: any;

  staffId: any;

  transactionsRel: any;

  totalLaundry: any;
  totalService: any;

  payTransacID: any;
  inputAmount: any;
  payStatus: any;
  enterAmountBtn: boolean = true;
  declare bootstrap: any;
  isButtonDisabled: boolean = false;
  modalSample: boolean = false;

  
  constructor(
    private route: Router,
    private staffservice: ServeService,
    private http: HttpClient,
    private renderer: Renderer2
  ){}

  ngOnInit(): void {
    this.load = true;
    this.getTransactionsRec();
    this.startInteraval();
  }

  @ViewChild('transactionModal') modal!:ElementRef;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('paymentField') inputField!: ElementRef;

  ngAfterOnInit(): void{
    console.log('Modal:', this.modal);
  }

  ngOnDestroy() {
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
  }

  startInteraval(){
    this.dataInterval = setInterval(() => {
      this.getTransactionsRec();
    }, 5000);
  }


  //getTransactionsRec - this.transactions
  getTransactionsRec(){
    this.staffservice.getTransactionsRec().subscribe(
      (response) => {
        this.load = false;
          this.transactions = response;
          // this.transactionsArray = response;
          this.dataSource = new MatTableDataSource();

          if (Array.isArray(response)) {
            const sortedData = this.sortByPendingFirst(response); // Sort the data
            this.dataSource.data = sortedData; // Assign the sorted array to the data source
          } else {
            console.error('API response is not an array.');
          }

          this.dataSource = new MatTableDataSource(this.transactions);
          console.log(this.transactions);
      },
      (error) => {
          console.error('Error fetching user data', error);
      }
    );
  }

  sortByPendingFirst(data: any[]) {
    return data.sort((a, b) => {
      if (a.latest_transac_status === 'pending' && b.latest_transac_status !== 'pending') {
        return -1;
      } else if (a.latest_transac_status !== 'pending' && b.latest_transac_status === 'pending') {
        return 1;
      }
      return 0;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterStatus(status: string) {
    console.log(this.dataSource.data);
    if (status === '') {
      this.dataSource.data = this.transactions;
    } else {
      this.dataSource.data = this.transactions.filter((transactions: { latest_transac_status: string; }) => transactions.latest_transac_status === status);
      console.log(status)
    }
  }

  formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  //getCustTransaction - this.transactions
  navigateAppUpdLaundry(transId: any, latestStatus: any){
    this.load = true;
    if( latestStatus === 'pending'){
      this.load = true;
      console.log(transId)
      this.staffservice.getCustTransaction(transId).subscribe(
        (response) => {
          
          this.transactions = response;
          console.log(this.transactions)
          localStorage.setItem('transId', this.transactions[0].Transac_ID);
          this.route.navigate(['./mainpage/home/homemain/laundryDetails']);
          this.load = false;
        }
      )
    }else{

    }
  }

  //getCustTransaction - this.transacDet, getLaundryDet - this.laundryInfo, getAddServDet - this.addServe
  forPaymentModal(id :any){
    this.payTransacID = id;
    this.staffservice.getCustTransaction(id).subscribe(
      (response) => {
        console.log(response);
        // if (response.length > 1) {
          this.transacDet = response[0];
        // } else {
        //     this.transacDet = response[0];
        // }
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

    console.log(totalService);
    console.log(inputAmount);

    if(inputAmount >= total){
      this.enterAmountBtn = true;
      swalWithBootstrapButtons.fire({
        title: "Payment Entry",
        text: "You've entered an amount of " + inputAmount + ". Your change would be " + change + ". Confirm to proceed.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        didOpen: () => {
          const swalActions = document.querySelector('.swal2-actions');

          if (swalActions) {
            // Using Renderer2 to set style for button separation
            this.renderer.setStyle(swalActions, 'display', 'flex');
            this.renderer.setStyle(swalActions, 'justify-content', 'space-between'); // Adjusts button positions
            this.renderer.setStyle(swalActions, 'gap', '20px'); // Adds space between the buttons
          }

          // You can also target the individual buttons to apply more specific styles if needed
          const confirmButton = document.querySelector('.swal2-confirm');
          const cancelButton = document.querySelector('.swal2-cancel');

          if (confirmButton && cancelButton) {
            // Example of adding margin between buttons if needed
            this.renderer.setStyle(confirmButton, 'margin-left', '10px');
            this.renderer.setStyle(cancelButton, 'margin-right', '10px');
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.staffservice.addPayment(id, total).subscribe (
            (response) => {
              this.getTransactionsRec();
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
          this.inputField.nativeElement.value = '';
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.inputField.nativeElement.value = '';
          swalWithBootstrapButtons.fire({
            title: "Payment Entry Cancelled",
            icon: "error"
          });
        }
      });
    }else{
      this.enterAmountBtn = false;
      this.inputAmount = '';
      swalWithBootstrapButtons.fire({
        title: "Invalid Amount",
        icon: "error"
        });
    }
  }


  //forReleaseModal(id) - this.transID, updateStatuses(id, selectedStatus)
  updateStatusModal(id: any, selectedStatus: any) {
    if(selectedStatus === 'forRelease'){
        this.forReleaseModal(id);
        console.log(id);
        this.transID = id;
        // this.updateStatuses(id, selectedStatus);
    }
    else{
      console.log(selectedStatus);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure you want to update status?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Update to " + selectedStatus
      }).then((result) => {
        if (result.isConfirmed) {
          // this.updateStatuses(id, selectedStatus);

          if(selectedStatus !== null){
            this.staffId = localStorage.getItem('staffID')
            console.log(id);
            if (selectedStatus) {
              this.staffservice.updateStatus( { status: selectedStatus }, id, this.staffId).subscribe(
                (response) => {
                  console.log('Status updated successfully', response);
                  swalWithBootstrapButtons.fire({
                    position: "top",
                    icon: "success",
                    title: "Update Succesful",
                    text: "Transaction Laundry Status has been successfully updated to '" + selectedStatus + "'",
                    showConfirmButton: false,
                    timer: 1000
                  });
                  this.getTransactionsRec();
                }, error => {
                  console.error('Error updating status', error);
                });
            }
          }
        } else if ( result.dismiss === Swal.DismissReason.cancel) {
          this.getTransactionsRec();
          swalWithBootstrapButtons.fire({
            title: "Updating Laundry Status Cancelled",
            icon: "error"
          });
        }
        else {
          this.getTransactionsRec();
        }
      });
      
    }
  }

  //this.staffId, updateStatus
  updateStatuses(id: any, selectedStatus: any){
    console.log(id);
    selectedStatus = 'forRelease';
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
              text: "Transaction Laundry Status has been successfully updated to '" + selectedStatus + "'",
              showConfirmButton: false,
              timer: 1000
            });
            // window.location.reload();
          }, error => {
            console.error('Error updating status', error);
          });
      }
    }
  }

  //this.getLaundryDet(id), this.getAddServDet(id), this.totalPrice(id), this.paymentStatus(id), getCustTransaction - this.transactionsRel
  forReleaseModal(id:any){
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
        if(this.addServ.length === 0){
          this.addServ = null;
        }else{
          this.addServ = response;
        }
        
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
        this.totalService = response[0]?.Total;
        console.log(this.totalService);
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

  //reload getTransactionsRec(table)
  back(){
    this.getTransactionsRec();
  }

}
