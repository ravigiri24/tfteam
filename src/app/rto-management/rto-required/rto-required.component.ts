import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-rto-required',
  templateUrl: './rto-required.component.html',
  styleUrls: ['./rto-required.component.scss'],
})
export class RtoRequiredComponent implements OnInit {
  showFilter = true;
  constructor(
    private modalcontrol: ModalController,
    private share: ShareService,
    private api: ApiService,
  ) {}
  nocRequired: any = true;
  ngOnInit() {}
  tractor: any;

  updateNoc() {
    if (this.nocRequired != null && this.nocRequired != undefined) {
      let objData: any = {
        nocRequired: this.nocRequired,
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
        this.modalcontrol.dismiss(true);

        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Select');
    }
  }
}
