import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MasterMenuStore } from "src/app/stores/masters/masters.store";
import { MasterService } from "src/app/core/services/masters/masters/master.service";

@Component({
  selector: 'app-knowledge-hub-master',
  templateUrl: './knowledge-hub-master.component.html',
  styleUrls: ['./knowledge-hub-master.component.scss']
})
export class KnowledgeHubMasterComponent implements OnInit {

  MasterMenuStore = MasterMenuStore;

  constructor(private _router: Router, private _masterService: MasterService) { }

  ngOnInit(): void {
  }

  getModuleId(){
    return this._masterService.getItemByPath(this._router.url);
  }

}
