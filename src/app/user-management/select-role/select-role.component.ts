import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.scss'],
})
export class SelectRoleComponent  implements OnInit {

  constructor(private modalcontrol:ModalController,private share:ShareService) { }
selectedRole:any
staffDetails:any
roles:any=[]
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.selectedRole=this.staffDetails?.currentRole
    this.roles=Array.from(this.staffDetails?.staff_role)
    console.log(" this.roles ", this.roles ,typeof( this.roles));

  }
  selectFilter(){
    this.modalcontrol.dismiss({filterBy:this.selectedRole,isFilterChange:true})
  }
  
}
