import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-add-new-arrivals',
  templateUrl: './add-new-arrivals.component.html',
  styleUrls: ['./add-new-arrivals.component.scss'],
})
export class AddNewArrivalsComponent  implements OnInit {

  constructor(private router:Router,private share:ShareService,private api:ApiService,private fb:FormBuilder) { }

  ngOnInit() {
    //this.getModelList()
  }
  cityList:any=[]
  getCityList(loader: any = false) {
  
    let obj = this.share.getListObj('city', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res:any) => {
        this.cityList = res.data;
       
      },
      (error:any) => {
     
      }
    );
  }
  companyRepresentativeList: any = [];
  getCompanyRepresentativeList(loader: any = false) {

    let obj = this.share.getListObj('companyrepresentative', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res:any) => {
        this.companyRepresentativeList = res.data;
       
      },
      (error:any) => {
     
      }
    );
  }
  typePurchaseList:any=[]
  getPurchaseList(loader: any = false) {

    let obj = this.share.getListObj('purchasetype', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res:any) => {
        this.typePurchaseList = res.data;
     
      },
      (error:any) => {
      
      }
    );
  }
  staffDetails:any
  ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.getModelList()
    this.getCityList()
    this.getPurchaseList()
    this.getCompanyRepresentativeList()
    this.initialize()
  }
  backToNewArrivals(){
    this.router.navigate(['operational/new-arrivals'])
  }
  data:any
  selectedModel:any
  modelForm:FormGroup
  setModelDetail(data:any) {
    this.modelForm.controls['brandID'].setValue(data?.brandID);
    this.modelForm.controls['brandName'].setValue(data?.brandName);
    this.modelForm.controls['modalID'].setValue(data?.id);
    this.modelForm.controls['modalName'].setValue(data?.name);
    this.modelForm.controls['name'].setValue(data?.name);
    let engine = this.modelForm.controls['engine'] as FormGroup;
    engine.controls['noOfCylinders'].setValue(data?.engine?.noOfCylinders);
    engine.controls['hp'].setValue(data?.engine?.hp);
    engine.controls['capacity'].setValue(data?.engine?.capacity);
    engine.controls['engineRatedRpm'].setValue(data?.engine?.engineRatedRpm);
    engine.controls['cooling'].setValue(data?.engine?.cooling);
    engine.controls['airFilter'].setValue(data?.engine?.airFilter);
    engine.controls['ptoHp'].setValue(data?.engine?.ptoHp);
    engine.controls['fuelPump'].setValue(data?.engine?.fuelPump);
    engine.controls['torque'].setValue(data?.engine?.torque);
    let transmission = this.modelForm.controls['transmission'] as FormGroup;
    transmission.controls['type'].setValue(data?.transmission?.type);
    transmission.controls['clutch'].setValue(data?.transmission?.clutch);
    transmission.controls['gearBox'].setValue(data?.transmission?.gearBox);
    transmission.controls['battery'].setValue(data?.transmission?.battery);
    transmission.controls['alternator'].setValue(data?.transmission?.alternator);
    transmission.controls['forwardSpeed'].setValue(
      data?.transmission?.forwardSpeed
    );
    transmission.controls['reverseSpeed'].setValue(
      data?.transmission?.reverseSpeed
    );
    let brakes = this.modelForm.controls['brakes'] as FormGroup;
    brakes.controls['brakes'].setValue(data?.brakes?.brakes);
    let steering = this.modelForm.controls['steering'] as FormGroup;
    steering.controls['type'].setValue(data?.steering?.type);
    steering.controls['steeringColumn'].setValue(data?.steering?.steeringColumn);
    let powertakeof = this.modelForm.controls['powertakeof'] as FormGroup;
    powertakeof.controls['type'].setValue(data?.powertakeof?.type);
    powertakeof.controls['rpm'].setValue(data?.powertakeof?.rpm);
    let fueltank = this.modelForm.controls['fueltank'] as FormGroup;
    fueltank.controls['capacity'].setValue(data?.fueltank?.capacity);
    let dimensionandwieght = this.modelForm.controls['dimensionandwieght'] as FormGroup;
    dimensionandwieght.controls['totalWeight'].setValue(
      data?.dimensionandwieght?.totalWeight
    );
    dimensionandwieght.controls['wheelBase'].setValue(
      data?.dimensionandwieght?.wheelBase
    );
    dimensionandwieght.controls['overallWidth'].setValue(
      data?.dimensionandwieght?.overallWidth
    );
    let hydraulics = this.modelForm.controls['hydraulics'] as FormGroup;
    hydraulics.controls['liftingCapacity'].setValue(
      data?.hydraulics?.liftingCapacity
    );
    hydraulics.controls['threePointLinkage'].setValue(
      data?.hydraulics?.threePointLinkage
    );
    let wheelsandtyres = this.modelForm.controls['wheelsandtyres'] as FormGroup;
    wheelsandtyres.controls['wheelDrive'].setValue(
      data?.wheelsandtyres?.wheelDrive
    );
    wheelsandtyres.controls['front'].setValue(data?.wheelsandtyres?.front);
    wheelsandtyres.controls['rear'].setValue(data?.wheelsandtyres?.rear);
    let otherinformation = this.modelForm.controls
      ['otherinformation'] as FormGroup;
    otherinformation.controls['accessories'].setValue(
      data?.otherinformation?.accessories
    );
    otherinformation.controls['warranty'].setValue(
      data?.otherinformation?.warranty
    );
    console.log("modelForm",this.modelForm.value);
  //  this.selectedTab='BASIC_INFO'
    
  }
  initialize() {
    // console.log("this.data",this.data.purchasedetail);
     
     this.modelForm = this.fb.group({
       brandID: new FormControl(this.data?.brandID || null, [
         Validators.required,
       ]),
       brandName: new FormControl(this.data?.brandName || null, [
         Validators.required,
       ]),
       tractor_status: new FormControl("NEW_ARRIVAL", [
         Validators.required,
       ]),
       modalID: new FormControl(this.data?.modalID || null, [
         Validators.required,
       ]),
   
       
       hours: new FormControl(this.data?.hours || null, [
         Validators.required,
       ]),
       modalName: new FormControl(this.data?.modalName || null, [
         Validators.required,
       ]),
       name: new FormControl(this.data?.name || null, [Validators.required]),
       isNewArrival: new FormControl(true, [Validators.required]),
       isLive: new FormControl(false, [Validators.required]),
       hindiTranslation: new FormControl(this.data?.hindiTranslation || null),
       
       //  isActive: new FormControl(this.data?.isActive || false, []),
       city: new FormControl(this.data?.city || null, [Validators.required]),
 
       registractionNo: new FormControl(this.data?.registractionNo || null, []),
       yearOfManufactoring: new FormControl(
         this.data?.yearOfManufactoring || null,
         [Validators.required]
       ),
       discount: new FormControl(this.data?.discount || null),
       price: new FormControl(this.data?.price || null, [Validators.required]),
       discountedPrice: new FormControl(this.data?.discountedPrice || null),
 
       frontImage: new FormGroup({
         file: new FormControl(null, []),
         url: new FormControl(this?.data?.frontImageUrl || null),
       }),
       backImage: new FormGroup({
         file: new FormControl(null, []),
         url: new FormControl(this?.data?.backImageUrl || null),
       }),
       leftImage: new FormGroup({
         file: new FormControl(null, []),
         url: new FormControl(this?.data?.leftImageUrl || null),
       }),
       displayImage: new FormGroup({
         file: new FormControl(null, []),
         url: new FormControl(this?.data?.displayImageUrl || null),
       }),
       rightImage: new FormGroup({
         file: new FormControl(null, []),
         url: new FormControl(this?.data?.rightImageUrl || null),
       }),
       actionByid: new FormControl(this.staffDetails?.staffCode, [
         Validators.required,
       ]),
       // tags: new FormArray([]),
       engine: this.fb.group({
         noOfCylinders: new FormControl(
           this.data?.engine?.noOfCylinders || null,
           [Validators.required]
         ),
         hp: new FormControl(this.data?.engine?.hp || null, [
           Validators.required,
         ]),
         capacity: new FormControl(this.data?.engine?.capacity || null, [
           Validators.required,
         ]),
         engineRatedRpm: new FormControl(
           this.data?.engine?.engineRatedRpm || null,
           [Validators.required]
         ),
         cooling: new FormControl(this.data?.engine?.cooling || null, [
           Validators.required,
         ]),
         airFilter: new FormControl(this.data?.engine?.airFilter || null, [
           Validators.required,
         ]),
         ptoHp: new FormControl(this.data?.engine?.ptoHp || null, [
           Validators.required,
         ]),
         fuelPump: new FormControl(this.data?.engine?.fuelPump || null, [
           Validators.required,
         ]),
         torque: new FormControl(this.data?.engine?.torque || null, [
           Validators.required,
         ]),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       transmission: this.fb.group({
         type: new FormControl(this.data?.transmission?.type || null, [
           Validators.required,
         ]),
         clutch: new FormControl(this.data?.transmission?.clutch || null, [
           Validators.required,
         ]),
         gearBox: new FormControl(this.data?.transmission?.gearBox || null, [
           Validators.required,
         ]),
         battery: new FormControl(this.data?.transmission?.battery || null, [
           Validators.required,
         ]),
         alternator: new FormControl(
           this.data?.transmission?.alternator || null,
           [Validators.required]
         ),
         forwardSpeed: new FormControl(
           this.data?.transmission?.forwardSpeed || null,
           [Validators.required]
         ),
         reverseSpeed: new FormControl(
           this.data?.transmission?.reverseSpeed || null,
           [Validators.required]
         ),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       brakes: this.fb.group({
         brakes: new FormControl(this.data?.brakes?.brakes || null, [
           Validators.required,
         ]),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       steering: this.fb.group({
         type: new FormControl(this.data?.steering?.type || null, [
           Validators.required,
         ]),
         steeringColumn: new FormControl(
           this.data?.steering?.steeringColumn || null,
           [Validators.required]
         ),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       powertakeof: this.fb.group({
         type: new FormControl(this.data?.powertakeof?.type || null, [
           Validators.required,
         ]),
         rpm: new FormControl(this.data?.powertakeof?.rpm || null, [
           Validators.required,
         ]),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       fueltank: this.fb.group({
         capacity: new FormControl(this.data?.fueltank?.capacity || null, [
           Validators.required,
         ]),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       dimensionandwieght: this.fb.group({
         totalWeight: new FormControl(
           this.data?.dimensionandwieght?.totalWeight || null,
           [Validators.required]
         ),
         wheelBase: new FormControl(
           this.data?.dimensionandwieght?.wheelBase || null,
           [Validators.required]
         ),
 
         overallWidth: new FormControl(
           this.data?.dimensionandwieght?.overallWidth || null,
           [Validators.required]
         ),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       hydraulics: this.fb.group({
         liftingCapacity: new FormControl(
           this.data?.hydraulics?.liftingCapacity || null,
           [Validators.required]
         ),
         threePointLinkage: new FormControl(
           this.data?.hydraulics?.threePointLinkage || null,
           [Validators.required]
         ),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       wheelsandtyres: this.fb.group({
         wheelDrive: new FormControl(
           this.data?.wheelsandtyres?.wheelDrive || null,
           [Validators.required]
         ),
         front: new FormControl(this.data?.wheelsandtyres?.front || null, [
           Validators.required,
         ]),
         rear: new FormControl(this.data?.wheelsandtyres?.rear || null, [
           Validators.required,
         ]),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       otherinformation: this.fb.group({
         accessories: new FormControl(
           this.data?.otherinformation?.accessories || null,
           [Validators.required]
         ),
         warranty: new FormControl(
           this.data?.otherinformation?.warranty || null,
           [Validators.required]
         ),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       tractordetailadmin: this.fb.group({
         nameOfSeller: new FormControl(
           this.data?.tractordetailadmin?.nameOfSeller || null
         ),
         address: new FormControl(
           this.data?.tractordetailadmin?.address || null
         ),
         city: new FormControl(this.data?.tractordetailadmin?.city || null),
         contact1: new FormControl(
           this.data?.tractordetailadmin?.contact1 || null
         ),
         contact2: new FormControl(
           this.data?.tractordetailadmin?.contact2 || null
         ),
         brokerId: new FormControl(
           this.data?.tractordetailadmin?.brokerId || null
         ),
         companyRepresentative: new FormControl(
           this.data?.tractordetailadmin?.companyRepresentative || null
         ),
         wareHouseLocation: new FormControl(
           this.data?.tractordetailadmin?.wareHouseLocation || null
         ),
         purchanseDate: new FormControl(
           this.data?.tractordetailadmin?.purchanseDate || null
         ),
         repairngCost: new FormControl(
           this.data?.tractordetailadmin?.repairngCost || null
         ),
         repairingCenter: new FormControl(
           this.data?.tractordetailadmin?.repairingCenter || null
         ),
 
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       purchasedetail: this.fb.group({
         nameOfSeller: new FormControl(
           this.data?.purchasedetail?.nameOfSeller || null
         ),
         address: new FormControl(
           this.data?.purchasedetail?.address || null
         ),
         city: new FormControl(this.data?.purchasedetail?.city || null),
         purchasePrice: new FormControl(this.data?.purchasedetail?.purchasePrice || null),
         contact1: new FormControl(
           this.data?.purchasedetail?.contact1 || null
         ),
         contact2: new FormControl(
           this.data?.purchasedetail?.contact2 || null
         ),
         chasisNumber: new FormControl(
           this.data?.purchasedetail?.chasisNumber || null
         ),
         registrationNumber: new FormControl(
           this.data?.purchasedetail?.registrationNumber || null
         ),
         engineNumber: new FormControl(
           this.data?.purchasedetail?.engineNumber || null
         ),
         typeOfPurchase: new FormControl(
           this.data?.purchasedetail?.typeOfPurchase || null
         ),
         companyRepresentative: new FormControl(
           this.data?.purchasedetail?.companyRepresentative || null
         ),
 
       
         purchanseDate: new FormControl(
           this.data?.purchasedetail?.purchanseDate || null
         ),
      
 
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
       inspection: this.fb.group({
         bumper: new FormControl(this.data?.inspection?.bumper || null, []),
         headLight: new FormControl(
           this.data?.inspection?.headLight || null,
           []
         ),
         bumperGril: new FormControl(
           this.data?.inspection?.bumperGril || null,
           []
         ),
         brandLogo: new FormControl(
           this.data?.inspection?.brandLogo || null,
           []
         ),
         frontAxe: new FormControl(this.data?.inspection?.frontAxe || null, []),
         mufflerSpark: new FormControl(
           this.data?.inspection?.mufflerSpark || null,
           []
         ),
         tractorTrolley: new FormControl(
           this.data?.inspection?.tractorTrolley || null,
           []
         ),
         tyreFrontRight: new FormControl(
           this.data?.inspection?.tyreFrontRight || null,
           []
         ),
         tyreFrontLeft: new FormControl(
           this.data?.inspection?.tyreFrontLeft || null,
           []
         ),
         tyreBackRight: new FormControl(
           this.data?.inspection?.tyreBackRight || null,
           []
         ),
         tyreBackLeft: new FormControl(
           this.data?.inspection?.tyreBackLeft || null,
           []
         ),
         gearShiftLever: new FormControl(
           this.data?.inspection?.gearShiftLever || null,
           []
         ),
         highSpeedShiftLever: new FormControl(
           this.data?.inspection?.highSpeedShiftLever || null,
           []
         ),
         runningBoard: new FormControl(
           this.data?.inspection?.runningBoard || null,
           []
         ),
         seats: new FormControl(this.data?.inspection?.seats || null, []),
         seatFunction: new FormControl(
           this.data?.inspection?.seatFunction || null,
           []
         ),
         steeringWheel: new FormControl(
           this.data?.inspection?.steeringWheel || null,
           []
         ),
         dashboard: new FormControl(
           this.data?.inspection?.dashboard || null,
           []
         ),
         acceleratorPedal: new FormControl(
           this.data?.inspection?.acceleratorPedal || null,
           []
         ),
         acceleratorPedalPlay: new FormControl(
           this.data?.inspection?.acceleratorPedalPlay || null,
           []
         ),
         breakPedal: new FormControl(
           this.data?.inspection?.breakPedal || null,
           []
         ),
         breakPedalPlay: new FormControl(
           this.data?.inspection?.breakPedalPlay || null,
           []
         ),
         clutchPedal: new FormControl(
           this.data?.inspection?.clutchPedal || null,
           []
         ),
         clutchPedalPlay: new FormControl(
           this.data?.inspection?.clutchPedalPlay || null,
           []
         ),
         starts: new FormControl(this.data?.inspection?.starts || null, []),
         driveForward: new FormControl(
           this.data?.inspection?.driveForward || null,
           []
         ),
         driveBackward: new FormControl(
           this.data?.inspection?.driveBackward || null,
           []
         ),
         engine: new FormControl(this.data?.inspection?.engine || null, []),
         driveTrain: new FormControl(
           this.data?.inspection?.driveTrain || null,
           []
         ),
         engineComartmentCondition: new FormControl(
           this.data?.inspection?.engineComartmentCondition || null,
           []
         ),
         suspension: new FormControl(
           this.data?.inspection?.suspension || null,
           []
         ),
         leakageInHydraulics: new FormControl(
           this.data?.inspection?.leakageInHydraulics || null,
           []
         ),
         powerTakeOf: new FormControl(
           this.data?.inspection?.powerTakeOf || null,
           []
         ),
         hosesDamaged: new FormControl(
           this.data?.inspection?.hosesDamaged || null,
           []
         ),
         detailsType: new FormControl('TRACTOR_DETAILS', [Validators.required]),
         actionByid: new FormControl(this.staffDetails?.staffCode, [
           Validators.required,
         ]),
       }),
     });
    //  if (this.data?.images?.length) {
    //    this.loadedImages = this.data?.images;
    //  }
   }
selectedTab='MODEL'
selectTab(tab:any){
this.selectedTab=tab
}
modelList:any=[]
getModelList() {
  this.modelList =[]
  let obj = this.share.getListObj('model', true, ['logo'], false);
  this.share.showLoading('Loading...')
  this.api.postapi('getModelDataSanitized', obj).subscribe(
    (res:any) => {
  
      this.modelList = res.data;
      this.share?.spinner?.dismiss()
    },
    (error:any) => {
    
    }
  );
}
goToPage(tab:any){
  this.selectedTab=tab
//   if(tab=='MODEL'){
//   this.selectedTab=tab
//   }else{
//     if(this.selectedModel){
//       this.selectedTab=tab
//     }else{
//       this.selectedTab='MODEL'
// this.share.presentToast("Please Select Model")
//     }
//   }

  }
  saveForm(){
    console.log("saveForm",this.modelForm.value);
    
  }
}
