import { Component, OnDestroy, OnInit } from '@angular/core';
import { AssetMaintenanceScheduleStore } from 'src/app/stores/asset-management/asset-register/asset-schedule-store';

@Component({
  selector: 'app-maintenance-schedules',
  templateUrl: './maintenance-schedules.component.html',
  styleUrls: ['./maintenance-schedules.component.scss']
})
export class MaintenanceSchedulesComponent implements OnInit, OnDestroy {
  AssetMaintenanceScheduleStore = AssetMaintenanceScheduleStore;
  constructor() { }

  ngOnInit(): void {
  }
  
  ngOnDestroy() {
    AssetMaintenanceScheduleStore.setAllItemsScheduleListDestroy();

  }

}
