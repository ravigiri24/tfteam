import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-add-district',
  templateUrl: './add-district.component.html',
  styleUrls: ['./add-district.component.scss'],
})
export class AddDistrictComponent implements OnInit {
  showFilter = true;
  name: any;
  constructor(
    private modalcontrol: ModalController,
    private share: ShareService,
    private api: ApiService
  ) { }
  isNoc: any = true;
  @Input() listColorClass: any = "firstColor";
  staffDetails: any
  ngOnInit() {
    let getStaffDetail: any = this.share.get_staff();
    this.staffDetails = JSON.parse(getStaffDetail);

    if (this.district?.name) {
      this.name = this.district?.name;
    }
  }
  checkDistrictName() {
    if (this.name != null && this.name != undefined) {
      let objData: any = {
        name: this.name?.trim(),
        state_id: this.state_id,
      };


      this.share.showLoading('Checking District Name...');
      this.api.postapi('checkingDistrictName', objData).subscribe((res: any) => {

        if (res?.status == false) {
          this.share.spinner.dismiss();
          this.share.presentToast(res?.msg);
        } else if (res?.status == true) {

          this.addDistrict()
        }



        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Enter District Name');
    }
  }
  state_id: any;
  stateName: any;
  district: any;
  addDistrict() {
    if (this.name != null && this.name != undefined) {
      let objData: any = {
        name: this.name?.trim(),
        state_id: this.state_id,
        actionByid: this.staffDetails?.id
      };
      let obj = {
        src: 'district_list',
        data: objData,
      };
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();

        this.share.presentToast('Added Successfully...');
        this.modalcontrol.dismiss({ rowData: res?.rowData });

        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Enter District Name');
    }
  }
  checkDistrictNameOnUpdate() {
    if (this.name != null && this.name != undefined) {
      let objData: any = {
        name: this.name?.trim(),
        state_id: this.state_id,
        id: this.district?.id
      };


      this.share.showLoading('Checking District Name...');
      this.api.postapi('checkingDistrictNameOnUpdate', objData).subscribe((res: any) => {

        if (res?.status == false) {
          this.share.spinner.dismiss();
          this.share.presentToast(res?.msg);
        } else if (res?.status == true) {

          this.updateDistrict()
        }



        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Enter District Name');
    }
  }
  updateDistrict() {
    if (this.name != null && this.name != undefined) {
      let objData: any = {
        name: this.name?.trim(),
        state_id: this.state_id,
        actionByid: this.staffDetails?.id
      };
      let obj = {
        src: 'district_list',
        data: objData,
        id: this.district?.id
      };
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();

        this.share.presentToast('Updated Successfully...');
        this.modalcontrol.dismiss({ rowData: res?.rowData });

        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Enter District Name');
    }
  }
}
