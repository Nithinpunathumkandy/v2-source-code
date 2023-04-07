import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MasterMenuStore } from "src/app/stores/masters/masters.store";
import { MasterService } from "src/app/core/services/masters/masters/master.service";

@Component({
  selector: 'app-human-capital-masters',
  templateUrl: './human-capital-masters.component.html',
  styleUrls: ['./human-capital-masters.component.scss']
})
export class HumanCapitalMastersComponent implements OnInit {
  SubMenuItemStore = SubMenuItemStore;
  MasterMenuStore = MasterMenuStore;


  constructor(private _router: Router, private _masterService: MasterService) { }

  ngOnInit() {
    SubMenuItemStore.makeEmpty()
  }

  getModuleId(){
    return this._masterService.getItemByPath(this._router.url);
  }

}
