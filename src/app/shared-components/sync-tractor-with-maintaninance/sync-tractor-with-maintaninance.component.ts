import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-sync-tractor-with-maintaninance',
  templateUrl: './sync-tractor-with-maintaninance.component.html',
  styleUrls: ['./sync-tractor-with-maintaninance.component.scss'],
})
export class SyncTractorWithMaintaninanceComponent  implements OnInit {

  constructor(
    private modalController: ModalController,
    private api: ApiService,
    private share: ShareService
  ) {}

  ngOnInit() {
    this.getJobList()
  }
  dismiss() {
    this.modalController.dismiss();
  }
  staffDetails: any;
  jobType=false
  jobList:any=[]
  getJobList() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
     
    };
    this.share.showLoading('Loading');
    this.api.postapi('allJobList', obj).subscribe(
      (res: any) => {
        res.data?.forEach((f:any)=>{
          this.jobList.push(f)
        })
   

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  addJob(){
    
  }
}
