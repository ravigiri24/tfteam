import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddTransportStatusComponent } from 'src/app/transport-management/add-transport-status/add-transport-status.component';
@Component({
  selector: 'app-tractor-dashboard',
  templateUrl: './tractor-dashboard.component.html',
  styleUrls: ['./tractor-dashboard.component.scss'],
})
export class TractorDashboardComponent  implements OnInit {

  tractorDetails: any;
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private route:Router,
    private activatedRoute:ActivatedRoute
  ) {}

  ngOnInit() {


  }
  tractor_id:any
  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.tractor_id = params?.id;
    });
    this.getTractorDetails()
  }
  dismiss() {
    return this.modalCtrl.dismiss(null, 'Cancel');
  }
  staffDetails:any
  getTractorDetails(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id: this.tractor_id,
    };
    this.share.showLoading(msg);
    this.api.postapi('getTractorById', obj).subscribe(
      (res: any) => {
        this.tractorDetails = res?.data;
      
        this.share.spinner.dismiss();
     
      },
      (error: any) => {}
    );
  }
  addCost() {
    this.route.navigate(['/operational/add-cost', this.tractorDetails?.id]);
  }
  addStatusTransport() {
    this.showModal(this.tractorDetails?.id);
  }
    async showModal(tractor_id: any = null) {
      const modal = await this.modalCtrl.create({
        component: AddTransportStatusComponent,
        componentProps: {
          tractor_id: tractor_id,
        },
      });
      await modal.present();
      // const { data, role } = await modal.onWillDismiss();
      // console.log('role', role);
  
      // if (role === 'confirm') {
  
      // }
    }

}
