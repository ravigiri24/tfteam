import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-digital-analyse',
  templateUrl: './digital-analyse.component.html',
  styleUrls: ['./digital-analyse.component.scss'],
})
export class DigitalAnalyseComponent  implements OnInit {

  constructor(private modalCntrl:ModalController,private share:ShareService,private api:ApiService) { }
  staff_role:any
  ngOnInit() {
    let user=this.share.get_staff()
    if(user){
      let userde=JSON.parse(user)
    this.staff_role=  userde?.staff_role

    }else{
      this.share.checkLogin()
    }
  }
  ionViewWillEnter() {
    let user=this.share.get_staff()
    if(user){
      let userde=JSON.parse(user)
    this.staff_role=  userde?.staff_role
this.getLeads()
    }else{
      this.share.checkLogin()
    }
  }
  staffDetails:any
  counts:any={}
  getLeads(){
    let staffDetails: any = this.share.get_staff();
   
    this.staffDetails = JSON.parse(staffDetails);

        this.share.showLoading('Loading...');
        let obj: any = this.share.getListObj('leads', false, [], true);
        obj.storeId = this.staffDetails?.storeId;
 
        setTimeout(() => {
          this.api.postapi('getLeads', obj).subscribe(
            (res: any) => {
          this.counts=res?.data
              this.share.spinner?.dismiss();
          
           
            },
            (error: any) => {}
          );
        }, 0);
  }

}
