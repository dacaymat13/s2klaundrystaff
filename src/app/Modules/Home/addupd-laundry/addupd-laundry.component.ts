import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ServeService } from '../../../serve.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-addupd-laundry',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './addupd-laundry.component.html',
  styleUrl: './addupd-laundry.component.css'
})
export class AddupdLaundryComponent {
  transaction: any;
  custInfo: any;
  pricing:any;
  laundry:any;
  laundryDetailsForm: any;
  weighting: any;
  price:any;
  transId: any = localStorage.getItem('transId');
  totalPrice: any;
  totallyPrice: any = localStorage.getItem('totalPrice');
  servicess: any;
  totalService: any;
  overallPrice: any;
  laundryPrice: any;
  servicePrice: any;
  isEditing: boolean = false;
  editIndex: any;
  editLaundryDetails: any;
  updatelaundryform: any;
  laundryPriceSeekeer: any;
  servicesss: any;
  showWarning: boolean = false;
  isModalVisible = false;
  inputWeightValue: any | null = null;
  minnn: boolean = false;
  success: any;
  showPaymentForm: boolean = false; // Toggle for showing the form
  customerPayment: any | null = null;
  zero: any;
  amount: any;
  change: any;
  showChange: boolean = false;
  weightPrice: any;
  addServiceTotal: any;
  laundryDetTotal: any;

  isEditingWeight: boolean = false;
  isEditingService: boolean = false;

  load: boolean = false;

  addLaundryDetails = new FormGroup({
    Categ_ID: new FormControl(),
    WeightEdit: new FormControl()
  });

  subId = new FormGroup({
    Admin_ID: new FormControl()
  });

  addlaundryform = new FormGroup({
    AddService_ID: new FormControl(null),
    Transac_ID: new FormControl(null),
    AddService_name: new FormControl(null),
    AddService_price: new FormControl(null)
  });
  totalCharge: any;


  constructor(
    private fb: FormBuilder,
    private staffservice: ServeService,
    private route: Router
  ){}

  @ViewChild('transactionModal') modal!:ElementRef;

  ngAfterOnInit(): void{
    console.log('Modal:', this.modal);

  }

  createLaundryDetail(ld: any): FormGroup {
    return this.fb.group({
      TransacDet_ID: [ld.TransacDet_ID || null],
      Categ_ID: [ld.Categ_ID || null],
      Category: [ld.Category || ''],
      Qty: [ld.Qty || ''],
      Weight: [ld.Weight || ''],
      WeightEdit: [ld.Weight || '', [Validators.required]],
      Minimum_weight: [ld.Minimum_weight],
      PriceperMin: [ld.PriceperMin],
      PricePerKg: [ld.Price || 0],
      Price: [ld.EachPriceAll || 0],
      LaundryCharge: [ld.EachPrice || 0],
      LaundryChargeEdit: [ld.EachPrice || 0],
      TotalCharge: [ld.EachTotalPrice || 0],
      TotalLaundryPrice: [ld.TotalPrice]
    });
  }

