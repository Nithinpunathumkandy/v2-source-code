import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MasterMenuStore } from 'src/app/stores/masters/masters.store';
import { MasterService } from "src/app/core/services/masters/masters/master.service";

@Component({
  selector: 'app-organization-masters',
  templateUrl: './organization-masters.component.html',
  styleUrls: ['./organization-masters.component.scss']
})
export class OrganizationMastersComponent implements OnInit {

  MasterMenuStore = MasterMenuStore;
  
  constructor(private _router: Router, private _masterService: MasterService) { }

  ngOnInit() {
    SubMenuItemStore.makeEmpty()
  }

  getModuleId(){
    return this._masterService.getItemByPath(this._router.url);
  }

}
