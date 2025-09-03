import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-update-version-alert',
  templateUrl: './update-version-alert.component.html',
  styleUrls: ['./update-version-alert.component.scss'],
})
export class UpdateVersionAlertComponent implements OnInit {

  constructor(private api: ApiService) {

  }
  versionNameNew: any;
  ngOnInit() {
    this.versionNameNew = "TFTeam_1.0." + this.api.version
  }

}
