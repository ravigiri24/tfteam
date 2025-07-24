import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-transfer-to-new-arrivals',
  templateUrl: './transfer-to-new-arrivals.component.html',
  styleUrls: ['./transfer-to-new-arrivals.component.scss'],
})
export class TransferToNewArrivalsComponent  implements OnInit {
  showFilter = true;
  constructor(
    private modalcontrol: ModalController,
    private share: ShareService,
    private api: ApiService
  ) {}
  deletedReason: any;
  ngOnInit() {}
  tractor: any;

  transferTo() {
    //  this.modalcontrol.dismiss(true);

      let objData: any = {
  tractor_status:'NEW_ARRIVAL'
      };
      let obj = {
        src: 'tractor',
        data: objData,
        id: this.tractor?.id,
      };

      this.share.showLoading('Transfering Data...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {


        this.share.presentToast('Transfer Successfully...');
                this.share.spinner.dismiss();
        this.modalcontrol.dismiss(true);

        //  this.dismiss();
      });
 
  }
}
