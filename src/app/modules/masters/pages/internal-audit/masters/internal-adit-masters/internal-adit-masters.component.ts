import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MasterMenuStore } from "src/app/stores/masters/masters.store";
import { MasterService } from "src/app/core/services/masters/masters/master.service";

@Component({
  selector: 'app-internal-adit-masters',
  templateUrl: './internal-adit-masters.component.html',
  styleUrls: ['./internal-adit-masters.component.scss']
})
export class InternalAditMastersComponent implements OnInit {
  
  MastersMenuStore = MasterMenuStore;

  constructor(private _router: Router, private _masterService: MasterService) { }

  ngOnInit(): void {
  }

  getModuleId(){
    return this._masterService.getItemByPath(this._router.url);
  }

}
