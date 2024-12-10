import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-arrivals-management',
  templateUrl: './new-arrivals-management.component.html',
  styleUrls: ['./new-arrivals-management.component.scss'],
})
export class NewArrivalsManagementComponent  implements OnInit {

  constructor(private share:ShareService,private api:ApiService,private route:Router) { }

  ngOnInit() {}
  ionViewWillEnter() {
    this.newArivalsList = [];
    this.getTractorList()
  }
  newArivalsList:any=[]
  backupList:any=[]
  userDetails:any
  staffDetails:any
  goToNewArival(data:any=null){
this.route.navigate(['/operational/add-new-arrivals'])
  }
  getTractorList() {

    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
 
    let obj={
      operate:this.staffDetails?.staffCode,
      isLive:false
    }
    this.share.showLoading('Loading...')
    this.api.postapi('getTractorList', obj).subscribe(
      (res:any) => {
     
        this.newArivalsList = res.data;
        this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
      
        this.share.spinner.dismiss()
        this.backupList = res.data;
      },
      (error:any) => {
  
      }
    );
  }
  refreshList(){
this.getTractorList()
  }
  dataClear(){

  }
}
