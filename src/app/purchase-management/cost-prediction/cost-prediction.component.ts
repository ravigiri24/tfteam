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
import { PhotoService } from 'src/app/photo.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
@Component({
  selector: 'app-cost-prediction',
  templateUrl: './cost-prediction.component.html',
  styleUrls: ['./cost-prediction.component.scss'],
})
export class CostPredictionComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCntrol: ModalController,
    public photoService: PhotoService,
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.initialize();
    this.getBrandList();
    this.createYearArray();
    this.getValuation();
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
  getPriceEstimate() {
    if(this.form.valid){
    this.share.showLoading("Checking")
    let date = new Date();
    let currentYear = date.getFullYear();
    let previousYear=currentYear-1
    let yearForPrice=this.form.controls['year'].value
    let currentPrice=this.form.controls['current_price'].value
    let lastYearPrice=Number(currentPrice)*0.8
    let deduction=0.95
    for (let index = previousYear-1; index >= yearForPrice; index--) {
    
      lastYearPrice=lastYearPrice*deduction
      lastYearPrice=Number(lastYearPrice.toFixed(0))
     console.log("index",index,lastYearPrice,deduction);
     deduction= Number((Number(deduction)-0.05).toFixed(2))
    }
    let getTyreCondition=this.form.controls['tyreCondition'].value
    if(getTyreCondition=='Poor'){
      lastYearPrice=Number(lastYearPrice)-50000
    }
    else if(getTyreCondition=='Average'){
      lastYearPrice=Number(lastYearPrice)-25000
    }
    else if(getTyreCondition=='Good'){
      lastYearPrice=Number(lastYearPrice)-12500
    }
    let getBodyCondition=this.form.controls['bodyCondition'].value
    if(getBodyCondition=='Poor'){
      lastYearPrice=Number(lastYearPrice)-50000
    }
    else if(getBodyCondition=='Average'){
      lastYearPrice=Number(lastYearPrice)-25000
    }
    else if(getBodyCondition=='Good'){
      lastYearPrice=Number(lastYearPrice)-12500
    }
this.form.controls['selectedyearPrice'].setValue(lastYearPrice)

setTimeout(() => {
  this.share.spinner.dismiss()
}, 300);
    }else{
      this.share.presentToast("Please fill all Fields")
    }
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
      current_price: new FormControl(this.data?.current_price || null, [
        Validators.required,
      ]),
      year: new FormControl(currentYear-1 || null, [Validators.required]),
      tyreCondition: new FormControl( 'Good', [Validators.required]),
      bodyCondition: new FormControl('Good', [Validators.required]),
      selectedyearPrice: new FormControl(this.data?.selectedyearPrice || null, []),
    });
  }
  brandList: any = [];
  data: any;
  form: FormGroup;

  valuationList: any = [];
  getValuation() {
    let obj = this.share.getListObj('getValuation', false, [], false);
    this.api.postapi('getValuation', obj).subscribe(
      (res: any) => {
        this.valuationList = res?.data;
        console.log('valuationList', this.valuationList);
      },
      (error: any) => {}
    );
  }
  async viewImage(image:any){
    const modal = await this.modalCntrol.create({
      component: SingleImageShowComponent,
      componentProps: {
     
        image: image,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
   
    }
  }
  imageArray:any=[]
  addPhotoToGallery() {
    let image: any = this.addNewToGallery(this.imageArray);

   
  }
  blobToFile(theBlob: any, fileName: any) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    // theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }
  public async addNewToGallery(imageArray: any = []) {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,

      source: CameraSource.Camera,
      quality: 100,
    });

    //let file=this.blobToFile(capturedPhoto.webPath,"file")
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.capturedPhoto = capturedPhoto;
    this.imageArray.push({imageUrlUrl:savedImageFile?.webviewPath})
    console.log('addNewToGallery', imageArray, savedImageFile,);
  }
  capturedPhoto: any;
  async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  }
  renderResult:any
  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return (await this.convertBlobToBase64(blob)) as string;
  }
  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
     
        this.renderResult = reader.result;
       // this.saveDataTo()
        console.log('reader.result', reader.result,blob);
      };
      reader.readAsDataURL(blob);
    });

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
        //  this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
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
  resetPrice(){
   this.resetPrediction()
    let getModel=this.valuationList.find((f:any)=>f.model_id==this.form.controls['model_id'].value)
    if(getModel){
      this.form.controls['current_price'].setValue(getModel?.model_current_price||0)
    }else{
     // this.form.controls['current_price'].setValue(0)
    }
  }
  resetPrediction(){
    this.form.controls['selectedyearPrice'].setValue(null);
  }
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
    this.resetPrice()
  }
}
