import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class ShareService {
  activeCurrent: any = null;
  showFooter = true;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private fb: FormBuilder
  ) {}
  set_staff_detail_session(data: any) {
    localStorage.setItem('userDetails', JSON.stringify(data));
  }
  clearSession() {
    //  localStorage.removeItem('currentGame');
    localStorage.clear();
  }
  showFooterAction(e: any) {
    this.showFooter = e;
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'A Short Title Is Best',
      subHeader: 'A Sub Header Is Optional',
      message: 'A message should be a short, complete sentence.',
      buttons: ['Action'],
    });

    await alert.present();
  }

  get_staff() {
    return localStorage.getItem('userDetails') || null;
  }
  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  getListObj(
    src: any,
    isImage: any = false,
    images: any = [],
    all: any,
    keys: any = []
  ) {
    let getStaffDetail: any = this.get_staff();
    let getStaff: any = JSON.parse(getStaffDetail);
    let obj = {
      src: src,
      operate: getStaff?.staffCode,
      isImage: isImage,
      images: images,
      all: all,
      keys: keys,
    };
    return obj;
  }
  spinner = {
    dismiss: () => {
      this.activeCurrent = 'active_page active_seven'; // active_one to active_seven
      setTimeout(() => {
        this.globalLoading = false;
      }, 1000);

      // You can put your logic here (e.g., hiding loader UI)
    },
  };
  globalLoading = false;
  async showLoading(message: any, duration: any = 7000) {
    this.activeCurrent = null;
    // this.spinner = await this.loadingCtrl.create({
    //   message: message,
    //   duration: duration,
    // });
    //    this.spinner.present();

    this.globalLoading = true;
    setTimeout(() => {
      this.globalLoading = false;
    }, duration);
  }
  getDataRowObj(src: any, isImage: any, images: any, rowCode: any) {
    let staffDetails: any = this.get_staff();
    //console.log('staffDetails', staffDetails);
    let getStaff = JSON.parse(staffDetails);
    let obj = {
      src: src,
      operate: getStaff?.staffCode,
      isImage: isImage,
      images: images,
      rowCode: rowCode,
    };
    return obj;
  }
  checkLogin() {
    let user = this.get_staff();
    if (user) {
      let userde = JSON.parse(user);
      if (userde) {
        if (userde?.isMultiRole == 0 || !userde?.isMultiRole) {
          if (userde?.staff_role == 'DIGITAL') {
            this.router.navigate(['/digital/customer-management']);
          } else if (userde?.staff_role == 'OPERATIONAL') {
            this.router.navigate(['/operational/buffer-stock']);
          } else if (userde?.staff_role == 'PURCHASE') {
            this.router.navigate(['/purchase-management/inventory-list']);
          } else if (
            userde?.staff_role == 'SUPER_ADMIN' ||
            userde?.staff_role == 'ADMIN'
          ) {
            this.router.navigate(['/admin-block/reports-tractor']);
          } else if (userde?.staff_role == 'FRANCHISE') {
            this.router.navigate(['/franchise-management/new-tractor']);
          } else if (userde?.staff_role == 'REPAIR') {
            this.router.navigate(['/repair-management/job-dashboard']);
          } else if (userde?.staff_role == 'HR') {
            this.router.navigate(['/hr-deparment/offer-letter']);
          } else if (userde?.staff_role == 'FRANCHISE_OPERATIONS') {
            this.router.navigate([
              '/franchise-operation-deparment/ready-tractor-sales',
            ]);
          } else if (userde?.staff_role == 'TRANSPORT') {
            this.router.navigate([
              '/transport-department/transport-management',
            ]);
          } else if (userde?.staff_role == 'SELL_DEPARTMENT') {
            this.router.navigate(['/sell-department/live-tractor-list']);
          } else if (userde?.staff_role == 'FINANCE_DEPARTMENT') {
            this.router.navigate(['/finance-department/sold-tractor']);
          } else if (userde?.staff_role == 'RTO_DEPARTMENT') {
            this.router.navigate(['/rto-department/rto-noc']);
          } else if (userde?.staff_role == 'INVENTORY_RECEIVED') {
            this.router.navigate([
              '/inventory-receive-department/inven-received-list',
            ]);
          }
        } else {
          if (userde?.currentRole == 'DIGITAL') {
            this.router.navigate(['/digital/customer-management']);
          } else if (userde?.currentRole == 'OPERATIONAL') {
            this.router.navigate(['/operational/buffer-stock']);
          } else if (userde?.currentRole == 'PURCHASE') {
            this.router.navigate(['/purchase-management/inventory-list']);
          } else if (
            userde?.currentRole == 'SUPER_ADMIN' ||
            userde?.currentRole == 'ADMIN'
          ) {
            this.router.navigate(['/admin-block/reports-tractor']);
          } else if (userde?.currentRole == 'FRANCHISE') {
            this.router.navigate(['/franchise-management/new-tractor']);
          } else if (userde?.currentRole == 'REPAIR') {
            this.router.navigate(['/repair-management/job-dashboard']);
          } else if (userde?.currentRole == 'HR') {
            this.router.navigate(['/hr-deparment/offer-letter']);
          } else if (userde?.currentRole == 'FRANCHISE_OPERATIONS') {
            this.router.navigate([
              '/franchise-operation-deparment/ready-tractor-sales',
            ]);
          } else if (userde?.currentRole == 'TRANSPORT') {
            this.router.navigate([
              '/transport-department/transport-management',
            ]);
          } else if (userde?.currentRole == 'SELL_DEPARTMENT') {
            this.router.navigate(['/sell-department/live-tractor-list']);
          } else if (userde?.currentRole == 'FINANCE_DEPARTMENT') {
            this.router.navigate(['/finance-department/sold-tractor']);
          } else if (userde?.currentRole == 'RTO_DEPARTMENT') {
            this.router.navigate(['/rto-department/rto-noc']);
          } else if (userde?.currentRole == 'INVENTORY_RECEIVED') {
            this.router.navigate([
              '/inventory-receive-department/inven-received-list',
            ]);
          }
        }
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
  getDataId(src: any, isImage: any, images: any, id: any) {
    let user = this.get_staff();
    let obj: any;
    if (user) {
      let userde = JSON.parse(user);
      obj = {
        src: src,
        operate: userde?.staffCode,
        isImage: isImage,
        images: images,

        id: id,
      };
    }
    return obj;
  }
  setModelDetail(data: any, modelForm: any) {
    modelForm.controls['brandID'].setValue(data?.brandID);
    modelForm.controls['brandName'].setValue(data?.brandName);
    modelForm.controls['modalID'].setValue(data?.id);
    modelForm.controls['modalName'].setValue(data?.name);
    modelForm.controls['name'].setValue(data?.name);
    let engine = modelForm.controls['engine'] as FormGroup;
    engine.controls['noOfCylinders'].setValue(data?.engine?.noOfCylinders);
    engine.controls['hp'].setValue(data?.engine?.hp);
    engine.controls['capacity'].setValue(data?.engine?.capacity);
    engine.controls['engineRatedRpm'].setValue(data?.engine?.engineRatedRpm);
    engine.controls['cooling'].setValue(data?.engine?.cooling);
    engine.controls['airFilter'].setValue(data?.engine?.airFilter);
    engine.controls['ptoHp'].setValue(data?.engine?.ptoHp);
    engine.controls['fuelPump'].setValue(data?.engine?.fuelPump);
    engine.controls['torque'].setValue(data?.engine?.torque);
    let transmission = modelForm.controls['transmission'] as FormGroup;
    transmission.controls['type'].setValue(data?.transmission?.type);
    transmission.controls['clutch'].setValue(data?.transmission?.clutch);
    transmission.controls['gearBox'].setValue(data?.transmission?.gearBox);
    transmission.controls['battery'].setValue(data?.transmission?.battery);
    transmission.controls['alternator'].setValue(
      data?.transmission?.alternator
    );
    transmission.controls['forwardSpeed'].setValue(
      data?.transmission?.forwardSpeed
    );
    transmission.controls['reverseSpeed'].setValue(
      data?.transmission?.reverseSpeed
    );
    let brakes = modelForm.controls['brakes'] as FormGroup;
    brakes.controls['brakes'].setValue(data?.brakes?.brakes);
    let steering = modelForm.controls['steering'] as FormGroup;
    steering.controls['type'].setValue(data?.steering?.type);
    steering.controls['steeringColumn'].setValue(
      data?.steering?.steeringColumn
    );
    let powertakeof = modelForm.controls['powertakeof'] as FormGroup;
    powertakeof.controls['type'].setValue(data?.powertakeof?.type);
    powertakeof.controls['rpm'].setValue(data?.powertakeof?.rpm);
    let fueltank = modelForm.controls['fueltank'] as FormGroup;
    fueltank.controls['capacity'].setValue(data?.fueltank?.capacity);
    let dimensionandwieght = modelForm.controls[
      'dimensionandwieght'
    ] as FormGroup;
    dimensionandwieght.controls['totalWeight'].setValue(
      data?.dimensionandwieght?.totalWeight
    );
    dimensionandwieght.controls['wheelBase'].setValue(
      data?.dimensionandwieght?.wheelBase
    );
    dimensionandwieght.controls['overallWidth'].setValue(
      data?.dimensionandwieght?.overallWidth
    );
    let hydraulics = modelForm.controls['hydraulics'] as FormGroup;
    hydraulics.controls['liftingCapacity'].setValue(
      data?.hydraulics?.liftingCapacity
    );
    hydraulics.controls['threePointLinkage'].setValue(
      data?.hydraulics?.threePointLinkage
    );
    let wheelsandtyres = modelForm.controls['wheelsandtyres'] as FormGroup;
    wheelsandtyres.controls['wheelDrive'].setValue(
      data?.wheelsandtyres?.wheelDrive
    );
    wheelsandtyres.controls['front'].setValue(data?.wheelsandtyres?.front);
    wheelsandtyres.controls['rear'].setValue(data?.wheelsandtyres?.rear);
    let otherinformation = modelForm.controls['otherinformation'] as FormGroup;
    otherinformation.controls['accessories'].setValue(
      data?.otherinformation?.accessories
    );
    otherinformation.controls['warranty'].setValue(
      data?.otherinformation?.warranty
    );
    console.log('modelForm', modelForm.value);
  }
  staffDetails: any;
  initialize(
    data: any,
    modelForm: FormGroup,
    isStockEntry: any = false,
    tractor_status: any = 'NEW_ARRIVAL',
    isInventoryStock: any = false,
    inventoryStoreId: any = null
  ) {
    let staffDetails: any = this.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    // console.log("this.data",this.data.purchasedetail);
    if (isStockEntry) {
      tractor_status = 'IN_ARRIVAL_STOCK';
      isInventoryStock = true;
      inventoryStoreId = this.staffDetails?.storeId;
    }
    modelForm = this.fb.group({
      brandID: new FormControl(data?.brandID || null, [Validators.required]),

      brandName: new FormControl(data?.brandName || null, [
        Validators.required,
      ]),
      tractor_status: new FormControl(data?.tractor_status || tractor_status, [
        Validators.required,
      ]),
      modalID: new FormControl(data?.modalID || null, [Validators.required]),

      rtoEstimationCost: new FormControl(data?.rtoEstimationCost || null),
      inwardEstimationCost: new FormControl(data?.inwardEstimationCost || null),
      maintainanceEstimationCost: new FormControl(
        data?.maintainanceEstimationCost || null
      ),

      hours: new FormControl(data?.hours || null, [Validators.required]),
      //  dealerPrice: new FormControl(this.data?.dealerPrice || null, [
      //   Validators.required,
      // ]),

      modalName: new FormControl(data?.modalName || null, [
        Validators.required,
      ]),
      name: new FormControl(data?.name || null, [Validators.required]),
      isNewArrival: new FormControl(true, [Validators.required]),
      isLive: new FormControl(false, [Validators.required]),
      hindiTranslation: new FormControl(data?.hindiTranslation || null),
      isInventoryStock: new FormControl(
        data?.isInventoryStock || isInventoryStock
      ),
      inventoryStoreId: new FormControl(
        data?.inventoryStoreId || inventoryStoreId
      ),

      //  isActive: new FormControl(this.data?.isActive || false, []),
      city: new FormControl(null),

      //  registractionNo: new FormControl(this.data?.registractionNo || null, []),
      yearOfManufactoring: new FormControl(
        Number(data?.yearOfManufactoring) || null,
        [Validators.required]
      ),
      discount: new FormControl(data?.discount || null),
      price: new FormControl(data?.price || null, []),
      discountedPrice: new FormControl(data?.discountedPrice || null),

      frontImage: new FormGroup({
        file: new FormControl(null, []),
        url: new FormControl(null),
      }),
      backImage: new FormGroup({
        file: new FormControl(null, []),
        url: new FormControl(null),
      }),
      leftImage: new FormGroup({
        file: new FormControl(null, []),
        url: new FormControl(null),
      }),
      displayImage: new FormGroup({
        file: new FormControl(null, []),
        url: new FormControl(null),
      }),
      rightImage: new FormGroup({
        file: new FormControl(null, []),
        url: new FormControl(null),
      }),
      actionByid: new FormControl(this.staffDetails?.staffCode, [
        Validators.required,
      ]),
      // tags: new FormArray([]),
      engine: this.fb.group({
        noOfCylinders: new FormControl(data?.engine?.noOfCylinders || null, [
          Validators.required,
        ]),
        hp: new FormControl(data?.engine?.hp || null, [Validators.required]),
        capacity: new FormControl(data?.engine?.capacity || null, [
          Validators.required,
        ]),
        engineRatedRpm: new FormControl(data?.engine?.engineRatedRpm || null, [
          Validators.required,
        ]),
        cooling: new FormControl(data?.engine?.cooling || null, [
          Validators.required,
        ]),
        airFilter: new FormControl(data?.engine?.airFilter || null, [
          Validators.required,
        ]),
        ptoHp: new FormControl(data?.engine?.ptoHp || null, [
          Validators.required,
        ]),
        fuelPump: new FormControl(data?.engine?.fuelPump || null, [
          Validators.required,
        ]),
        torque: new FormControl(data?.engine?.torque || null, [
          Validators.required,
        ]),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      transmission: this.fb.group({
        type: new FormControl(data?.transmission?.type || null, [
          Validators.required,
        ]),
        clutch: new FormControl(data?.transmission?.clutch || null, [
          Validators.required,
        ]),
        gearBox: new FormControl(data?.transmission?.gearBox || null, [
          Validators.required,
        ]),
        battery: new FormControl(data?.transmission?.battery || null, [
          Validators.required,
        ]),
        alternator: new FormControl(data?.transmission?.alternator || null, [
          Validators.required,
        ]),
        forwardSpeed: new FormControl(
          data?.transmission?.forwardSpeed || null,
          [Validators.required]
        ),
        reverseSpeed: new FormControl(
          data?.transmission?.reverseSpeed || null,
          [Validators.required]
        ),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      brakes: this.fb.group({
        brakes: new FormControl(data?.brakes?.brakes || null, [
          Validators.required,
        ]),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      steering: this.fb.group({
        type: new FormControl(data?.steering?.type || null, [
          Validators.required,
        ]),
        steeringColumn: new FormControl(
          data?.steering?.steeringColumn || null,
          [Validators.required]
        ),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      powertakeof: this.fb.group({
        type: new FormControl(data?.powertakeof?.type || null, [
          Validators.required,
        ]),
        rpm: new FormControl(data?.powertakeof?.rpm || null, [
          Validators.required,
        ]),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      fueltank: this.fb.group({
        capacity: new FormControl(data?.fueltank?.capacity || null, [
          Validators.required,
        ]),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      dimensionandwieght: this.fb.group({
        totalWeight: new FormControl(
          data?.dimensionandwieght?.totalWeight || null,
          [Validators.required]
        ),
        wheelBase: new FormControl(
          data?.dimensionandwieght?.wheelBase || null,
          [Validators.required]
        ),

        overallWidth: new FormControl(
          data?.dimensionandwieght?.overallWidth || null,
          [Validators.required]
        ),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      hydraulics: this.fb.group({
        liftingCapacity: new FormControl(
          data?.hydraulics?.liftingCapacity || null,
          [Validators.required]
        ),
        threePointLinkage: new FormControl(
          data?.hydraulics?.threePointLinkage || null,
          [Validators.required]
        ),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      wheelsandtyres: this.fb.group({
        wheelDrive: new FormControl(data?.wheelsandtyres?.wheelDrive || null, [
          Validators.required,
        ]),
        front: new FormControl(data?.wheelsandtyres?.front || null, [
          Validators.required,
        ]),
        rear: new FormControl(data?.wheelsandtyres?.rear || null, [
          Validators.required,
        ]),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      otherinformation: this.fb.group({
        accessories: new FormControl(
          data?.otherinformation?.accessories || null,
          [Validators.required]
        ),
        warranty: new FormControl(data?.otherinformation?.warranty || null, [
          Validators.required,
        ]),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      tractordetailadmin: this.fb.group({
        nameOfSeller: new FormControl(
          data?.tractordetailadmin?.nameOfSeller || null
        ),
        address: new FormControl(data?.tractordetailadmin?.address || null),
        // city: new FormControl(this.data?.tractordetailadmin?.city || null),
        contact1: new FormControl(data?.tractordetailadmin?.contact1 || null),
        contact2: new FormControl(data?.tractordetailadmin?.contact2 || null),
        brokerId: new FormControl(data?.tractordetailadmin?.brokerId || null),
        companyRepresentative: new FormControl(
          data?.tractordetailadmin?.companyRepresentative || null
        ),
        wareHouseLocation: new FormControl(
          data?.tractordetailadmin?.wareHouseLocation || null
        ),
        purchanseDate: new FormControl(
          data?.tractordetailadmin?.purchanseDate || null
        ),
        repairngCost: new FormControl(
          data?.tractordetailadmin?.repairngCost || null
        ),
        repairingCenter: new FormControl(
          data?.tractordetailadmin?.repairingCenter || null
        ),

        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
      purchasedetail: this.fb.group({
        nameOfSeller: new FormControl(
          data?.purchasedetail?.nameOfSeller || null
        ),
        address: new FormControl(data?.purchasedetail?.address || null),
        //city: new FormControl(this.data?.purchasedetail?.city || null),
        purchasePrice: new FormControl(
          data?.purchasedetail?.purchasePrice || null
        ),
        contact1: new FormControl(data?.purchasedetail?.contact1 || null),
        contact2: new FormControl(data?.purchasedetail?.contact2 || null),
        chasisNumber: new FormControl(
          data?.purchasedetail?.chasisNumber || null
        ),
        registrationNumber: new FormControl(
          data?.purchasedetail?.registrationNumber || null
        ),
        engineNumber: new FormControl(
          data?.purchasedetail?.engineNumber || null
        ),
        typeOfPurchase: new FormControl(
          data?.purchasedetail?.typeOfPurchase || null
        ),
        companyRepresentative: new FormControl(
          data?.purchasedetail?.companyRepresentative || null
        ),

        purchanseDate: new FormControl(
          data?.purchasedetail?.purchanseDate || null
        ),

        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
        bankNameAuction: new FormControl(
          data?.purchasedetail?.bankNameAuction || null
        ),
        parkLocation: new FormControl(
          data?.purchasedetail?.parkLocation || null
        ),
        expectedDateOfArrival: new FormControl(
          data?.purchasedetail?.expectedDateOfArrival || null
        ),
        amountTransferDate: new FormControl(
          data?.purchasedetail?.amountTransferDate || null
        ),
      }),
      inspection: this.fb.group({
        bumper: new FormControl(data?.inspection?.bumper || null, []),
        headLight: new FormControl(data?.inspection?.headLight || null, []),
        bumperGril: new FormControl(data?.inspection?.bumperGril || null, []),
        brandLogo: new FormControl(data?.inspection?.brandLogo || null, []),
        frontAxe: new FormControl(data?.inspection?.frontAxe || null, []),
        mufflerSpark: new FormControl(
          data?.inspection?.mufflerSpark || null,
          []
        ),
        tractorTrolley: new FormControl(
          data?.inspection?.tractorTrolley || null,
          []
        ),
        tyreFrontRight: new FormControl(
          data?.inspection?.tyreFrontRight || null,
          []
        ),
        tyreFrontLeft: new FormControl(
          data?.inspection?.tyreFrontLeft || null,
          []
        ),
        tyreBackRight: new FormControl(
          data?.inspection?.tyreBackRight || null,
          []
        ),
        tyreBackLeft: new FormControl(
          data?.inspection?.tyreBackLeft || null,
          []
        ),
        gearShiftLever: new FormControl(
          data?.inspection?.gearShiftLever || null,
          []
        ),
        highSpeedShiftLever: new FormControl(
          data?.inspection?.highSpeedShiftLever || null,
          []
        ),
        runningBoard: new FormControl(
          data?.inspection?.runningBoard || null,
          []
        ),
        seats: new FormControl(data?.inspection?.seats || null, []),
        seatFunction: new FormControl(
          data?.inspection?.seatFunction || null,
          []
        ),
        steeringWheel: new FormControl(
          data?.inspection?.steeringWheel || null,
          []
        ),
        dashboard: new FormControl(data?.inspection?.dashboard || null, []),
        acceleratorPedal: new FormControl(
          data?.inspection?.acceleratorPedal || null,
          []
        ),
        acceleratorPedalPlay: new FormControl(
          data?.inspection?.acceleratorPedalPlay || null,
          []
        ),
        breakPedal: new FormControl(data?.inspection?.breakPedal || null, []),
        breakPedalPlay: new FormControl(
          data?.inspection?.breakPedalPlay || null,
          []
        ),
        clutchPedal: new FormControl(data?.inspection?.clutchPedal || null, []),
        clutchPedalPlay: new FormControl(
          data?.inspection?.clutchPedalPlay || null,
          []
        ),
        starts: new FormControl(data?.inspection?.starts || null, []),
        driveForward: new FormControl(
          data?.inspection?.driveForward || null,
          []
        ),
        driveBackward: new FormControl(
          data?.inspection?.driveBackward || null,
          []
        ),
        engine: new FormControl(data?.inspection?.engine || null, []),
        driveTrain: new FormControl(data?.inspection?.driveTrain || null, []),
        engineComartmentCondition: new FormControl(
          data?.inspection?.engineComartmentCondition || null,
          []
        ),
        suspension: new FormControl(data?.inspection?.suspension || null, []),
        leakageInHydraulics: new FormControl(
          data?.inspection?.leakageInHydraulics || null,
          []
        ),
        powerTakeOf: new FormControl(data?.inspection?.powerTakeOf || null, []),
        hosesDamaged: new FormControl(
          data?.inspection?.hosesDamaged || null,
          []
        ),
        detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
        actionByid: new FormControl(this.staffDetails?.staffCode, [
          Validators.required,
        ]),
      }),
    });
    return modelForm
        console.log('modelForm', modelForm.value);
    //  if (this.data?.images?.length) {
    //    this.loadedImages = this.data?.images;
    //  }
  }
}
