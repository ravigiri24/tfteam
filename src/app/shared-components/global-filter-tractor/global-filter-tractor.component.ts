import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-global-filter-tractor',
  templateUrl: './global-filter-tractor.component.html',
  styleUrls: ['./global-filter-tractor.component.scss'],
})
export class GlobalFilterTractorComponent implements OnInit {
  filterBy = 'ALL';
  listBy = 'ACTIVE';
  showStoreWiseOptions = true;
  showDate = false;
  className: 'active_one';
  filterByTitle = 'Filter By';
  listColorClass: any = 'firstColor';
  optionsArray = [
    { displayName: 'All', value: 'ALL' },
    { displayName: 'Mapped', value: 'MAPPED' },
    { displayName: 'Not Mapped', value: 'NOT_MAPPED' },
    { displayName: 'Not Sold', value: 'NOT_SOLD' },
    { displayName: 'Sold', value: 'SOLD' },
  ];
  showFilter = true;

  constructor(
    private modalcontrol: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}
  lower = 0;
  upper = 1500000;
  ngOnInit() {
    console.log('optionsArray', this.optionsArray);
    this.rangeValue.lower = this.lower;
    this.rangeValue.upper = this.upper;
    this.initialize();
    this.setBrandList()
    //  this.getBrandList();
  }
  setBrandList() {
    this.brandList.forEach((ele: any) => {
      ele.checked = true;
    });
    if (!this.checkedAll) {
      this.brandList.forEach((ele: any) => {
        let findInSelected = this.selectedBrand.filter(
          (sBrand: any) => sBrand.id == ele.id
        );
        if (!findInSelected?.length) {
          ele.checked = false;
        }
      });
    }
  }
  brandList: any = [];
  selectedBrand: any = [];
  staffDetails: any;
  getBrandList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    //if(loader){
    this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('brand', false, [], true);
    obj.storeId = this.staffDetails?.storeId;

    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.brandList = res?.data;
          this.brandList = this.brandList.reverse();
          this.brandList.forEach((ele: any) => {
            ele.checked = true;
          });
          if (!this.checkedAll) {
            this.brandList.forEach((ele: any) => {
              let findInSelected = this.selectedBrand.filter(
                (sBrand: any) => sBrand.id == ele.id
              );
              if (!findInSelected?.length) {
                ele.checked = false;
              }
            });
          }
          this.share.spinner.dismiss(this.className);
        },
        (error: any) => {}
      );
    }, 0);
  }

  selectBrand(e: any, brand: any) {
    let checkStatus = e?.detail?.checked;
    if (brand == 'ALL') {
      this.checkedAll = checkStatus;
      this.brandList.forEach((f: any) => {
        f.checked = checkStatus;
      });
    } else {
      brand.checked = checkStatus;
    }
    this.checkAllStatus();
  }
  showRange = true;
  reset() {
    this.checkedAll = true;
    this.brandList?.forEach((brand: any) => {
      brand.checked = true;
    });
    this.selectedBrand = this.brandList;
    this.lower = 0;
    this.upper = 1500000;
    this.rangeValue.lower = 0;
    this.rangeValue.upper = 1500000;
    this.yearChecked = 'ALL';
    this.wheeldrive = 'ALL';
    this.listBy = 'ACTIVE';
    this.filterBy = 'NOT_SOLD';
    this.showRange = false;
    setTimeout(() => {
      this.showRange = true;
    }, 0);
  }
  applyFilter() {
    this.selectedBrand = this.brandList.filter((f: any) => f.checked == true);
    this.modalcontrol.dismiss({
      selectedBrand: this.selectedBrand,
      checkedAll: this.checkedAll,
      lower: this.rangeValue.lower,
      upper: this.rangeValue.upper,
      yearChecked: this.yearChecked,
      wheeldrive: this.wheeldrive,
      listBy: this.listBy,
      filterBy: this.filterBy,
    });
  }
  checkAllStatus() {
    let checkStatusFalse = this.brandList.filter(
      (f: any) => f.checked == false
    );
    if (checkStatusFalse?.length > 0) {
      this.checkedAll = false;
    } else {
      this.checkedAll = true;
    }
  }
  checkedAll = true;
  form: FormGroup;
  startDate: any = null;
  endDate: any = null;
  initialize() {
    this.form = this.formBuilder.group({
      startDate: new FormControl(this.startDate || null, [Validators.required]),
      endDate: new FormControl(this.endDate || null, [Validators.required]),
    });
    console.log('this.dateForm', this.form.value);
  }
  rangeValue = { lower: 0, upper: 1500000 };
  yearChecked = 'ALL';
  wheeldrive = 'ALL';
  rangeChange(event: any) {
    this.rangeValue = event.detail.value;
    console.log('Range changed:', this.rangeValue);
  }
  selectItem(e: any) {
    console.log('selectItem', e);
    this.yearChecked = e?.detail?.value;
  }
    selectWheel(e: any) {
    console.log('selectItem', e);
    this.wheeldrive = e?.detail?.value;
  }
  dismiss() {
    this.modalcontrol.dismiss();
  }
  selectFilter() {
    // this.modalcontrol.dismiss({
    //   filterBy: this.filterBy,
    //   isFilterChange: true,
    // });
  }
  selectList() {
    // if (this.listBy != 'BY_DATE') {
    //   this.modalcontrol.dismiss({ listBy: this.listBy, isListChange: true });
    // }
  }
  setDate() {
    if (this.form.valid) {
      if (
        this.form.controls['startDate']?.value <=
        this.form.controls['endDate']?.value
      ) {
        this.modalcontrol.dismiss({
          listBy: this.listBy,
          isListChange: true,
          startDate: this.form.controls['startDate']?.value,
          endDate: this.form.controls['endDate']?.value,
        });
      } else {
        this.share.presentToast('Error:End Date is less than Start Date');
      }
    } else {
      this.share.presentToast('Error:Please Fill Required(*) Fields');
    }
  }
}
