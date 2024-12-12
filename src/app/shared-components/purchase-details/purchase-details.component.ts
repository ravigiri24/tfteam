import { Component, OnInit,Input, EventEmitter,Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss'],
})
export class PurchaseDetailsComponent  implements OnInit {
@Input() typePurchaseList:any=[]
@Input() companyRepresentativeList:any=[]
@Input() cityList:any=[]
@Input() data:any
@Input() modelForm:FormGroup
@Output() saveFormEvent=new EventEmitter()
  constructor(private share:ShareService,private api:ApiService) { }

  ngOnInit() {}
  saveForm(){
    this.saveFormEvent.emit()
  }

}
