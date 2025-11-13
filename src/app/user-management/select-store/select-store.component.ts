import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-select-store',
  templateUrl: './select-store.component.html',
  styleUrls: ['./select-store.component.scss'],
})
export class SelectStoreComponent  implements OnInit {
  constructor(private modalcontrol:ModalController,private share:ShareService) { }
selectedStore:any
staffDetails:any
stores:any=[]
  ngOnInit() {

    let stores=this.share.get_sales_officer_storeList()
    if(stores!=null){
      this.stores=JSON.parse(stores)
    }
        let selectedStore=this.share.get_sales_officer_store()
    if(selectedStore!=null){
      this.selectedStore=JSON.parse(selectedStore)?.store_id
    }
    
    console.log(" this.roles ", this.stores ,typeof( this.stores));

  }
  selectFilter(){
    let store=this.stores.find((f:any)=>f.store_id==this.selectedStore)
    this.modalcontrol.dismiss({selectedStore:store,isStoreChange:true})
  }
  
}
