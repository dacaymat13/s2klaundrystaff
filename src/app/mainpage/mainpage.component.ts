import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { ServeService } from '../serve.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [RouterModule, CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent implements OnInit {
  user:any;

  constructor(
    private route: Router,
    private staffservice: ServeService,
    private ar: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.runStaff();
  }


  isOpen: boolean = true;

  toggleNav(): void {
    this.isOpen = !this.isOpen;
  }

  runStaff(){
    this.staffservice.getStaff().subscribe(
      (response: any) => {
          this.user = response;
          console.log(this.user);
      },
      (error) => {
          console.error('Error fetching user data', error);
      }
    );
  }

  logout(){
    this.staffservice.logout();
    this.route.navigate(['./login']);
  }
}
