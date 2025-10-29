import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SearchTractorWithTfCodeComponent } from 'src/app/shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { GlobalFilterTractorComponent } from 'src/app/shared-components/global-filter-tractor/global-filter-tractor.component';
@Component({
  selector: 'app-tractor-list-franchise',
  templateUrl: './tractor-list-franchise.component.html',
  styleUrls: ['./tractor-list-franchise.component.scss'],
})
export class TractorListFranchiseComponent  implements OnInit {

  constructor(public share:ShareService,private api:ApiService,private modalCtrl:ModalController) { }
  ionViewWillEnter() {
    //this.alltractorList = [];
    this.getBrandList();
    this.getWareHouseList();

    // this.getTractorList();
  }
    brandList: any = [];
  selectedBrand: any;
  getBrandList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    //if(loader){
   // this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('brand', false, [], true);
    obj.storeId = this.staffDetails?.storeId;

    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.brandList = res?.data;
          this.brandList = this.brandList.reverse();

          console.log('  this.brandList', this.brandList);
          if (!loader) {
            this.selectedBrand = this.brandList[0]?.id;

          //  this.getTractorList();
            //   this.share.spinner?.dismiss();
          }
        },
        (error: any) => {}
      );
    }, 0);
  }
  ngOnInit() {}
  staffDetails:any
  listColorClass='firstColor'
warehouseList: any = [];
selectedStore:any
  getWareHouseList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    //if(loader){
   // this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('warehouselocation', false, [], true);
    obj.storeId = this.staffDetails?.storeId;
      this.share.showLoading('Loading...');
    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.warehouseList = res?.data;
          this.warehouseList = this.warehouseList.reverse();

          console.log('this.warehouseList', this.warehouseList);
          if (!loader) {
            this.selectedStore = this.warehouseList[0]?.id;

            this.getAllTractorListStorewise();
               //this.share.spinner?.dismiss();
          }
        },
        (error: any) => {}
      );
    }, 0);
  }
  headerDisplayArray=[
   {name:'Search', icon:'search-outline'},
   {name:'Filter', icon:'cog-outline'},
   {name:'Refresh', icon:'refresh-outline'},

  ]
  actionEventHeader(e:any){
if(e?.name=='Search'){
this.searchTractor()
}else if(e?.name=='Filter'){
  this.openFilter()
}
  }
   
  
      filterBy: any = 'ALL';
        listBy = 'ALL';
      async openFilter() {
        const modal = await this.modalCtrl.create({
          component: GlobalFilterTractorComponent,
          breakpoints: [0, 0.8, 1],
          initialBreakpoint: 0.8,
          cssClass: 'custom-modal',
          componentProps: {
            filterBy: this.filterBy,
            listBy: this.listBy,
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (data && data?.isFilterChange) {
          console.log('data', data);
          this.filterBy = data?.filterBy;
        //  this.sortByFilter()
        }
        if (data && data?.isListChange) {
          console.log('data', data);
          this.listBy = data?.listBy;
          //this.callListApi()
        }
      }
    async searchTractor() {
      const modal = await this.modalCtrl.create({
        component: SearchTractorWithTfCodeComponent,
        componentProps: {
          buttonArray: this.buttonArray,
          listColorClass: this.listColorClass,
          keyList: this.keyList,
          searchFilter: this.search,
          searchKey: 'registractionNo',
          obj: { optionsUploadButtonArray: [] }
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
      }
    }
  alltractorList:any=[]
  allTractorsSrcList:any=[]
   getAllTractorListStorewise(loader: any = false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    if(!this.selectedStore){
      this.selectedStore= this.warehouseList[0]?.id
    }
    let obj = {
      operate: this.staffDetails?.staffCode,
      store_id: this.selectedStore,
    };
    if (loader) {
      this.share.showLoading('Loading...');
    }
    this.alltractorList=[]
    this.api.postapi('getTractorsListStoreWise', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
      
      //this.sortByFilter()
        this.share.spinner.dismiss('active_one');
        //this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
    search = {
    registractionNo: null,
  };
         buttonArray: any = [
 {
      name: 'Tractor Dashboard',
      action: 'tractorDashboard',
            closeCurrentPopUP:true,
    srcPage:'/operational/all-tractor-management',
      image: './././assets/images/layout.png',
    },
     {
      name: 'Sync Mainatainance',
      action: 'syncMainatinance',
      image: './././assets/images/sync.png',
    },
      {
      name: 'Tractor Summary',
      action: 'tractorSummary',
      image: './././assets/images/data-analysis.png',
    },
        
  ];
    keyList: any = [
    { key: 'Model', value: 'name', type: 'INPUT' },
        { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },
    { key: 'Engine Number', value: 'engineNumber', type: 'INPUT' },
    // { key: 'Staus', value: 'tractor_status', type: 'INPUT' },
    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },

    { key: 'Is Sold', value: 'isSold', type: 'CONDITIONAL' },


    { key: 'Hours', value: 'hours', type: 'INPUT' },
  
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  actionEventCall(e:any){

  }
}
