import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-select-repair-center',
  templateUrl: './select-repair-center.component.html',
  styleUrls: ['./select-repair-center.component.scss'],
})
export class SelectRepairCenterComponent  implements OnInit {
  constructor(private modalcontrol:ModalController,private share:ShareService) { }
selectedRepairCenter:any
staffDetails:any
repairing_center:any=[]
  ngOnInit() {
  
       let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    if(this.staffDetails!=null){
      this.selectedRepairCenter=this.staffDetails?.repair_center
    }
    

  }
  selectFilter(){
    let center=this.repairing_center.find((f:any)=>f.id==this.selectedRepairCenter)
    this.modalcontrol.dismiss({selectedRepair_center:center,isCenterChange:true})
  }
  
}
