import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.scss'],
})
export class AccountDashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  transactionHistory() {
    return this.router.navigate([
      '/account-department/transaction-history-account',
    ]);
  }
}
