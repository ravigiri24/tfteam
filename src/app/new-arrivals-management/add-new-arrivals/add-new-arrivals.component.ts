import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-add-new-arrivals',
  templateUrl: './add-new-arrivals.component.html',
  styleUrls: ['./add-new-arrivals.component.scss'],
})
export class AddNewArrivalsComponent  implements OnInit {

  constructor(private router:Router,private share:ShareService,private api:ApiService) { }

  ngOnInit() {
    this.getModelList()
  }
  ionViewWillEnter() {
    this.getModelList()
  }
  backToNewArrivals(){
    this.router.navigate(['operational/new-arrivals'])
  }
selectedTab='MODEL'
selectTab(tab:any){
this.selectedTab=tab
}
modelList:any=[]
getModelList() {
  this.modelList =[]
  let obj = this.share.getListObj('model', true, ['logo'], false);
  this.api.postapi('getModelDataSanitized', obj).subscribe(
    (res:any) => {
  
      this.modelList = res.data;
    },
    (error:any) => {
    
    }
  );
}
goToPage(tab:any){
  this.selectedTab=tab
  // if(tab=='Customer'){
  //   this.router.navigate(['/digital//customer-management'])
  // }
  // else if(tab=='Follow-Up'){
  //   this.router.navigate(['/digital//follow-up-management'])
  // }
  // else if(tab=='Report'){
  //   this.router.navigate(['/digital//report-management'])
  // }
  // else if(tab=='User'){
  //   this.router.navigate(['/digital//user-management'])
  // }
  
  }
}
