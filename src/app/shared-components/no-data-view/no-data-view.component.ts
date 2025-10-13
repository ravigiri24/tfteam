import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data-view',
  templateUrl: './no-data-view.component.html',
  styleUrls: ['./no-data-view.component.scss'],
})
export class NoDataViewComponent implements OnInit {
  @Input() title: any;
  @Input() subTitle: any;
  @Input() subtitleShow: any = true;
  constructor() { }

  ngOnInit() {
    if (!this.title) {
      this.title = 'No records found';
    }
    if (!this.subtitleShow) {
      this.subTitle = '';
    } else {
      this.subTitle = 'Try adjusting filters or search terms';
    }

  }

}
