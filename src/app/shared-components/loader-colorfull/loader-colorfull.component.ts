import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-loader-colorfull',
  templateUrl: './loader-colorfull.component.html',
  styleUrls: ['./loader-colorfull.component.scss'],
})
export class LoaderColorfullComponent implements OnInit {
  constructor(public share:ShareService) { }
  loader = false;
  ngOnInit() {
    this.loader = true;
  }

}
