import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.scss'],
})
export class AddMaterialComponent  implements OnInit {

  constructor(private formBuilder:FormBuilder,) { }
form:FormGroup
  ngOnInit() {

  }
    initialize(data: any = null) {
      this.form = this.formBuilder.group({
        name: new FormControl(data?.name || null, [
          Validators.required,
        ]),
        price: new FormControl(data?.price || null, [
          Validators.required,
        ]),
        expense_date: new FormControl(data?.expense_date || null),
    
      });
      console.log(' this.form', this.form);
  
      // if(data){
      //   this.form.addControl(
      //     'id',
      //     new FormControl(data?.id || null, [Validators.required])
      //   );
      // }
    }

}
