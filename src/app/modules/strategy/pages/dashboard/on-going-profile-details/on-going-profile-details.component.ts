import { Component, OnInit } from '@angular/core';
import { StrategyDaashboardStore } from 'src/app/stores/strategy-management/dashboard.store';

@Component({
  selector: 'app-on-going-profile-details',
  templateUrl: './on-going-profile-details.component.html',
  styleUrls: ['./on-going-profile-details.component.scss']
})
export class OnGoingProfileDetailsComponent implements OnInit {

  StrategyDaashboardStore = StrategyDaashboardStore;
  constructor() { }

  ngOnInit(): void {
  }

}
