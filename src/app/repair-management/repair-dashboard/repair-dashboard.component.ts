import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-repair-dashboard',
  templateUrl: './repair-dashboard.component.html',
  styleUrls: ['./repair-dashboard.component.scss'],
})
export class RepairDashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private share: ShareService,
    private api: ApiService
  ) {}
  srcPage: any;
  selectedTab: any = 'DETAILS';
  jobId: any;
  ngOnInit() {}
  goToPage(tab: any) {
    this.selectedTab = tab;
  }
  jobDetails: any;
  jobLoader: any;
  getJobByRowId() {
    this.share.showLoading('Fetching Data');
    this.jobLoader = true;
    let obj: any = this.share.getListObj('repairing_record', false, [], true);
    obj.id = this.jobId;
    this.api.postapi('getJobByRowId', obj).subscribe(
      (res: any) => {
        this.jobDetails = res?.data;
        this.jobLoader = false;
        this.getInventory();
        this.getIssueList();
   
      },
      (error: any) => {}
    );
  }
  loadAllData: any = false;
  checkALLData() {
    if (!this.jobLoader && !this.invetoryLoader && !this.issueLoader) {
      this.loadAllData = true;
      return true;
    } else {
      return false;
    }
  }
  inventoryArray: any = [];
  getInventoryName() {
    this.inventoryArray = [];
    this.jobDetails.inventoryOptions?.forEach((f: any) => {
      let find = this.inventoryList.find((inv: any) => inv.id == f);
      if (find) {
        this.inventoryArray.push(find);
      }
    });
  }
  issueArray: any = [];

  getIssueName() {
    this.issueArray = [];
    this.jobDetails.issueOptions?.forEach((f: any) => {
      let find:any = this.issueList.find((inv: any) => inv.id == f);
  
      if (find) {
        let isItDone=this.jobDetails?.completedIssues?.find((com: any) => com == f);
        if(isItDone){
          find.isCompleted=true
        }else{
          find.isCompleted=false
        }
        this.issueArray.push(find);
      }
    });
  }
  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.jobId = params?.id;
      this.srcPage = params?.srcPage;
    });
    this.getJobByRowId();
   this.getRawImages()
  }
  beforeService:any=[]
  afterService:any=[]
  jobArray:any=[]
    filterImage(){
  this.beforeService=this.imageArray.filter((f:any)=>f.imageGroup=='BEFORE_SERVICE')
  this.afterService=this.imageArray.filter((f:any)=>f.imageGroup=='AFTER_SERVICE')
  this.jobArray=this.imageArray.filter((f:any)=>f.imageGroup=='JOB_CARD')
    }
  staffDetails:any
  imageArray:any=[]
  imageLoader=false
  getRawImages(loader:any=false){
    this.imageLoader=true
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj = {
      operate: this.staffDetails?.staffCode,
      
      tractor_id: this.jobId,
    };
    if(loader==true){
      this.share.showLoading("Refreshing Data...")
    }

    this.api.postapi('getRawImagesRepair', obj).subscribe((res: any) => {
      console.log("data",res);
      this.imageArray=res?.data || []
      //this.imageArray= this.imageArray.filter((f:any)=>f.imageGroup==this.imageGroup)
      this.filterImage()
       this.imageLoader=false
       if(loader==true){
        this.share.spinner.dismiss()
      }
 
    },(error:any)=>{
      this.imageLoader=false
    });
  }
  inventoryList: any = [];
  invetoryLoader = false;
  getInventory(loader: any = false) {
    if (loader) {
      this.share.showLoading('Getting Data...');
    }
    this.invetoryLoader = true;
    let obj: any = this.share.getListObj('tractor_inventory', false, [], true);

    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.inventoryList = res?.data || [];

        this.getInventoryName();
        this.invetoryLoader = false;
        if (this.checkALLData()) {
          this.share.spinner.dismiss();
        }
        if (loader) {
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {}
    );
  }
  issueList: any = [];
  issueLoader = false;
  getIssueList(loader: any = false) {
    if (loader) {
      this.share.showLoading('Getting Data...');
    }
    let obj: any = this.share.getListObj('tractor_issue', false, [], true);

    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.issueList = res?.data || [];

        this.getIssueName();
        this.issueLoader = false;
        if (this.checkALLData()) {
          this.share.spinner.dismiss();
        }
        if (loader) {
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {}
    );
  }
  backToSrcPage() {
    this.router.navigate([this.srcPage]);
  }
}
