import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { AlertController, ModalController } from '@ionic/angular';
@Component({
  selector: 'app-remark-miss-popup',
  templateUrl: './remark-miss-popup.component.html',
  styleUrls: ['./remark-miss-popup.component.scss'],
})
export class RemarkMissPopupComponent  implements OnInit {


   constructor(
    private router: Router,
    public share: ShareService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private modalCtrl: ModalController,
    private alertCtrl:AlertController
  ) {}
    dismiss(){
    this.modalCtrl.dismiss()
  }
  ngOnInit() {
    if(this.jobDetails?.remark){
      this.miscellaneous_remark=this.jobDetails?.miscellaneous_remark
    }
  }
  jobDetails:any
  	miscellaneous_remark:any
  deleteTractor() {
    //  this.modalcontrol.dismiss(true);
    if (this.miscellaneous_remark != null && this.miscellaneous_remark != undefined) {
      let objData: any = {
        miscellaneous_remark: this.miscellaneous_remark,
      
      };
      let obj = {
        src: 'repairing_record',
        data: objData,
        id: this.jobDetails?.id,
      };

      this.share.showLoading('Saving Data...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {


        this.share.presentToast('Saved Successfully...');
                this.share.spinner.dismiss();
        this.modalCtrl.dismiss({miscellaneous_remark:this.miscellaneous_remark});

        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Enter Remark');
    }
  }
}
