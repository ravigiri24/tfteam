import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-delete-new-findings',
  templateUrl: './delete-new-findings.component.html',
  styleUrls: ['./delete-new-findings.component.scss'],
})
export class DeleteNewFindingsComponent  implements OnInit {
 showFilter = true;
  @Input() listColorClass: any = 'sixColor';
  constructor(
    private modalcontrol: ModalController,
    private share: ShareService,
    private api: ApiService
  ) { }
  deletedReason: any;
  ngOnInit() { }
  tractor: any;

  deleteTractor() {
    //  this.modalcontrol.dismiss(true);
    if (this.deletedReason != null && this.deletedReason != undefined) {
      let objData: any = {
        deletedReason: this.deletedReason,
        isDeleted: true
      };
      let obj = {
        src: 'new_findings',
        data: objData,
        id: this.tractor?.id,
      };

      this.share.showLoading('Deleting Data...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {


        this.share.presentToast('Deleted Successfully...');
        this.share.spinner.dismiss();
        this.modalcontrol.dismiss(true);

        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Enter Reason');
    }
  }

}
