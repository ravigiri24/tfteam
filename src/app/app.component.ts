import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    document.documentElement.style.setProperty(
      `--app-theme-element-color`,
      '#dc3545'
    );
  }
}
