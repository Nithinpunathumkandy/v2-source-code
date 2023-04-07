import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/services/masters/masters/master.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MasterMenuStore } from 'src/app/stores/masters/masters.store';

@Component({
  selector: 'app-ms-audit-management',
  templateUrl: './ms-audit-management.component.html',
  styleUrls: ['./ms-audit-management.component.scss']
})
export class MsAuditManagementComponent implements OnInit {

  SubMenuItemStore = SubMenuItemStore;
  MasterMenuStore = MasterMenuStore;
  
  constructor(private _router: Router, private _masterService: MasterService) { }

  ngOnInit(): void {
    SubMenuItemStore.makeEmpty()
  }

  getModuleId(){
    return this._masterService.getItemByPath(this._router.url);
  }

}