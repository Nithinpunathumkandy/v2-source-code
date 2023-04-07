import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MasterMenuStore } from 'src/app/stores/masters/masters.store';
import { MasterService } from "src/app/core/services/masters/masters/master.service";

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss']
})
export class ProjectManagementComponent implements OnInit {

  MasterMenuStore = MasterMenuStore;

  constructor(private _router: Router, private _masterService: MasterService) { }

  ngOnInit(): void {
    SubMenuItemStore.makeEmpty()
  }

  getModuleId(){
    return this._masterService.getItemByPath(this._router.url);
  }

}
