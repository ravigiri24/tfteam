import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-footer-admin',
  templateUrl: './footer-admin.component.html',
  styleUrls: ['./footer-admin.component.scss'],
})
export class FooterAdminComponent  implements OnInit {
  constructor(private router:Router,private share:ShareService,private api:ApiService) { }

  ngOnInit() {}
  selectedTab:any='Reports'
  activeTabsColor='firstColor'
  staffDetails:any
  goToPage(tab:any){
       let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
     let obj: any = this.share.getStaffObj();
    obj.staff_id = this.staffDetails?.id;
    if(tab!='Reports'){
    this.api.checkNotification(obj);
    }

  this.selectedTab=tab
  if(tab=='Digital-analyse'){
    this.router.navigate(['/admin-block/digital-analyse'])
  }
  else if(tab=='tractor-costing-list'){
            this.activeTabsColor='secondColor'
    this.router.navigate(['/admin-block/tractor-costing'])
  }
    else if(tab=='Dashboard'){
    this.router.navigate(['/admin-block/dashboard-overview'])
  }
      else if(tab=='Reports'){
        this.activeTabsColor='firstColor'
    this.router.navigate(['/admin-block/reports-tractor'])
  }
  else if(tab=='Maintainance'){
    this.router.navigate(['/operational/maintainance-management'])
  }
  else if(tab=='Live'){
    this.router.navigate(['/operational/all-tractor-management'])
  }
  
  // else if(tab=='Report'){
  //   this.router.navigate(['/digital//report-management'])
  // }
  else if(tab=='User'){
        this.activeTabsColor='thirdColor'
    this.router.navigate(['/admin-block/user-management'])
  }
  
  }

}
