import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SelectWithSearchComponent } from '../select-with-search/select-with-search.component';
@Component({
  selector: 'app-sync-tractor-with-maintaninance',
  templateUrl: './sync-tractor-with-maintaninance.component.html',
  styleUrls: ['./sync-tractor-with-maintaninance.component.scss'],
})
export class SyncTractorWithMaintaninanceComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private api: ApiService,
    private share: ShareService,
    private alertCtrl:AlertController
  ) {}

  ngOnInit() {

    this.getSavedJobList()
  }
  dismiss() {
    this.modalController.dismiss();
  }
  staffDetails: any;
  jobType = false;
  jobList: any = [];
  tractor: any;
  getSavedJobList(){
    
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id:this.tractor?.id
    };
   this.share.showLoading('Loading');
    this.api.postapi('getJobsByTractor', obj).subscribe(
      (res: any) => {
    this.savedJobList=res?.data
        //this.share.spinner.dismiss();
        this.getJobList();
      },
      (error: any) => {
        this.getJobList();
      }
    );
  }
  async deleteItem(job: any) {
    const alert = await this.alertCtrl.create({
      header: 'Remove Job',
      subHeader: '',
      message: 'Are You Sure',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result?.role == 'Yes') {
      this.removeJob(job);
    }
  }
  removeJob(job:any){
    let objData: any = {
      mappedTractorId:null,
    };
    let obj = {
      src: 'repairing_record',
      data: objData,
      id: job?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Removed Successfully...');
      this.getSavedJobList()
    //  this.dismiss();
    });
  }
  getJobList() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
    };
  //  this.share.showLoading('Loading');
    this.api.postapi('unmappedJobList', obj).subscribe(
      (res: any) => {
        res.data?.forEach((f: any) => {
          f.name = f?.tfCode + '-' + f?.modelDetails?.name;
          this.jobList.push(f);
        });

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  savedJobList: any = [];
  async addJob() {
    console.log(' this.jobList', this.jobList);

    const modal = await this.modalController.create({
      component: SelectWithSearchComponent,
      componentProps: {
        list: this.jobList,
        itemName: 'Job',
        jsonKey: 'name',
        search: {
          tfCode: null,
        },
        showAddButton: false,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
      let checkRepeat = this.savedJobList.find((f: any) => f.id == data?.id);
      if (!checkRepeat) {
        this.addNewJob(data?.id);
      } else {
        this.share.presentToast('This Job Already Added');
      }
    }
  }


  addNewJob(job_id: any) {
  
    let objData: any = {
      mappedTractorId: this.tractor?.id,
    };
    let obj = {
      src: 'repairing_record',
      data: objData,
      id: job_id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Added Successfully...');
      this.getSavedJobList()
      this.getJobList()
      this.dismiss();
    });
  }
}