  serviceDet(sd: any): FormGroup {
    return this.fb.group({
      AddService_ID: [sd.AddService_ID || null],
      Transac_ID: [sd.Transac_ID || localStorage.getItem('transId')],
      AddService_name: [sd.AddServiceName || ''],
      Address: [sd.Address || ''],
      DeliveryAddress: [sd.DeliveryAddress || ''],
      AddService_price: [sd.service_price || 0, [Validators.required]],
      totalPrice: [sd.TotalPrice]
    });
  }

  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (+input.value < 0) {
      input.value = input.value.replace('-', '');
    }
  }

  calculateTotalOverall(){
    
  }

  ngOnInit(): void {
    this.laundryDetailsForm = this.fb.group({
      laundryDetails: this.fb.array([])
    });
    this.getCustTransaction();
    this.dispLaundryDetails();
    this.dispAddService();
    // this.totalPrices();
    this.zeroerra();
    this.staffservice.getAddServiceTotal(localStorage.getItem('transId')).subscribe ((response: any) => {
      this.addServiceTotal = response.data;
    });

    this.staffservice.getLaundryDetTotal(localStorage.getItem('transId')).subscribe ((response: any) => {
      this.laundryDetTotal = response.data;
    });

    this.updatelaundryform = this.fb.group({
      services: this.fb.array([]),
      totalPrice: [0]
    });
  }

  get laundryDetails(): FormArray {
    return this.laundryDetailsForm.get('laundryDetails') as FormArray;
  }

  get services() {
    return (this.updatelaundryform.get('services') as FormArray);
  }

  editLaundryDetail() {
    this.isEditingWeight = true;
    console.log(this.createLaundryDetail(this.laundryDetails))
  }

  editServiceDetail() {
    this.isEditingService = true;
  }

  getCustTransaction(){
    this.transId = localStorage.getItem('transId');
    console.log(this.transId)
    this.staffservice.getCustTransaction(this.transId).subscribe(
      (response) => {
        this.custInfo = response[0];
        this.transaction = response[0];
        console.log(this.transaction);

      }
    )
  }

  dispLaundryDetails(){
    this.staffservice.getLaundryDetails(this.transId).subscribe(
      (response: any) =>{
        this.laundry = response;
        console.log(this.laundry)

        if(this.totallyPrice === 0){
          this.laundryPriceSeekeer = 0;
        }

        console.log(response);
        response.forEach((ld:any) => {
          console.log(ld);
          this.laundryDetails.push(this.createLaundryDetail(ld));
          console.log(this.laundryDetails)
        });
        this.calculateTotal();
      }
    )
  }

  dispAddService(){
    this.staffservice.getAddService(this.transId).subscribe(
      (response) => {
        console.log(response.data)
        this.servicess = response;
        console.log(this.servicess.data[0].AddService_ID);
        this.servicesss = response[0];
        if(this.servicess.data[0].AddService_ID == null){
          this.servicess = null;
          console.log(this.servicess)
        }else{
          console.log(response);
          response.data.forEach((sd:any) => {
            console.log(sd);
            this.services.push(this.serviceDet(sd));
            console.log(this.serviceDet(sd));
          });
        }
      }
    )
  }

  openModal() {
    this.isModalVisible = true;
    console.log(this.createLaundryDetail(this.laundry));
  }

  cancel(){
    this.createLaundryDetail(this.laundry);
    console.log(this.createLaundryDetail(this.laundry));
    this.isEditingWeight = false;
    // if(this.isEditingWeight == false){
    //   this.laundry.forEach((ld:any) => {
    //     console.log(ld);
    //     this.laundryDetails.push(this.createLaundryDetail(ld));
    //     console.log(this.laundryDetails)
    //   });
    // }
    this.isEditingService = false;
  }

  // closeModal() {
  //   this.isModalVisible = false; // Close the modal
  // }

  

  // totalPrices(){
  //   this.transId = localStorage.getItem('transId');
  //   console.log(this.transId)
  //   this.staffservice.totalPriceLaundry(this.transId).subscribe(
  //     (response) => {
  //       this.totallyPrice = response[0].LaundryTotal;
  //       console.log(this.totallyPrice);
  //     }
  //   )

  //   this.staffservice.totalPriceService(this.transId).subscribe(
  //     (response: any) =>{
  //       if(response === 0){
  //         this.totalService = 0;
  //       }else {
  //         this.totalService = response[0].Total;
  //       }
  //     console.log(this.totalService)
  //     }
  //   )
  // }

  updatePrice(index: number): void {
    // const input = event.target as HTMLInputElement;
    // if (+input.value < 0) {
    //   input.value = input.value.replace('-', '');
    // }
    console.log(index)
    const weight = this.laundryDetails.at(index).get('WeightEdit')?.value;
    const pricePerKg = this.laundryDetails.at(index).get('PricePerKg')?.value;
    const minWeight = this.laundryDetails.at(index).get('Minimum_weight')?.value;

    console.log(weight);

    if(weight < minWeight){
      this.laundryPrice = minWeight * pricePerKg;
      this.calculateBothWeight(index);
      this.laundryDetails.at(index).get('LaundryChargeEdit')?.setValue(this.laundryPrice);
    }else{
      this.laundryPrice = weight * pricePerKg;
      this.calculateBothWeight(index);
      this.laundryDetails.at(index).get('LaundryChargeEdit')?.setValue(this.laundryPrice);
    }
  }

  calculateBothWeight(index: any){
    const BothWeightTotal = (this.laundryPrice || 0) + (this.servicePrice || 0);
    this.laundryDetails.at(index).get('Price')?.setValue(BothWeightTotal);
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalPrice = this.laundryDetails.controls.reduce((acc, control) => {
      const price = control.get('Price')?.value || 0;
      return acc + price;
    }, 0);
    localStorage.setItem('totalPrice', this.totalPrice);
  }

  isZeroOrNullWeight(): boolean {
    return this.laundryDetailsForm.value.laundryDetails.some((ld: { WeightEdit: any; }) => ld.WeightEdit <= 0 || ld.WeightEdit == null);
  }

  zeroerra(){
    this.zero = this.laundryDetailsForm.value.laundryDetails.some((ld: { Weight: any; }) => ld.Weight <= 0 || ld.Weight == null);
    console.log(this.zero)
  }

  getTotalAmountWeight(totprice: any){
    this.totallyPrice = totprice;
    console.log(totprice);
  }

  submitLaundryDetails() {
    this.load = true;
    const laundryData = this.laundryDetailsForm.value;
    console.log(laundryData)
    console.log('Form Data:', laundryData);

    if (this.laundryDetailsForm.invalid) {
      this.laundryDetailsForm.markAllAsTouched();
      return;
    }

    this.staffservice.saveLaundryDetails(laundryData).subscribe(
      (response) => {
        console.log('Save Response:', response);
        this.success = "success";
        if(response){
          if(this.isEditing == false){
            Swal.fire({
              position: "top",
              icon: "success",
              title: "Weight has been added successfully",
              showConfirmButton: false,
              timer: 2000
            });
            // this.laundryDetailsForm = '';
            this.load = false;
            this.ngOnInit();
            this.isEditingWeight = false;
            this.createLaundryDetail(laundryData);
          }else{
            Swal.fire({
              position: "top",
              icon: "success",
              title: "Weight has been updated successfully",
              showConfirmButton: false,
              timer: 2000
            });
            this.load = false;
            this.ngOnInit();
            this.isEditingWeight = false;
            this.createLaundryDetail(laundryData);
          }
        }else{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            showConfirmButton: false,
            timer: 2000
          });
          this.load = false;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  notComplete(){
    if(this.showWarning === false){
       this.showWarning = true;
    }else{
      this.showWarning = false
    }
  }

    submit(custId: any){
      if (this.modal) {
        $(this.modal.nativeElement).modal('show');
      } else {
        console.error('Modal is not initialized');
      }
    }

    submitting(total: any, custPay: any){
      this.load = true;
      console.log(total);
      console.log(custPay);
      this.totalCharge = total;

      if(custPay >= total){
        this.amount = total;

        this.showChange = true;
      }else{
        this.amount = 0;
      }
      console.log(this.amount);

      const transId = localStorage.getItem('transId');
      this.subId.value.Admin_ID = localStorage.getItem('staffID');
      const staffID = localStorage.getItem('staffID');
      console.log(this.customerPayment);

      this.staffservice.submitLaundryTrans(this.amount, staffID, transId).subscribe (
        (response) =>{
          console.log('successfully', response)
          if (this.modal) {
            $(this.modal.nativeElement).modal('hide');
          }
          console.log('Status updated successfully', response);
          Swal.fire({
            position: "top",
            icon: "success",
            title: "Transaction has been added successfully with ",
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            setTimeout(() => {
              this.route.navigate(['./mainpage/home/homemain/homepage']);
            }, 100);
          });
          this.load = false;
        }
      )
    }


    zeroerraService(){
      this.zero = this.updatelaundryform.value.services.some((sd: { AddService_price: any; }) => sd.AddService_price <= 0 || sd.AddService_price == null);
      console.log(this.zero)
    }

    isZeroOrNullPrice(){
      return this.updatelaundryform.value.services.some((ld: { AddService_price: any; }) => ld.AddService_price <= 0 || ld.AddService_price == null);
    }

    calculateTotalServ() {
      const total = this.services.controls.reduce((sum, group) => {
        const price = group.get('AddService_price')?.value || 0;
        return sum + price;
      }, 0);

      console.log(total);

      this.updatelaundryform.patchValue({
        totalPrice: total
      });
    }

    getTotalAmountServices(totprice: any){
      this.totallyPrice = totprice;
      console.log(totprice);
    }

    onSubmitServices() {
      this.load = true;
      console.log(this.updatelaundryform.value);
      const serviceData = this.updatelaundryform.value;
      console.log(serviceData)
      console.log('Form Data:', serviceData);

      this.staffservice.saveServiceData(serviceData).subscribe(
        (response) => {
          console.log('Save Response:', response);
          if(response){
            if(this.isEditing === false){
              Swal.fire({
                position: "top",
                icon: "success",
                title: "Service Price has been added successfully",
                showConfirmButton: false,
                timer: 2000
              });
              this.load = false;
              // this.dispAddService();
              this.ngOnInit();
              this.serviceDet(serviceData);
              this.isEditingService = false;
            }else{
              Swal.fire({
                position: "top",
                icon: "success",
                title: "Service Price has been updated successfully",
                showConfirmButton: false,
                timer: 2000
              });
              this.load = false;
              this.ngOnInit();
              this.isEditingService = false;
              this.serviceDet(serviceData);
              // this.dispAddService();
            }
          }else{
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              showConfirmButton: false,
              timer: 1000
            });
            this.load = false;
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }


    showInputPayment(transactionId: any): void {
      console.log('Transaction ID:', transactionId); // Optional: Log the transaction ID
      this.showPaymentForm = true;
    }

    // Function to hide the form and show .askPay again
    cancelPaymentForm(): void {
      this.showPaymentForm = false;
      // this.customerPayment = null; // Optionally reset the payment input
      console.log(this.customerPayment);
    }

    // Handle form submission
    submitPayment(transId: any): void {
      if (this.customerPayment && this.customerPayment > 0) {
        console.log('Payment Submitted:', this.customerPayment);
      } else {
        console.error('Invalid Payment Amount');
      }
    }


    togglePASS(){
      const transId = localStorage.getItem('transId');
      this.subId.value.Admin_ID = localStorage.getItem('staffID');
      const staffID = localStorage.getItem('staffID');
      this.staffservice.submitLaundryTrans(this.amount, staffID, transId).subscribe (
        (response) =>{
          console.log('successfully', response)
        }
      )
    }



  back(value: any){

    this.staffservice.cancelTransactionLaundry().subscribe (
      (response) =>{ 
        console.log('successfully', response);
      }
    )
    this.route.navigate(['./mainpage/home/homemain/homepage']);

  }
}
