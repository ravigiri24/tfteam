
import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  Output,
  Input,
} from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { initialize, OverlayEventDetail } from '@ionic/core/components';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-add-visitng-status',
  templateUrl: './add-visitng-status.component.html',
  styleUrls: ['./add-visitng-status.component.scss'],
})
export class AddVisitngStatusComponent  implements OnInit {
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.initialize()
  }
    form:FormGroup
    staffDetails:any
    customerSelected:any
    initialize(){
     let staffDetails: any = this.share.get_staff();
    
       this.staffDetails = JSON.parse(staffDetails);
       this.form = this.fb.group({
         actionByid: new FormControl(this.staffDetails?.id, [Validators.required]),
         visitng_type: new FormControl('WILL_VISIT',  [Validators.required]),
         visiting_date: new FormControl(null,  []),
         remark: new FormControl(null,  []),
         customer_id: new FormControl(this.customerSelected?.id,  [Validators.required]),
      
       });
     }
  saveForm(){
    if(this.form?.valid){
     let obj = {
        src: 'visiting_status',
        data: this.form.value,
      };
      this.share.showLoading("Saving")
      this.api.postapi('addOpp', obj).subscribe((res:any) => {
     
        this.share.spinner?.dismiss();
      this.share.presentToast("Status Saved")
      this.modalCtrl.dismiss({isAdd:true})
    
      });
    }
    else{
      this.share.presentToast("Please fill required fields")
    }
  }
}
