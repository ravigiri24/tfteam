import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-add-remark',
  templateUrl: './add-remark.component.html',
  styleUrls: ['./add-remark.component.scss'],
})
export class AddRemarkComponent  implements OnInit {
@Input() data:any
  constructor(private apiService:ApiService,private shareDataService:ShareService,private formBuilder:FormBuilder) { }
  staffDetails:any
  ngOnInit() {
    let staffDetails: any = this.shareDataService.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.getList()
    this.initialize()
  }
  form:FormGroup
  initialize(){
    this.form = this.formBuilder.group({
      status: new FormControl(null, [Validators.required]),
      customer_id: new FormControl(this.data?.id || null, [
        Validators.required,
      ]),
      chat_type: new FormControl("CHAT", [
        Validators.required,
      ]),
      employeId: new FormControl(this.staffDetails?.staffCode || null, [
        Validators.required,
      ]),
    });
  }


  chatHistory:any=[]
  getList() {
    let obj: any = this.shareDataService.getListObj(
      'customer_lead_chats',
      false,
      [],
      true
    );
    obj.customer_id = this.data?.id;
    this.shareDataService.showLoading('Loading...')
    this.apiService.postapi('getLeadsChats', obj).subscribe(
      (res:any) => {
        console.log("chatHistory",this.chatHistory);
        
        this.chatHistory = res.data;
        this.chatHistory=this.chatHistory.filter((f:any)=>f.chat_type=='CHAT')
        this.chatHistory.reverse()
        this.shareDataService.spinner.dismiss()
      },
      (error:any) => {}
    );
  }
  loader:any=false
  onSave() {
    if (this.form.valid) {
      this.loader = true;
      let obj = {
        src: 'customer_lead_chats',
        data: this.form.value,
      };
   //   this.shareDataService.showLoading('Loading...')
      this.apiService.postapi('addOpp', obj).subscribe((res:any) => {
        this.loader = false;
      //  this.shareDataService.openSnackbarAddSuccess()
        this.form.controls['status'].reset();
        this.getList();
        //this.chatHistory.push(this.form.value);
      });
    }
  }
}
