import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddTractorDocsStatusRtoComponent } from '../add-tractor-docs-status-rto/add-tractor-docs-status-rto.component';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-view-tractor-docs-status-rto',
  templateUrl: './view-tractor-docs-status-rto.component.html',
  styleUrls: ['./view-tractor-docs-status-rto.component.scss'],
})
export class ViewTractorDocsStatusRtoComponent  implements OnInit {

  constructor(private modalCtrl:ModalController,private share:ShareService,private api:ApiService) { }
  dismiss(){
this.modalCtrl.dismiss()
  }
listColorClass='firstColor'
tractorDetails:any
  ngOnInit() {
    this.getNotList()
  }
note_list:any=[
  {note:"Application mai naam galat likha hua hai Application mai naam galat likha hua hai Application mai naam galat likha hua hai Application mai naam galat likha hua hai Application mai naam galat likha hua hai Application mai naam galat likha hua hai"},
  {note:"Application mai naam galat likha hua hai Application mai naam galat likha hua hai Application mai naam galat likha hua hai Application mai naam galat likha hua hai Application mai naam galat likha hua hai Application mai naam galat likha hua hai"}

]
  async addNewNotes(note:any=null) {
    const modal = await this.modalCtrl.create({
      component: AddTractorDocsStatusRtoComponent,
      componentProps: {
        tractorDetails: this.tractorDetails,
        type:'NOTE',
        editData:note,
        title:'Note'
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
    if(data?.row){
      this.note_list.unshift(data?.row)
    }
  }
    stateList: any = [];
    allData:any=[]
    notes_raw:any
  getNotList() {
    
    this.share.showLoading('Loading');
    let obj :any= this.share.getListObj('list', false, [], true);
    obj.tractor_id=this.tractorDetails?.id
    this.api.postapi('rto_note_list', obj).subscribe(
      (res: any) => {
        this.note_list=[]
        this.notes_raw = res?.data?.filter((f:any)=>f.type=='NOTE');
        this.allData = res?.data
            this.notes_raw?.forEach((note:any)=>{
              let findStatus= this.allData?.find((status:any)=>status?.type=='STATUS' && status?.note_id==note?.id) 
              this.note_list.push({note:note,status:findStatus})
            }) 
     
      },
      (error: any) => {}
    );
  }
}
