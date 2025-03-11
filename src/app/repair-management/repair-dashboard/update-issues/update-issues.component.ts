import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
@Component({
  selector: 'app-update-issues',
  templateUrl: './update-issues.component.html',
  styleUrls: ['./update-issues.component.scss'],
})
export class UpdateIssuesComponent  implements OnInit {

  constructor(
    private modalControl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private fb:FormBuilder
  ) {}
  ngOnInit() {
    this.initialize()
    this.getIssueList()
  }
  selectIssue(e: any, issue: any) {
    console.log('selectIssue', e, issue);
    issue.checked = e?.detail?.checked;
    if (e?.detail?.checked == true) {
      let value = this.form.controls['issueOptions'].value;
      if (value == null || value == undefined) {
        let array = [];
        array.push(issue.id);
        this.form.controls['issueOptions'].setValue(array);
      } else {
        value.push(issue.id);
        this.form.controls['issueOptions'].setValue(value);
      }
    } else {
      let value = this.form.controls['issueOptions'].value;
      let find = value.find((fL: any) => fL == issue.id);
      if (find) {
        value = value?.filter((f: any) => f !== issue.id);
        this.form.controls['issueOptions'].setValue(value);
      }
  
    }
    console.log(
      " this.form.controls['issueOptions'].value",
      this.form.controls['issueOptions'].value
    );
  }
  dismiss(){
    this.modalControl.dismiss()
  }
    async openCrudManagement(type: any = 'TRACTOR_INVENTORY') {
      const modal = await this.modalControl.create({
        component: CrudPopupComponent,
        componentProps: {
          type: type,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (type == 'TRACTOR_INVENTORY') {
       // this.getInventory();
      } else if (type == 'TRACTOR_ISSUES') {
        this.getIssueList(true);
      }
      console.log('role', role);
    }
    issueList: any = [];
    getIssueList(loader: any = false) {
      if (loader) {
        this.share.showLoading('Getting Data...');
      }
      let obj: any = this.share.getListObj('tractor_issue', false, [], true);
  
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.issueList = res.data;
          this.issueList?.forEach((f: any) => {
            f.checked = false;
          });
          this.checkCheckedIssue();
          if (loader) {
            this.share.spinner.dismiss();
          }
        },
        (error: any) => {}
      );
    }
    checkCheckedIssue() {
      let value = this.form.controls['issueOptions'].value;
      this.issueList?.forEach((f: any) => {
        let find = value?.find((v: any) => v == f.id);
        if (find) {
          f.checked = true;
        }
      });
    }
    staffDetails: any;
    form:FormGroup
    data:any
    issueOptions:any
    otherIssues:any
    initialize() {
      let staffDetails: any = this.share.get_staff();
      console.log('staffDetails', staffDetails);
      this.staffDetails = JSON.parse(staffDetails);
      let date = new Date();
      let currentYear = date.getFullYear();
      this.form = this.fb.group({
   
        otherIssues: new FormControl(this.otherIssues || null, []),
     
        issueOptions: new FormControl(this.issueOptions || null, []),

      });
    }
 
}
