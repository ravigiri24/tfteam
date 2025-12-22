import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-select-list-type',
  templateUrl: './select-list-type.component.html',
  styleUrls: ['./select-list-type.component.scss'],
})
export class SelectListTypeComponent implements OnInit {
  filterBy = 'ALL';
  listBy = 'ALL';
  showStoreWiseOptions = true;
  showDate = false;
  filterByTitle = 'Filter By';
  @Input() listColorClass: any = "firstColor";
  optionsArray = [
    { displayName: 'All', value: 'ALL' },
    { displayName: 'Mapped', value: 'MAPPED' },
    { displayName: 'Not Mapped', value: 'NOT_MAPPED' },
    { displayName: 'Not Sold', value: 'NOT_SOLD' },
    { displayName: 'Sold', value: 'SOLD' },
  ];
  showFilter = true;
  showList = true
  constructor(
    private modalcontrol: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService
  ) { }

  ngOnInit() {
    console.log('optionsArray', this.optionsArray);
    this.initialize();
  }
  form: FormGroup;
  startDate: any = null
  endDate: any = null
  initialize() {
    this.form = this.formBuilder.group({
      startDate: new FormControl(this.startDate || null, [Validators.required]),
      endDate: new FormControl(this.endDate || null, [Validators.required]),
    });
    console.log('this.dateForm', this.form.value);
  }
  selectFilter() {
    this.modalcontrol.dismiss({
      filterBy: this.filterBy,
      isFilterChange: true,
    });
  }
  selectList() {
    if (this.listBy != 'BY_DATE') {
      this.modalcontrol.dismiss({ listBy: this.listBy, isListChange: true });
    }
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
