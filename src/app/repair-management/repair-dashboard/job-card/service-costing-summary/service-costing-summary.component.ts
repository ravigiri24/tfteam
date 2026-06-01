import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { AlertController, ModalController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-service-costing-summary',
  templateUrl: './service-costing-summary.component.html',
  styleUrls: ['./service-costing-summary.component.scss'],
})
export class ServiceCostingSummaryComponent implements OnInit {
  constructor(
    private router: Router,
    public share: ShareService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) {}
  dismiss() {
    this.modalCtrl.dismiss();
  }
  @Input() listColorClass = 'secondColor';
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);

    this.initialize(this.jobDetails);
  }
  repairdata: any;
  staffDetails: any;
  form: FormGroup;
  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      totalBillService: new FormControl(data?.totalBillService, []),
      ProfitService: new FormControl(data?.ProfitService, []),
      DiscountService: new FormControl(data?.DiscountService, []),
      NetPayService: new FormControl(data?.NetPayService, []),
      actionByid: new FormControl(this?.staffDetails?.id, [
        Validators.required,
      ]),
    });
  }
  jobDetails: any;
  remark: any;
  update() {
    //  this.modalcontrol.dismiss(true);

    let objData: any = this.form.value;
    let obj = {
      src: 'repairing_record',
      data: objData,
      id: this.jobDetails?.id,
    };

    this.share.showLoading('Saving Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.presentToast('Saved Successfully...');
      this.share.spinner.dismiss();
      this.modalCtrl.dismiss({
        totalBillService: objData?.totalBillService,
        ProfitService: objData?.ProfitService,
        DiscountService: objData?.DiscountService,
        NetPayService: objData?.NetPayService,
      });

      //  this.dismiss();
    });
  }
}
