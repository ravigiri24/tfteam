import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-noc-update',
  templateUrl: './noc-update.component.html',
  styleUrls: ['./noc-update.component.scss'],
})
export class NocUpdateComponent  implements OnInit {


  showFilter = true;
  constructor(private modalcontrol: ModalController,private share:ShareService,private api:ApiService) {}
isNoc:any=true
  ngOnInit() {
  
    
  }
  tractor:any
  
    updateNoc() {
      if(this.isNoc!=null && this.isNoc!=undefined){
    let objData: any = {
      isNoc: this.isNoc
    };
    let obj = {
      src: 'tractor',
      data: objData,
      id: this.tractor?.id,
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
