import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServeService } from '../../../serve.service';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { error } from 'jquery';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exp-list',
  standalone: true,
  imports: [RouterModule, RouterOutlet, FormsModule, ReactiveFormsModule, CommonModule, RouterLinkActive, FormsModule],
  templateUrl: './exp-list.component.html',
  styleUrl: './exp-list.component.css'
})
export class ExpListComponent implements OnInit{
  today: any = '';
  currentDateTime: any = '';
  expId: any;
  expense: any[] = [];
  filteredExpense: any[] = [];
  selectedFile: File| null=null;
  imagePreview: string | ArrayBuffer | null = '';
  intervalId: any;
  expDet: any;
  filteredExpenseOrder: any;
  overallExp: any;
  totalPrice: any;
  totalLabel: boolean = false;


  isEditing: boolean = false;

  apiUrl = 'http://localhost:8000/storage/';
  imageUrl: any;
  isImageAvailable: boolean = false;
  e = { Receipt_filenameimg: 'expReceipts/1729045553_982e5d6cf166ef0dec153442a8d21973.jpg' };


  constructor(
    private staffservice: ServeService,
    private http: HttpClient
  ){
    this.today = '';
    this.currentDateTime = '';
  }

  ngOnInit(): void {
    const date = new Date();
    this.today = date.toISOString().split('T')[0];
    const current = new Date();
    this.currentDateTime = current.toISOString().substring(0, 19);
    this.checkImageAvailability();
    this.displayExp();
  }

  staffId: any;

  addExpenseForm = new FormGroup({
    Admin_ID: new FormControl(),
    Amount: new FormControl(),
    Desc_reason: new FormControl(),
    Expense_ID: new FormControl(),
    Receipt_filenameimg: new FormControl(),
    Datetime_taken: new FormControl(this.today)
  });

  checkImageAvailability(): void {
    const imageUrl = this.apiUrl + this.e?.Receipt_filenameimg;
    console.log(imageUrl);
    
    this.staffservice.checkImageUrl(imageUrl).subscribe(isAvailable => {
      this.isImageAvailable = isAvailable;
      console.log(this.imageUrl);
      if (isAvailable) {
        this.imageUrl = imageUrl; // Set the image URL if it's available
        console.log(this.imageUrl);
      } else {
        this.imageUrl = ''; // Set to empty or show a fallback image URL
      }
    });
  }

  displayExp(){
    const staffId = localStorage.getItem('staffID');
    this.staffservice.getExpenses(staffId).subscribe(
      (response) => {
        this.overallExp = response;
        console.log(this.overallExp)

        if (Array.isArray(response)) {
          this.expense = response;
          console.log(response)

          this.filteredExpenseOrder = this.expense.sort((a, b) => {
            return new Date(b.Datetime_taken).getTime() - new Date(a.Datetime_taken).getTime();  // Sort by 'date' in descending order
          });

          this.filteredExpense = [...this.expense];
          this.totalLabel = false
          this.getTotalPrice();
      } else {
          console.error('API response is not an array', response);
      }
      }
    )
  }

  getTotalPrice() {
    // return this.overallExp.reduce((sum: any, total: { overallPrice: any; }) => sum + total.overallPrice, 0);
    // if (this.overallExp && Array.isArray(this.overallExp)) {
    //   return this.overallExp.reduce((sum: any, total: { overallPrice: any; }) => sum + total.overallPrice, 0);
    // }
    // return 0;
    console.log(this.expense)

    if (this.filteredExpense && Array.isArray(this.filteredExpense)) {
      this.totalPrice =  this.filteredExpense.reduce((sum: any, total: { Amount: any; }) => sum + total.Amount, 0);
    }
    else{
      this.totalPrice = 0;
    }
     
  }

  onFileSelected(event: any) {
    console.log(event)
    const imgfile = event.target.files[0];
    if (imgfile){
      this.selectedFile = imgfile;
      console.log(this.selectedFile);
      this.previewImage();
    }
  }

  previewImage(): void{
    if (this.selectedFile){
      const reader = new FileReader();
      reader.onload = () =>{
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }


  addExpense(){
    console.log(this.addExpenseForm.value);
    this.addExpenseForm.value.Admin_ID = localStorage.getItem('staffID');
    console.log(this.addExpenseForm.value.Admin_ID);
    this.addExpenseForm.value.Datetime_taken = this.currentDateTime;
    this.staffservice.addExpense(this.addExpenseForm.value).subscribe(
      (response) => {
        console.log('Expense added successfully:', response);
        console.log();
        this.expId = response.Expense;
        this.onUpload(this.expId);
        console.log(response);
        this.displayExp();
        this.addExpenseForm.reset();
        this.selectedFile = null;
        this.imagePreview = null;
      },
      (error) => {
        console.error('Error adding staff:', error);
            // Swal.fire(
            //   'Error!',
            //   'There was an issue adding the staff. Please try again.',
            //   'error'
            // );
      }
    );
  }


  onUpload(expId: any){
    if (this.selectedFile){
      console.log(expId)

      this.staffservice.uploadExpImg(expId, this.selectedFile).subscribe(
        (response) => {
          console.log('Receipt Image Upload Successfully:', response);
        },
        (error) => {
          console.log('Error uploading image:', error);
          alert('Error uploading image');
        }
      );
    }else{
      alert('NO file selected.')
    }
  }

  loadExistingImage() {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(){
    clearInterval(this.intervalId);
  }

  getExpReceipt(expId: any){
    this.staffservice.getExpReceipt(expId).subscribe(
      (response) => {
        this.expDet = response[0];
        console.log(this.expDet);
      }
    )
  }


  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.today = input.value ? input.value : null; // Capture the selected date
    console.log(this.today);
    this.filterExpense(); // Call the filter method
  }

  filterExpense(): void{

    if (this.today != null) {
      const selected = new Date(this.today).toISOString().split('T')[0];
      console.log('Selected Date:', selected);
      this.totalLabel = true;

      this.filteredExpense = this.expense.filter(expense => {
        const expenseDate = new Date(expense.Datetime_taken);
        const price = expense.Amount;
        console.log(price);
        const expenseDateString = expenseDate.toISOString().split('T')[0];

        console.log('Expense Date:', expenseDateString);
        const isMatch = expenseDateString === selected;

        console.log('Date Match:', isMatch);
        return isMatch;
      });

      this.getTotalPrice();
    } else {
      this.filteredExpense = [...this.expense];
      this.totalLabel = false;
      this.getTotalPrice();
    }
  }


  updateExpense(data: any){
    this.isEditing = true;
    console.log(data);
    console.log(this.addExpenseForm.value.Receipt_filenameimg)
    if(data.Expense_ID){
      this.addExpenseForm.patchValue({
        Amount: data.Amount,
        Desc_reason: data.Desc_reason,
        Expense_ID: data.Expense_ID
      });
      if (data.selectedFile) {
        this.selectedFile = data.Receipt_filenameimg; // Assuming 'ImageName' is available in the data
      }
      console.log(this.selectedFile)
      this.imagePreview = `http://localhost:8000/storage/${data.Receipt_filenameimg}`;
    }
  }

}