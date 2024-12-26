import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, MinValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ServeService } from '../serve.service';
import Swal from 'sweetalert2';
import { LoaderComponent } from '../loader/loader.component';


@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RouterOutlet, RouterLink, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './staff-login.component.html',
  styleUrl: './staff-login.component.css'
})
export class StaffLoginComponent implements OnInit {
  isLoading: boolean = false;
  load: boolean = false;
  emailWrong: boolean = false;
  passWrong: boolean = false;

  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  constructor(
    private route: Router,
    private staffservice: ServeService
  ){}
  ngOnInit(): void {
    this.simulateLoading();

    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      if (this.emailWrong) {
        this.emailWrong = false; // Reset variable when value changes
      }
    });
  }

  token: any;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(7)]),
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  emailTouched(){
    this.emailWrong = false;
  }

  passTouched(){
    this.passWrong = false;
  }

  login(){
    this.load = true;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    console.log(this.loginForm.value.password);
    if(this.email !== undefined && this.password !== undefined)
      {
        this.staffservice.logins(email, password).subscribe(
          response => {
            this.staffservice.setToken(response.token);
            this.staffservice.setStaffID(response.user.Admin_ID);
            console.log('Login successful:', response);
            this.load = false;
            this.route.navigate(['./mainpage']);
            Swal.fire({
              icon: 'success',
              title: 'Login Successful!',
              text: 'You are now logged in.',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          },
          error => {
            console.error('Login failed:', error);
            Swal.fire({
              icon: 'error',
              title: 'Login Failed!',
              text: 'Please check your Email and Password.',
              timer: 2000,
              showConfirmButton: true,
            });
            this.load = false;
            this.emailWrong = true;
            this.passWrong = true;
          }
        );
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Login Failed!',
        text: 'Please input your required data.',
        timer: 2000,
        showConfirmButton: true,
      });
      this.emailWrong = true;
      this.passWrong = true;
    }
    
  }
}
