import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-rc-update',
  templateUrl: './rc-update.component.html',
  styleUrls: ['./rc-update.component.scss'],
})
export class RcUpdateComponent  implements OnInit {


  showFilter = true;
  constructor(private modalcontrol: ModalController,private share:ShareService,private api:ApiService) {}
isrtoDone:any
  ngOnInit() {
  
    
  }
  tractor:any
  
    updateRc() {
      if(this.isrtoDone!=null && this.isrtoDone!=undefined){
    let objData: any = {
      isrtoDone: this.isrtoDone
    };
    let obj = {
      src: 'rtotractordetails',
      data: objData,
      id: this.tractor?.rtoDetailsIdDetails?.id,
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
