import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/services/masters/masters/master.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MasterMenuStore } from 'src/app/stores/masters/masters.store';

@Component({
  selector: 'app-incident-management-master',
  templateUrl: './incident-management-master.component.html',
  styleUrls: ['./incident-management-master.component.scss']
})
export class IncidentManagementMasterComponent implements OnInit {

  MasterMenuStore = MasterMenuStore;
  constructor(private _router: Router, private _masterService: MasterService) { }

  ngOnInit(): void {
    SubMenuItemStore.makeEmpty()
  }

  getModuleId(){
    return this._masterService.getItemByPath(this._router.url);
  }

}
