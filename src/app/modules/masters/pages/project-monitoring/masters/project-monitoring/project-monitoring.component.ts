import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/services/masters/masters/master.service';
import { MasterMenuStore } from 'src/app/stores/masters/masters.store';

@Component({
  selector: 'app-project-monitoring',
  templateUrl: './project-monitoring.component.html',
  styleUrls: ['./project-monitoring.component.scss']
})
export class ProjectMonitoringComponent implements OnInit {

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
