import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/services/masters/masters/master.service';
import { MasterMenuStore } from 'src/app/stores/masters/masters.store';

@Component({
  selector: 'app-event-monitoring',
  templateUrl: './event-monitoring.component.html',
  styleUrls: ['./event-monitoring.component.scss']
})
export class EventMonitoringComponent implements OnInit {

  MasterMenuStore = MasterMenuStore;
  
  constructor(
    private _router: Router, private _masterService: MasterService
  ) { }

  ngOnInit(): void {
  }

  getModuleId(){
    return this._masterService.getItemByPath(this._router.url);
  }

}
