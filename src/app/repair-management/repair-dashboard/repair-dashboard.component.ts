import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { AddServiceChargeComponent } from './build-job/add-service-charge/add-service-charge.component';
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
  isJobDone = false;
  getJobByRowId() {
    this.share.showLoading('Fetching Data');
    this.jobLoader = true;
    let obj: any = this.share.getListObj('repairing_record', false, [], true);
    obj.id = this.jobId;
    this.api.postapi('getJobByRowId', obj).subscribe(
      (res: any) => {
        this.materialLoader = true;
        this.serviceLoader = true;
        if (res?.data?.isCompleted == 1) {
          this.isJobDone = true;
        }
        this.jobDetails = res?.data;
        this.jobLoader = false;

        this.getServiceList();
        this.getReduceList();
        this.getInventory();
        this.getIssueList();
        this.getMaterialList();
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
      let find: any = this.issueList.find((inv: any) => inv.id == f);

      if (find) {
        let isItDone = this.jobDetails?.completedIssues?.find(
          (com: any) => com == f
        );
        if (isItDone) {
          find.isCompleted = true;
        } else {
          find.isCompleted = false;
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
    this.categroyWiseMaterial = [];
    this.isJobDone = false;
    this.getJobByRowId();
    this.getRawImages();
  }
  beforeService: any = [];
  afterService: any = [];
  jobArray: any = [];
  filterImage() {
    this.beforeService = this.imageArray.filter(
      (f: any) => f.imageGroup == 'BEFORE_SERVICE'
    );
    this.afterService = this.imageArray.filter(
      (f: any) => f.imageGroup == 'AFTER_SERVICE'
    );
    this.jobArray = this.imageArray.filter(
      (f: any) => f.imageGroup == 'JOB_CARD'
    );
  }
  staffDetails: any;
  imageArray: any = [];
  imageLoader = false;
  getRawImages(loader: any = false) {
    this.imageLoader = true;
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj = {
      operate: this.staffDetails?.staffCode,

      tractor_id: this.jobId,
    };
    if (loader == true) {
      this.share.showLoading('Refreshing Data...');
    }

    this.api.postapi('getRawImagesRepair', obj).subscribe(
      (res: any) => {
        console.log('data', res);
        this.imageArray = res?.data || [];
        //this.imageArray= this.imageArray.filter((f:any)=>f.imageGroup==this.imageGroup)
        this.filterImage();
        this.imageLoader = false;
        if (loader == true) {
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {
        this.imageLoader = false;
      }
    );
  }
  expenseMaterialList: any = [];
  prdeictionMaterialList: any = [];
  materialLoader: any = false;
  getMaterialList(loader: any = false) {
    let obj: any = this.share.getListObj(
      'repair_expense_costing',
      false,
      [],
      true
    );
    obj.tractor_id = this.jobDetails?.id;
    if (loader) {
      this.share.showLoading('Fetching Data...');
    }
    this.materialLoader = true;
    this.api.postapi('getMaterialExpense_cost', obj).subscribe(
      (res: any) => {
        this.expenseMaterialList = res?.data.filter(
          (f: any) => f?.expense_head == 'EXPENSE'
        );
        this.prdeictionMaterialList = res?.data.filter(
          (f: any) => f?.expense_head == 'PREDICTION'
        );
        this.calculateAmount();

        //if(!loader){
        this.getMaterial(loader);
        // }
        // this.materialLoader=false
      },
      (error: any) => {
        this.materialLoader = false;
      }
    );
  }
  materialList: any = [];
  getMaterial(loader: any = false) {
    let obj = this.share.getListObj('repairmateriallist', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.materialList = res?.data;
        this.getSpareCategory(loader);
      },
      (error: any) => {}
    );
  }
  spareList: any = [];
  getSpareCategory(loader: any = false) {
    let obj = this.share.getListObj('spare_category', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.spareList = res?.data;
        this.categroyWiseMaterial = [];
        this.setCatWiseMatList();
        this.materialLoader = false;

        if (loader) {
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {}
    );
  }
  categroyWiseMaterial: any = [];
  setCatWiseMatList() {
    this.expenseMaterialList.forEach((expense: any) => {
      let findinMatList = this.materialList.find(
        (mat: any) => mat.id == expense?.expense_id
      );
      let getCat = this.spareList.find(
        (spare: any) => spare.id == findinMatList?.category
      );
      if (getCat) {
        let findExist = this.categroyWiseMaterial.findIndex(
          (cat: any) => cat.id == getCat.id
        );
        if (findExist > -1) {
          this.categroyWiseMaterial[findExist].total_amount =
            Number(this.categroyWiseMaterial[findExist].total_amount) +
            Number(expense?.total_expense);
          this.categroyWiseMaterial[findExist].materialList.push(expense);
        } else {
          let obj = {
            catName: getCat.name,
            id: getCat.id,
            materialList: [expense],
            total_amount: expense?.total_expense||0,
          };
          this.categroyWiseMaterial.push(obj);
        }
      }
    });
  }
  expenseServiceList: any = [];
  prdeictionServiceList: any = [];
  serviceLoader = false;
  getServiceList(loader: any = false) {
    this.serviceLoader = true;
    let obj: any = this.share.getListObj(
      'repair_expense_costing',
      false,
      [],
      true
    );
    obj.tractor_id = this.jobDetails?.id;
    if (loader) {
      this.share.showLoading('Fetching Data...');
    }

    this.api.postapi('getServiceExpense_cost', obj).subscribe(
      (res: any) => {
        this.expenseServiceList = res?.data.filter(
          (f: any) => f?.expense_head == 'EXPENSE'
        );
        this.prdeictionServiceList = res?.data.filter(
          (f: any) => f?.expense_head == 'PREDICTION'
        );
        this.calculateAmount();
        this.serviceLoader = false;
        if (loader) {
          this.share.spinner.dismiss();
        }
        console.log('expenseServiceList', this.expenseServiceList);
        //   this.calculateAmount();
        // this.share.spinner.dismiss();
      },
      (error: any) => {
        this.serviceLoader = false;
      }
    );
  }
  reduceItemList: any = [];

  reduceLoader = false;
  getReduceList(loader: any = false) {
    this.reduceLoader = true;
    let obj: any = this.share.getListObj('reduce_costing', false, [], true);
    obj.job_id = this.jobDetails?.id;
    if (loader) {
      this.share.showLoading('Fetching Data...');
    }

    this.api.postapi('getReduceItemList', obj).subscribe(
      (res: any) => {
        this.reduceItemList = res?.data;
        this.calculateAmount();
        this.reduceLoader = false;
        if (loader) {
          this.share.spinner.dismiss();
        }
        console.log('reduceLoader', this.reduceLoader);
        //   this.calculateAmount();
        // this.share.spinner.dismiss();
      },
      (error: any) => {
        this.reduceLoader = false;
      }
    );
  }
  expenseMaterialCost: any = 0;
  expenseServiceCost: any = 0;
  reduceItemTotalAmount: any = 0;
  calculateAmount() {
    this.expenseMaterialCost = 0;
    this.expenseServiceCost = 0;
    this.reduceItemTotalAmount = 0;

    this.expenseMaterialList.forEach((f: any) => {
      this.expenseMaterialCost =
        this.expenseMaterialCost + Number(f?.total_expense);
    });
    this.expenseServiceList.forEach((f: any) => {
      this.expenseServiceCost =
        this.expenseServiceCost + Number(f?.total_expense);
    });
    this.reduceItemList?.forEach((f: any) => {
      this.reduceItemTotalAmount =
        this.reduceItemTotalAmount + Number(f?.total_amount);
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
