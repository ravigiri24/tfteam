import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-change-repair-type',
  templateUrl: './change-repair-type.component.html',
  styleUrls: ['./change-repair-type.component.scss'],
})
export class ChangeRepairTypeComponent  implements OnInit {


  showFilter = true;
  constructor(private modalcontrol: ModalController,private share:ShareService,private api:ApiService) {}
repair_type:any='REFURBISH'
  ngOnInit() {
  
    this.repair_type=this.job?.repair_type
  }
  job:any
  
    updateType() {
      if(this.repair_type!=null && this.repair_type!=undefined){
    let objData: any = {
      repair_type: this.repair_type
    };
    let obj = {
      src: 'repairing_record',
      data: objData,
      id: this.job?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();
  
      this.share.presentToast('Updated Successfully...');
      this.modalcontrol.dismiss(true)
     
      //  this.dismiss();
    });
  }
    else{
  this.share.presentToast('Please Select');
    }
  }
 
}
