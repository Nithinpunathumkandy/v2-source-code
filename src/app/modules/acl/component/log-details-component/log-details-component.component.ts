import { Component, OnInit } from '@angular/core';
import { ActivityLogStore } from "src/app/stores/acl/activity-log.store";
import { AppStore } from "src/app/stores/app.store";

@Component({
  selector: 'app-log-details-component',
  templateUrl: './log-details-component.component.html',
  styleUrls: ['./log-details-component.component.scss']
})
export class LogDetailsComponentComponent implements OnInit {

  ActivityLogStore = ActivityLogStore;
  AppStore = AppStore;
  constructor() { }

  ngOnInit(): void {
  }

}
