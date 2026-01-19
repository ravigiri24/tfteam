import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-select-sales-head-clone-staff',
  templateUrl: './select-sales-head-clone-staff.component.html',
  styleUrls: ['./select-sales-head-clone-staff.component.scss'],
})
export class SelectSalesHeadCloneStaffComponent  implements OnInit {
  constructor(private modalcontrol:ModalController,private share:ShareService) { }
selectedstaff:any
staffDetails:any
cloneStaffArray:any=[]
  ngOnInit() {
  
       let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    if(this.staffDetails!=null){
      this.selectedstaff=this.staffDetails?.stateHeadCloneId
    }
    

  }
  selectFilter(){
    let center=this.cloneStaffArray.find((f:any)=>f.id==this.selectedstaff)
    this.modalcontrol.dismiss({selected_clone_staff:center,isStaffChange:true})
  }
  
}
