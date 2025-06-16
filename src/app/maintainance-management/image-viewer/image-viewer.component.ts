import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoService } from 'src/app/photo.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { SingleImageShowComponent } from '../single-image-show/single-image-show.component';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit {
  tarctor_id: any;
  imageGroup: any;
  uploadPhoto: any=true;
  showHeading:'Available Images'
  showDeleteButton: any=false;
  apiName:any='saveRawImages'
  getApiName:any='getRawImages'
  callApi: any=true;
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
    if(this.callApi){
      this.imageArray = [];
      this.getRawImages()
    }

  }
  addPhotoToGallery() {
    let image: any = this.addNewToGallery(this.imageArray);
   // let image: any = this.addNewToGalleryNew(this.imageArray);

   
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
    originalImageUrl?: string;
  compressedImageUrl?: string;
  originalSizeKB = 0;
  compressedSizeKB = 0;
   public async addNewToGalleryNew(imageArray: any = []) {
    // Take a photo
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      quality: 100,
    });

     const originalBlob = this.dataURLtoBlob(photo.dataUrl!);
      this.originalSizeKB = +(originalBlob.size / 1024).toFixed(2);
      this.originalImageUrl = photo.dataUrl;

      const compressedBlob = await this.compressBase64Image(photo.dataUrl!, 200);
      this.compressedSizeKB = +(compressedBlob.size / 1024).toFixed(2);
      this.compressedImageUrl = URL.createObjectURL(compressedBlob);
console.log("  this.compressedImageUrl",  this.compressedImageUrl,compressedBlob);

    //let file=this.blobToFile(capturedPhoto.webPath,"file")
  //  const savedImageFile = await this.savePicture(capturedPhoto);
   // this.capturedPhoto = capturedPhoto;

   // console.log('addNewToGallery', imageArray, savedImageFile);
  }
    dataURLtoBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }
compressBase64Image(base64: string, maxSizeKB: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let { width, height } = img;

      const MAX_WIDTH = 800;
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      let quality = 0.9;
      const tryCompress = () => {
        canvas.toBlob((blob: any) => {
          if (!blob) return reject('Blob generation failed');
          if (blob.size / 1024 <= maxSizeKB || quality < 0.1) {
            resolve(blob);
          } else {
            quality -= 0.1;
            tryCompress();
          }
        }, 'image/jpeg', quality);
      };

      tryCompress();
    };

    img.onerror = (e) => {
      console.error('Image failed to load', e);
      reject(e);
    };

    img.src = base64;
  });
}
  compressImage(blob: Blob, maxSizeKB: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = reject;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        let { width, height } = img;

        const MAX_WIDTH = 800;
        if (width > MAX_WIDTH) {
          height = height * (MAX_WIDTH / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;

        const tryCompress = () => {
          canvas.toBlob(
            (result) => {
              if (!result) return reject('Compression failed');

              if (result.size / 1024 <= maxSizeKB || quality < 0.1) {
                resolve(result);
              } else {
                quality -= 0.1;
                tryCompress();
              }
            },
            'image/jpeg',
            quality
          );
        };

        tryCompress();
      };

      img.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
  imageSize:any
  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format

    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const sizeInBytes = blob.size;
const sizeInKB = sizeInBytes / 1024;
this.imageSize=sizeInKB.toFixed(2)
console.log(`Image size: ${sizeInKB.toFixed(2)} KB`);

    return (await this.convertBlobToBase64(blob)) as string;
  }

  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
     
        this.renderResult = reader.result;
        if(this.imageSize<=150){
     this.saveDataTo()
        }else{
          this.share.presentToast("Image is larger than 200 kb")
        }
   
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
      tractor_id: this.tarctor_id,
      actionByid: this.staffDetails?.id,
      imageGroup: this.imageGroup,

    };
    this.share.showLoading('Uploading...',10000);
    this.api.postapi(this.apiName, obj).subscribe((res: any) => {
      console.log("saveDataTo",res);
      this.imageArray.push(res?.data)
      this.share.spinner.dismiss();
      this.share.presentToast("Uploaded Successfully...")
    });
  }
  getRawImages(){
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj = {
      operate: this.staffDetails?.staffCode,
      
      tractor_id: this.tarctor_id,
    };
    this.share.showLoading('Fetching Data...');
    this.api.postapi(this.getApiName, obj).subscribe((res: any) => {
      console.log("data",res);
      this.imageArray=res?.data || []
      this.imageArray= this.imageArray.filter((f:any)=>f.imageGroup==this.imageGroup)
      this.share.spinner.dismiss();
 
    });
  }
  async viewImage(image:any){
    const modal = await this.modalCtrl.create({
      component: SingleImageShowComponent,
      componentProps: {
     showDeleteButton:this.showDeleteButton,
        image: image,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
if(data?.isDeleted){
  this.getRawImages()
}
    if (role === 'confirm') {
   
    }
  }
  
}
