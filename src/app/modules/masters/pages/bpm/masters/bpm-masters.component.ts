import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MasterMenuStore } from 'src/app/stores/masters/masters.store';
import { MasterService } from "src/app/core/services/masters/masters/master.service";

@Component({
  selector: 'app-bpm-masters',
  templateUrl: './bpm-masters.component.html',
  styleUrls: ['./bpm-masters.component.scss']
})
export class BpmMastersComponent implements OnInit {

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
