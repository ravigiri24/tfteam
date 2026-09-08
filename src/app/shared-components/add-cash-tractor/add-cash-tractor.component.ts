import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-add-cash-tractor',
  templateUrl: './add-cash-tractor.component.html',
  styleUrls: ['./add-cash-tractor.component.scss'],
})
export class AddCashTractorComponent implements OnInit {
  cashForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalControl: ModalController,
    private share:ShareService,
    private api:ApiService
  ) {}

  ngOnInit() {
        let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.initializeCashForm();
  }
  staffDetails:any

  initializeCashForm() {
    this.cashForm = this.formBuilder.group({
      cash_amount: new FormControl(null, [Validators.required, Validators.min(0.01)]),
      received_date: new FormControl(null, [Validators.required]),
      transaction_type: new FormControl('CASH', [Validators.required]),
      tractor_id: new FormControl(this.tractor?.id, [Validators.required]),
      actionByid: new FormControl(this.staffDetails?.id, [Validators.required]),
    });
  }
tractor:any
  save() {
    this.cashForm.markAllAsTouched();
    if (this.cashForm.valid) {
         let objVal =this.cashForm.value
      let obj = {
        src: 'cash_receving',
        data: objVal,
     
      };
      this.share.showLoading('Saving...');
      this.api.postapi('addOpp', obj).subscribe(
        (res: any) => {
         // this.tractorDetails.financeDetailedId = res?.data;
          this.share.spinner.dismiss();

          this.share.presentToast('Saved Succssfully...');
           this.modalControl.dismiss(res?.rowData);
        },
        (error: any) => {},
      );
    }

  }

  dismiss() {
    this.modalControl.dismiss();
  }

}
