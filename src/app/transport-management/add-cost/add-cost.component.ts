import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-add-cost',
  templateUrl: './add-cost.component.html',
  styleUrls: ['./add-cost.component.scss'],
})
export class AddCostComponent  implements OnInit {

  constructor(public modalCtrl:ModalController,private formBuilder:FormBuilder,private share:ShareService,private api:ApiService ) { }
  expenseTypeList:any
  form:FormGroup
  data:any
  tarctor_id:any
  ngOnInit() {
    console.log("expenseTypeList",this.expenseTypeList);
    this.initialize(this.data)
    
  }
    
    initialize(data: any = null) {
      this.form = this.formBuilder.group({
        expense_id: new FormControl(data?.expense_id || null, [
          Validators.required,
        ]),
        expense_amount: new FormControl(data?.expense_amount || null, [
          Validators.required,
        ]),
        expense_date: new FormControl(data?.expense_date || null),
        tractor_id: new FormControl(this.tarctor_id || null, [
          Validators.required,
        ]),
      });
      console.log(' this.form', this.form);
  
      // if(data){
      //   this.form.addControl(
      //     'id',
      //     new FormControl(data?.id || null, [Validators.required])
      //   );
      // }
    }
  dismiss() {  
    return this.modalCtrl.dismiss(null,'Cancel'); 
  } 
  updateItem(){
    this.form.controls['tractor_id'].setValue(this.tarctor_id)
    if (this.form.valid) {
      let obj = {
        src: 'transport_cost',
        data: this.form.value,
        id:this.data?.id
      };
this.share.showLoading("Updating...")
      this.api.postapi('updateOpp', obj).subscribe((res:any) => {
this.share.spinner.dismiss()
        this.form.reset();
        return this.modalCtrl.dismiss(null, 'confirm'); 
       // this.getList()

  
      });
    } else {
      this.form.markAllAsTouched();
    
    }
  }
  saveExpense() {
    this.form.controls['tractor_id'].setValue(this.tarctor_id)
    if (this.form.valid) {
      let obj = {
        src: 'transport_cost',
        data: this.form.value,
      };
      this.share.showLoading('Saving');
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Expense Added Successfully');
        this.share.spinner.dismiss();
        this.form.reset();
        return this.modalCtrl.dismiss(null, 'confirm'); 
   
        //this.view='LIST'
      });
    } else {
      this.form.markAllAsTouched();
    }
  } 
  
}
