import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-tf-code-back-dated',
  templateUrl: './tf-code-back-dated.component.html',
  styleUrls: ['./tf-code-back-dated.component.scss'],
})
export class TfCodeBackDatedComponent  implements OnInit {
  showFilter = true;
  constructor(
    private modalcontrol: ModalController,
    private share: ShareService,
    private api: ApiService
  ) {}
  registractionNo: any;
  ngOnInit() {
  this.registractionNo=  this.tractor?.registractionNo
  }
  tractor: any;

  deleteTractor() {
    //  this.modalcontrol.dismiss(true);
    if (this.registractionNo != null && this.registractionNo != undefined) {
      let objData: any = {
        registractionNo: this.registractionNo,
        
      };
      let obj = {
        src: 'tractor',
        data: objData,
        id: this.tractor?.id,
      };

      this.share.showLoading('Updating TF Code...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {


        this.share.presentToast('Updated Successfully...');
                this.share.spinner.dismiss();
        this.modalcontrol.dismiss(true);

        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Enter Reason');
    }
  }
}
