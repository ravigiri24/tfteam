import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoService } from 'src/app/photo.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { SingleImageShowComponent } from '../maintainance-management/single-image-show/single-image-show.component';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-sell-document',
  templateUrl: './sell-document.component.html',
  styleUrls: ['./sell-document.component.scss'],
})
export class SellDocumentComponent  implements OnInit {

  tractorDetail: any;

  constructor(
    public photoService: PhotoService,
    private modalControl: ModalController,
    private share: ShareService,
    private api: ApiService,
    private modalCtrl:ModalController
  ) {}
  dismiss() {
    this.modalControl.dismiss();
  }
  imageArray: any = [];
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    if(!this.staffDetails?.id){
this.share.checkLogin()
    }
    this.imageArray = [];
    this.getRawImages()
  }
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

    console.log('addNewToGallery', imageArray, savedImageFile);
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
        this.saveDataTo()
        console.log('reader.result', reader.result);
      };
      reader.readAsDataURL(blob);
    });
  staffDetails: any;
  renderResult: any;
  saveDataTo() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      imageObj: this.renderResult,
      referencedId: this.tractorDetail?.sellingDetailedId,
      actionByid: this.staffDetails?.id,
     

    };
    this.share.showLoading('Uploading...',10000);
    this.api.postapi('addSellsDocument', obj).subscribe((res: any) => {
      console.log("addSellsDocument",res);
      let obje:any=res?.data
       obje.url=res?.data?.imageUrlUrl
      this.imageArray.push(obje)
      this.share.spinner.dismiss();
      this.share.presentToast("Uploaded Successfully...")
    });
  }
  getRawImages(){
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj = {
      operate: this.staffDetails?.staffCode,
      
      sell_id: this.tractorDetail?.sellingDetailedId,
    };
    this.share.showLoading('Fetching Data...');
    this.api.postapi('getSellsDocument', obj).subscribe((res: any) => {
      console.log("data",res);
      this.imageArray=res?.data || []

      this.share.spinner.dismiss();
 
    });
  }
  async viewImage(image:any){
    const modal = await this.modalCtrl.create({
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

}
