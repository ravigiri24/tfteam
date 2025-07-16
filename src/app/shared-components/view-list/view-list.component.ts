import { Component, OnInit,Input, EventEmitter,Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss'],
})
export class ViewListComponent  implements OnInit {
@Input() search:any
@Input() searchKey:any
@Input() width:any=60
@Input() list:any=[]
@Input() keyList:any=[]
@Input() buttonArray:any=[]
@Output() actionEventCall=new EventEmitter()
  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {
    console.log("ViewListComponent",this.list,this.search,this.searchKey);
    
  }
actionEvent(tractor:any,button:any){
  this.actionEventCall.emit({tractor,button})
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
