import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-add-lead-staff',
  templateUrl: './add-lead-staff.component.html',
  styleUrls: ['./add-lead-staff.component.scss'],
})
export class AddLeadStaffComponent implements OnInit {
  showFilter = true;
  name: any;
  constructor(
    private modalcontrol: ModalController,
    private share: ShareService,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}
  isNoc: any = true;

  staffDetails: any;
  editedData: any = null;
  ngOnInit() {
    let getStaffDetail: any = this.share.get_staff();
    this.staffDetails = JSON.parse(getStaffDetail);
    this.getWareHouseList();
    this.initialize(this.editedData);
  }
  dismiss() {
    this.modalcontrol.dismiss();
  }
  form: FormGroup;
  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      name: new FormControl(data?.name || null, [Validators.required]),
      actionByid: new FormControl(this.staffDetails?.id || null, [
        Validators.required,
      ]),
      contact1: new FormControl(data?.contact1 || null, []),

      userId: new FormControl(data?.userId || null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),

      address1: new FormControl(data?.address1, [Validators.required]),
      storeId: new FormControl(data?.storeId, [Validators.required]),
      staff_role: new FormControl('LEAD_MANAGEMENT', [Validators.required]),

      staffType: new FormControl('STAFF'),
    });
    if(this.editedData){
      this.form.controls['password'].clearValidators()
      this.form.updateValueAndValidity()
    }
  }
  warehouseList: any = [];
  getWareHouseList() {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);

    this.share.showLoading('Loading...');

    let obj: any = this.share.getListObj('warehouselocation', false, [], true);
    obj.storeId = this.staffDetails?.storeId;

    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.warehouseList = res?.data;
          this.warehouseList = this.warehouseList.reverse();
          this.share.spinner.dismiss();
        },
        (error: any) => {}
      );
    }, 0);
  }
  checkingUserId() {
    if (this.form.valid) {
      let objVal: any = this.share.getListObj('getUserID', false, [], true);
      objVal.userId = this.form.value.userId?.trim();
      this.share.showLoading('Checking User ID');
      this.api.postapi('checkingUserId', objVal).subscribe((res: any) => {
        if (!res?.status) {
          this.share.spinner.dismiss();
          this.share.presentToast(res?.msg);
        } else {
          this.addStaff();
        }

        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Fill All Required Field(*)');
    }
  }

  addStaff() {
    if (this.form.valid) {
      let objVal: any = this.form.value;
      objVal.userId = objVal?.userId?.trim();
      objVal.password = objVal?.password.trim();
      let rand = Math.floor(10000 + Math.random() * 90000);
      let uniqueNum = Date.now();
      let name = this.form.value.name;
      objVal.staffCode = rand + name + uniqueNum + '@tractorFactory.in';
      let obj = {
        src: 'staffdetails',
        data: objVal,
      };

      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();

        this.share.presentToast('Added Successfully...');
        this.modalcontrol.dismiss(true);

        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Fill All Required Field(*)');
    }
  }
  checkingUserIdOnUpdate() {
    if (this.form.valid) {
      let objVal: any = this.share.getListObj('getUserID', false, [], true);
      objVal.userId = this.form.value.userId?.trim();
      objVal.id = this.editedData?.id;
      this.share.showLoading('Checking User ID');
      this.api.postapi('checkingUserIdOnUpdate', objVal).subscribe((res: any) => {
        if (!res?.status) {
          this.share.spinner.dismiss();
          this.share.presentToast(res?.msg);
        } else {
          this.updateStaff();
        }

        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Fill All Required Field(*)');
    }
  }
  updateStaff() {
    if (this.form.valid) {
      let objVal: any = this.form.value;
      objVal.userId = objVal?.userId?.trim();
      if(objVal.password!=null ||  objVal.password!=undefined){
      objVal.password = objVal?.password.trim();
      }else{
        delete  objVal.password 
      }

      let obj = {
        src: 'staffdetails',
        data: objVal,
        id: this.editedData?.id,
      };
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        this.share.presentToast('Updated Successfully...');
        this.modalcontrol.dismiss(true);
      });
    } else {
      this.share.presentToast('Please Fill All Required Field(*)');
    }
  }
}
