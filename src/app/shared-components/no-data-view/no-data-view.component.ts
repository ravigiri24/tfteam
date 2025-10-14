import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data-view',
  templateUrl: './no-data-view.component.html',
  styleUrls: ['./no-data-view.component.scss'],
})
export class NoDataViewComponent implements OnInit {
  @Input() title: any= 'No records found';
  @Input() subTitle: any= 'Try adjusting filters or search terms';
  @Input() subtitleShow: any = true;
  constructor() { }

  ngOnInit() {

  }

}
