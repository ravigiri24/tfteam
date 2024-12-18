import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddMaterialComponent } from '../add-material/add-material.component';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss'],
})
export class MaterialListComponent  implements OnInit {
  tractorDetails:any
  constructor(private modalControl:ModalController,private share:ShareService,private api:ApiService) { }

  ngOnInit() {
    this.getList()
  }
  dismiss() {
    this.modalControl.dismiss();
  }
 async addMaterial(){
    const modal = await this.modalControl.create({
      component: AddMaterialComponent,
      componentProps: {
     
        tractorDetails: this.tractorDetails,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
   
    }
  }
  search:any
  async openCrudManagement(type: any='MATERIAL_OF_REPAIRING') {
        const modal = await this.modalControl.create({
          component: CrudPopupComponent,
          componentProps: {
            type: type,
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
     
        this.getList()
        console.log('role', role);
      }
      materialList:any=[]
      getList(){
      
        this.share.showLoading("Loading...")
        let obj = this.share.getListObj('repairmateriallist', false, [], true);
        this.api.postapi('getList', obj).subscribe(
          (res:any) => {
            this.materialList = res.data;
            this.share.spinner.dismiss()
          },
          (error:any) => {
         
          }
        );
      }
}
