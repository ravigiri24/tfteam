import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-colorfull',
  templateUrl: './loader-colorfull.component.html',
  styleUrls: ['./loader-colorfull.component.scss'],
})
export class LoaderColorfullComponent implements OnInit {
  activeCurrent = '';
  constructor() { }
  loader = false;
  ngOnInit() {
    this.loader = true;
  }

}
