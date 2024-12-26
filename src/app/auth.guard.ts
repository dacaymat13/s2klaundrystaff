import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { ServeService } from './serve.service';

@Injectable({
  providedIn: 'root'
})


export class authGuard implements CanActivate {
  constructor(
    private ServeService: ServeService,
    private route: Router
  ){}

  canActivate(): boolean {
      if (this.ServeService.isAuthenticated()) {
        return true;
      }else {
        this.route.navigate(['/login']);
        return true;
      }
  }
}
