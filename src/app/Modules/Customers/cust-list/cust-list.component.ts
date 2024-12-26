import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ServeService } from '../../../serve.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cust-list',
  standalone: true,
  imports: [ MatTableModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cust-list.component.html',
  styleUrl: './cust-list.component.css'
})
export class CustListComponent {
  constructor(
    private route: Router,
    private staffservice: ServeService
  ){}

  selectedValue: any;
  value: any = '';
  dataSource: any;
  customer: any;
  custID: any;

  displayedColumns: string[] = ['Customer ID', 'Customer Name', 'Customer PhoneNo', 'Customer Address', 'Customer Email'];


  ngOnInit() {
    this.getCustomer();
  }
  applyFilter(filterval: any) {
    this.value = filterval.trim().toLowerCase();
    this.dataSource.filter = this.value;
  }

  getCustomer(): void {
    this.staffservice.getCustomer().subscribe(
      (response) => {
          this.customer = response;
          this.dataSource = new MatTableDataSource(this.customer);
      },
      (error) => {
          console.error('Error fetching user data', error);
      }
    );
  }

  clear(): void{
    this.value = '';
    this.dataSource.filter = '';
  }

  clickData(row:any){
  
    localStorage.setItem("custId", row);

      this.staffservice.getCustTransacHistory(row).subscribe((result) => {
        this.customer = result;
        this.route.navigate(['./mainpage/customers/custpage/custhistory']);
    });
  }



}
