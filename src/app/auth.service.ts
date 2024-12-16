import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private share: ShareService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let staffDetailsRaw: any = this.share.get_staff();
  
   let staffDetails  = JSON.parse(staffDetailsRaw);
   console.log('staffDetails', staffDetails);
    let status = true;
    if (staffDetails) {
      this.share.checkLogin();
      status = false;
    } 
    return status;
  }
}
