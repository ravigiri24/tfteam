import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-view-approvals',
  templateUrl: './view-approvals.component.html',
  styleUrls: ['./view-approvals.component.scss'],
})
export class ViewApprovalsComponent  implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    public share: ShareService,
    private api: ApiService
  ) { }
  listColorClass: any = 'firstColor';
  dismiss() {
    this.modalCtrl.dismiss();
  }
  staffDetails: any
  selectedType: any = 'PENDING'
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.getingApprovalList()
  }
approval_id:any
  approvalList: any = []
  selectedStore: any
  getingApprovalList() {

    let obj: any = this.share.getStaffObj()
    obj.requestBy = this.staffDetails?.id

    obj.approval_id = this.approval_id
    this.approvalList = []
    this.share.showLoading("Getting Data...")
    this.api.postapi('getApporvalDetailByID', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();
      this.approvalList = [res?.data]

    });




  }
  optionActionEventCall() {

  }

}
