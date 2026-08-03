/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AddServiceChargeComponent } from './add-service-charge/add-service-charge.component';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { AddMaterialExpenseComponent } from './add-material-expense/add-material-expense.component';
import { AddReducePartComponent } from './add-reduce-part/add-reduce-part.component';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
@Component({
  selector: 'app-build-job',
  templateUrl: './build-job.component.html',
  styleUrls: ['./build-job.component.scss'],
})
export class BuildJobComponent implements OnInit, OnChanges {
  @Input() jobDetails: any;
  @Input() selectedTabBuild: any;
  @Input() expenseServiceList: any;
  @Input() expenseMaterialList: any = [];
  @Input() materialList: any = [];
  @Input() reduceItemList: any = [];
  @Input() spareList: any = []
  @Input() prdeictionMaterialList: any = [];
  @Input() isJobDone: any =false
  @Input() listColorClass = 'secondColor';
  @Output() refreshServiceList = new EventEmitter();
  @Output() refreshMaterailList = new EventEmitter();
  @Output() refreshReducelList = new EventEmitter();
  constructor(
    private alertCtrl: AlertController,
    private modalControl: ModalController,
    private share: ShareService,
    private api: ApiService
  ) {}

  selectedTab: any = 'SERVICE';

  jobId: any;
  ngOnInit() {
      if(this.share.selectedRepairTab!='SERVICE' && this.share.selectedRepairTab!='REDUCE_ITEMS'){
let selectedTab=this.spareList?.find((f:any)=>f.name==this.share.selectedRepairTab)
 this.goToPage(this.share.selectedRepairTab,selectedTab)
      
    }else{
  this.goToPage(this.share.selectedRepairTab)
    }
  
  }
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['expenseMaterialList'] &&
      !changes['expenseMaterialList'].firstChange &&
      this.selectedTab != 'SERVICE' &&
      this.selectedTab != 'REDUCE_ITEMS'
    ) {
      this.get_list_catWise(this.expenseMaterialList);
    }
  }
  selectedCat:any
  goToPage(tab: any,selectedCat:any=null) {
    
    this.selectedTab = tab;
  this.share.selectedRepairTab= tab;
    if(this.selectedTab!='SERVICE' && this.selectedTab!='REDUCE_ITEMS'){
this.selectedCat=selectedCat
this.get_list_catWise(this.expenseMaterialList)
      
    }
  }
    async selectItem(list: any, itemName: any, item: any) {
      const modal = await this.modalControl.create({
        component: SelectWithSearchComponent,
        componentProps: {
          list: list,
          itemName: itemName,
          table_name: item,
          showAddButton: false,
          otherObjects: null,
          jsonKey: 'name',
          search: {
            name: null,
          },
        },
      });
      await modal.present();
  
      const { data, role } = await modal.onWillDismiss();
  
      if (data) {
        //   this.newFindingForms.controls['dealerId'].setValue(data?.id);
     this.changeCategoryAlert(data,item)
        //this.resetOtherValue()
      }
  
      console.log('role', role, data);
  
      if (role === 'confirm') {
      }
    }
    async  changeCategoryAlert(data:any,item:any){
      let get
         let header='Changing Category From '+this.selectedCat?.name+' to '+data?.name
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: '',
      message: 'Are You Sure',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result?.role == 'Yes') {
      this.updateItemCategory(item,data)
    
    }
  
  }
  updateItemCategory(item:any,data:any){
      let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      src: 'repair_expense_costing',
      data: { cat_id:data?.id,},
      id: item?.id,
    };

    this.share.showLoading('Deleting Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Category Changed Successfully...');
     this.refreshMaterailList.emit();
    });
  }
  catWiseItemList:any=[]
  itemCount=0
