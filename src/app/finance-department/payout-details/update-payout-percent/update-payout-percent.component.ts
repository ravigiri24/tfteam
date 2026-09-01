import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-update-payout-percent',
  templateUrl: './update-payout-percent.component.html',
  styleUrls: ['./update-payout-percent.component.scss'],
})
export class UpdatePayoutPercentComponent  implements OnInit {
  showFilter = true;
  @Input() listColorClass: any = 'sixColor';
  constructor(
    private modalcontrol: ModalController,
    private share: ShareService,
    private api: ApiService
  ) { }
  percent_0f_payout: any;
  ngOnInit() { }
  tractor: any;

  updateTractor() {
    //  this.modalcontrol.dismiss(true);
    if (this.percent_0f_payout != null && this.percent_0f_payout != undefined) {
      let objData: any = {
        percent_0f_payout: this.percent_0f_payout,
      
      };
      let obj = {
        src: 'bank',
        data: objData,
        id: this.tractor?.id,
      };

      this.share.showLoading('Updating Data...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {


        this.share.presentToast('Updated Successfully...');
        this.share.spinner.dismiss();
        this.modalcontrol.dismiss(res?.rowData);

        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Enter Reason');
    }
  }

}
