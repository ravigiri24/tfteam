import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-transport-management',
  templateUrl: './transport-management.component.html',
  styleUrls: ['./transport-management.component.scss'],
})
export class TransportManagementComponent  implements OnInit {
  constructor(private alertCtrl:AlertController,private share:ShareService,private api:ApiService,private route:Router) { }


  ngOnInit() {}
  transportList:any=[]
  ionViewWillEnter() {
    this.transportList = [];
    this.getTractorList()
  }
  async showAlert(tractor:any,i:any) {  
    const alert = await this.alertCtrl.create({  
      header: 'Are you sure?',  
      subHeader: '',  
      message: 'You want to Start the trasportation!',  
      buttons: ['Yes,Transport It!','Cancel']  
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
 if(!result?.role){
this.startTransport(tractor)
 }
    console.log(result);  
  }  
  startTransport(tractor:any) {
    let obj;

      obj = {
        data:{tractor_status:"AT_TRANSPORT"},
        src:'tractor',
        id: tractor?.id,
      };

 
      this.api.postapi('updateOpp', obj).subscribe(
        (res:any) => {
       
          this.getTractorList()
      
        },
        (error:any) => {
       
        }
      );
   
  }
 // newArivalsList:any=[]
  backupList:any=[]
  userDetails:any
  staffDetails:any
  goToNewArival(data:any=null){
this.route.navigate(['/operational/add-new-arrivals'])
  }
  addCost(tractor:any,i:any){
    this.route.navigate(['/operational/add-cost',tractor?.id])
    
 

  }
  getTractorList() {

    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
 
    let obj={
      operate:this.staffDetails?.staffCode,
      isLive:false
    }
    this.share.showLoading('Loading...')
    this.api.postapi('getTractorList', obj).subscribe(
      (res:any) => {
     
        this.transportList = res.data;
       // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        this.transportList=this.transportList.filter((f:any)=>f?.tractor_status=='AT_TRANSPORT')
      
        this.share.spinner.dismiss()
        this.backupList = res.data;
      },
      (error:any) => {
  
      }
    );
  }
  refreshList(){
this.getTractorList()
  }
  dataClear(){

  }
}