get_list_catWise(list:any=[]){
  this.catWiseItemList=[]
  let itemOfCatId=list.filter((f:any)=>f.cat_id==this.selectedCat?.id)||[]
  let itemDOntHaceCatId=list.filter((f:any)=>f.cat_id==null)
  let catWiseArray: any[] = []
  itemDOntHaceCatId?.forEach((f:any)=>{
    let getMaterial=this.materialList?.find((mat:any)=>mat.id==f.expense_id)
    if(getMaterial?.category==this.selectedCat?.id){
catWiseArray.push(f)
    }
  })
  this.catWiseItemList=[...itemOfCatId,...catWiseArray]

}

  addParts() {}
  async addService(expense_head: any, obj: any = null) {
    const modal = await this.modalControl.create({
      component: AddServiceChargeComponent,
      cssClass: 'modal-xl',
      componentProps: {
        tractorDetails: this.jobDetails,
        expense_head: expense_head,
        editData: obj,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    //this.getServiceList();
    this.refreshServiceList.emit();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  async addMaterial(expense_head: any, obj: any = null, type: any = 'SERVICE') {
    const modal = await this.modalControl.create({
      component: AddMaterialExpenseComponent,
      cssClass: 'modal-xl',
      componentProps: {
        tractorDetails: this.jobDetails,
        expense_head: expense_head,
        editData: obj,
        selectedCategory:this.selectedCat,
         catWiseItemList:[]
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    //this.getServiceList();
   // if (type == 'SERVICE') {
    //  this.refreshServiceList.emit();
    //} else {
      this.refreshMaterailList.emit();
      
  //  }
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  async addReduceMaterial( obj: any = null) {
    const modal = await this.modalControl.create({
      component: AddReducePartComponent,
      cssClass: 'modal-xl',
      componentProps: {
        tractorDetails: this.jobDetails,
     
        editData: obj,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    //this.getServiceList();
   // if (type == 'SERVICE') {
    //  this.refreshServiceList.emit();
    //} else {
      this.refreshReducelList.emit();
  //  }
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  openServiceEdit(ser: any = null, expense_head: any = null) {
    let obj: any = {};

    obj.expense_id = ser?.expense_id;
    obj.repairing_center = ser?.repairing_center;
    obj.billNumber = ser?.billNumber;
    obj.expense_amount = ser?.expense_amount;
    obj.id = ser?.id;

    this.addService(expense_head, obj);
  }
  openEdit(mat: any = null, expense_head: any = null) {
    let obj: any = {};

    obj.expense_id = mat?.expense_id;
    obj.repairing_center = mat?.repairing_center;
    obj.expense_amount = mat?.expense_amount;
    obj.id = mat?.id;

    obj.qty = mat?.qty;
    obj.billNumber = mat?.billNumber;
    obj.repairing_center = mat?.repairing_center;

    this.addMaterial(expense_head, obj, 'MATERIAL');
  }
  openEditReduce(mat: any = null) {
    let obj: any = {};

    obj.job_id = mat?.job_id;
    obj.part_id = mat?.part_id;
    obj.repairing_center = mat?.repairing_center;
    obj.reduce_amount = mat?.reduce_amount;
    obj.remark = mat?.remark;
    obj.id = mat?.id;

    obj.qty = mat?.qty;


    this.addReduceMaterial(obj);
  }
  async deleteItem(mat: any,text:any='Delete Spare') {
    const alert = await this.alertCtrl.create({
      header: text,
      subHeader: '',
      message: 'Are You Sure',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result?.role == 'Yes') {
      this.deleteMaterialApi(mat,text);
    }
  }
  
 staffDetails:any
  deleteMaterialApi(mat: any,text:any) {
        let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      src: 'repair_expense_costing',
      data: { isDeleted: true,deletedBy:this.staffDetails?.id },
      id: mat?.id,
    };

    this.share.showLoading('Deleting Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Deleted Successfully...');
      if(text=='Delete Spare'){
        this.refreshMaterailList.emit();
      }
 else{
  this.refreshServiceList.emit();
 }
    });
  }

  async deleteReduce(mat: any,) {
    
    const alert = await this.alertCtrl.create({
      header: "Delete Reduced Item",
      subHeader: '',
      message: 'Are You Sure',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result?.role == 'Yes') {
      this.deleteReduceApi(mat);
    }
  }
  
 
  deleteReduceApi(mat: any) {
      let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj = {
      src: 'reduce_costing',
      data:{ isDeleted: true,deletedBy:this.staffDetails?.id  },
      id: mat?.id,
    };

    this.share.showLoading('Deleting Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Deleted Successfully...');
      this.refreshReducelList.emit();
    
    });
  }
}
