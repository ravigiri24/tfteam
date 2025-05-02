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
import { ActivatedRoute, Router } from '@angular/router';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCntrol: ModalController,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) {}
  brandList: any = [];
  data: any;
  jobId:any
  ngOnInit() {

  }

  getJobByRowId(id:any){

    let obj:any = this.share.getListObj('repairing_record', false, [], true);
    obj.id=this.jobId
    this.api.postapi('getJobByRowId', obj).subscribe(
      (res: any) => {
        this.data=res?.data
     this.initialize()
   this.getBrandList()
   this.getInventory();
   this.getIssueList();
   this.getMechanicList()
      },
      (error: any) => {}
    );
  }
  srcPage:any
  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params:any) => {
      this.jobId = params?.id;
      this.srcPage = params?.srcPage;
    });
    if (this.jobId != undefined) {
      this.getJobByRowId(this.jobId);
    }else{
      this.initialize()
      this.getBrandList();
         
    this.getInventory();
    this.getIssueList();
    this.getMechanicList()
    }
  

    this.createYearArray();
  }
  selectIssue(e: any, issue: any) {
    console.log('selectIssue', e, issue);
    issue.checked = e?.detail?.checked;
    if (e?.detail?.checked == true) {
      let value = this.form.controls['issueOptions'].value;
      if (value == null || value == undefined) {
        let array = [];
        array.push(issue.id);
        this.form.controls['issueOptions'].setValue(array);
      } else {
        value.push(issue.id);
        this.form.controls['issueOptions'].setValue(value);
      }
    } else {
      let value = this.form.controls['issueOptions'].value;
      let find = value.find((fL: any) => fL == issue.id);
      if (find) {
        value = value?.filter((f: any) => f !== issue.id);
        this.form.controls['issueOptions'].setValue(value);
      }
  
    }
    console.log(
      " this.form.controls['issueOptions'].value",
      this.form.controls['issueOptions'].value
    );
  }
  selectInventory(e: any, inventory: any) {
    console.log('selectIssue', e, inventory);
    inventory.checked = e?.detail?.checked;
    if (e?.detail?.checked == true) {
      let value = this.form.controls['inventoryOptions'].value;
      if (value == null || value == undefined) {
        let array = [];
        array.push(inventory.id);
        this.form.controls['inventoryOptions'].setValue(array);
      } else {
        value.push(inventory.id);
        this.form.controls['inventoryOptions'].setValue(value);
      }
    } else {
      let value = this.form.controls['inventoryOptions'].value;
      let find = value.find((fL: any) => fL == inventory.id);
      if (find) {
        value = value?.filter((f: any) => f !== inventory.id);
        this.form.controls['inventoryOptions'].setValue(value);
      }
  
    }
    console.log(
      " this.form.controls['inventoryOptions'].value",
      this.form.controls['inventoryOptions'].value
    );
  }
  mechanicList:any=[]
  getMechanicList(loader:any=false) {
    if(loader){
    this.share.showLoading('Loading...');
    }
    let obj = this.share.getListObj('mechanic_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.mechanicList = res?.data;
  if(loader){
    this.share.spinner.dismiss()
  }
   
      },
      (error: any) => {}
    );
  }
  getBrandList() {
    this.share.showLoading('Loading...');
    let obj = this.share.getListObj('brand', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.brandList = res.data;
        this.brandList = this.brandList.reverse();
        if (!this.data) {
          this.form.controls['brand_id'].setValue(this.brandList[0]?.id);
        }
        this.getModelList();
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  staffDetails: any;
  initialize() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    let date = new Date();
    let currentYear = date.getFullYear();
    this.form = this.fb.group({
      brand_id: new FormControl(this.data?.brand_id || null, [
        Validators.required,
      ]),
      model_id: new FormControl(this.data?.model_id || null, [
        Validators.required,
      ]),
      tfCode: new FormControl(this.data?.tfCode || null, [Validators.required]),
      yearOfManufactoring: new FormControl(
        Number(this.data?.yearOfManufactoring) || null,
        []
      ),
      regNumber: new FormControl(this.data?.regNumber || null, []),
      hours: new FormControl(this.data?.hours || null, []),
      engineNumber: new FormControl(this.data?.engineNumber || null, []),
      fuelLevel: new FormControl(this.data?.fuelLevel || null, []),
      otherInventoryOptions: new FormControl(
        this.data?.otherInventoryOptions || null,
        []
      ),
      otherIssues: new FormControl(this.data?.otherIssues || null, []),
      customer_name: new FormControl(this.data?.customer_name || null, []),
      contact_number: new FormControl(this.data?.contact_number || null, []),
      issueOptions: new FormControl(this.data?.issueOptions || null, []),
      inventoryOptions: new FormControl(this.data?.inventoryOptions || null, []),
      isSelf: new FormControl(this.data?.isSelf || false, []),
      costEstimated: new FormControl(this.data?.costEstimated || null, []),
      mechanicAlloted: new FormControl(this.data?.mechanicAlloted || null, []),
    });
  }
  async openCrudManagement(type: any = 'TRACTOR_INVENTORY') {
    const modal = await this.modalCntrol.create({
      component: CrudPopupComponent,
      componentProps: {
        type: type,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (type == 'TRACTOR_INVENTORY') {
      this.getInventory();
    } else if (type == 'TRACTOR_ISSUES') {
      this.getIssueList(true);
    }else if(type=='MECHANIC_LIST'){
      this.getMechanicList(true)
    }
    console.log('role', role);
  }
  inventoryList: any = [];
  getInventory(loader: any = false) {
    if (loader) {
      this.share.showLoading('Getting Data...');
    }

    let obj: any = this.share.getListObj('tractor_inventory', false, [], true);

    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.inventoryList = res.data;
    
        this.inventoryList?.forEach((f: any) => {
          f.checked = false;
        });
        this.checkCheckedInventory();
        if (loader) {
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {}
    );
  }
  issueList: any = [];
  getIssueList(loader: any = false) {
    if (loader) {
      this.share.showLoading('Getting Data...');
    }
    let obj: any = this.share.getListObj('tractor_issue', false, [], true);

    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.issueList = res.data;
        this.issueList?.forEach((f: any) => {
          f.checked = false;
        });
        this.checkCheckedIssue();
        if (loader) {
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {}
    );
  }
  checkCheckedIssue() {
    let value = this.form.controls['issueOptions'].value;
    this.issueList?.forEach((f: any) => {
      let find = value?.find((v: any) => v == f.id);
      if (find) {
        f.checked = true;
      }
    });
  }
  checkCheckedInventory() {
    let value = this.form.controls['inventoryOptions'].value;
    this.inventoryList?.forEach((f: any) => {
      let find = value?.find((v: any) => v == f.id);
      if (find) {
        f.checked = true;
      }
    });
  }
  updateForm(){
    if(this.form.valid){
      let obj:any=this.form.value
      let staffDetails: any = this.share.get_staff();
   
      this.staffDetails = JSON.parse(staffDetails);
       
          this.share.showLoading('Updating...');
      
          obj.repair_center = this.staffDetails?.repair_center;
          obj.actionById = this.staffDetails?.id;
          obj.operate = this.staffDetails?.staffCode;
          obj.id = this.jobId;
          this.api.postapi('updateJob', obj).subscribe(
            (res: any) => {
              this.share.spinner.dismiss()
              this.share.presentToast("Updated Successfully...")
              this.router.navigate(['/repair-management/job-list'])
            },
            (error: any) => {}
          );

    }
    else{
      this.share.presentToast("Please Fill required fields")
    }
  }
  checkTfCodeOnUpdate(){
    if(this.form.valid){
      let staffDetails: any = this.share.get_staff();
   
      this.staffDetails = JSON.parse(staffDetails);
      let obj={
      operate : this.staffDetails?.staffCode,
      tfCode:this.form.value?.tfCode,
      job_id:this.jobId

      }
      this.share.showLoading('Checking TF Code...');
      this.api.postapi('checking_tf_on_update', obj).subscribe(
        (res: any) => {
          this.share.spinner.dismiss()
       if(res?.status){
        this.updateForm()
       }else{
        this.share.presentToast("Error,TF Code Already Exist")
       }
         // this.router.navigate([this.srcPage])
        },
        (error: any) => {}
      );
 
    }else{
      this.share.presentToast("Please Fill required fields")
    }
  }
  checkTfCode(){
    if(this.form.valid){
      let staffDetails: any = this.share.get_staff();
   
      this.staffDetails = JSON.parse(staffDetails);
      let obj={
      operate : this.staffDetails?.staffCode,
      tfCode:this.form.value?.tfCode

      }
      this.share.showLoading('Checking TF Code...');
      this.api.postapi('checking_tf', obj).subscribe(
        (res: any) => {
          this.share.spinner.dismiss()
       if(res?.status){
        this.saveForm()
       }else{
        this.share.presentToast("Error,TF Code Already Exist")
       }
         // this.router.navigate([this.srcPage])
        },
        (error: any) => {}
      );
 
    }else{
      this.share.presentToast("Please Fill required fields")
    }
  }
  saveForm() {
    if(this.form.valid){
 
      let obj=this.form.value
      let staffDetails: any = this.share.get_staff();
   
      this.staffDetails = JSON.parse(staffDetails);
       
          this.share.showLoading('Creating...');
      
          obj.repair_center = this.staffDetails?.repair_center;
          obj.actionById = this.staffDetails?.id;
          obj.operate = this.staffDetails?.staffCode;
          obj.billNumber = "TF-"+Math.floor(10000000 + Math.random() * 90000000)
          this.api.postapi('createJob', obj).subscribe(
            (res: any) => {
              this.share.spinner.dismiss()
              this.share.presentToast("Created Successfully...")
              this.router.navigate([this.srcPage])
            },
            (error: any) => {}
          );
     

    }
    else{
      this.share.presentToast("Please Fill required fields")
    }
 
  }
  yearArray: any = [];
  createYearArray() {
    this.yearArray = [];
    let date = new Date();
    let getyear = date.getFullYear();
    let tillyear = Number(getyear) - 41;
    for (let index = getyear; index > tillyear; index--) {
      this.yearArray.push(index);
    }
  }
  backToDashboard() {
    this.router.navigate([this.srcPage]);
  }
  form: FormGroup;
  getModelsbyBrand(setValue: any = true) {
    if (setValue) {
      this.form.controls['model_id'].setValue(null);
    }
    this.modelList = this.modelListAll.filter(
      (f: any) => f.brandID == this.form.controls['brand_id']?.value
    );
    if (this.modelList?.length && setValue) {
      this.form.controls['model_id'].setValue(this.modelList[0]?.id);
    }
  }
  modelList: any = [];
  modelListAll: any = [];
  getModelList() {
    this.modelList = [];
    let obj = this.share.getListObj('model', false, [], false);
    // this.share.showLoading('Loading...')
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.modelListAll = res.data;
        if (!this.data) {
          this.getModelsbyBrand();
        } else {
          this.getModelsbyBrand(false);
        }
        this.share?.spinner?.dismiss();
      },
      (error: any) => {}
    );
  }
}
