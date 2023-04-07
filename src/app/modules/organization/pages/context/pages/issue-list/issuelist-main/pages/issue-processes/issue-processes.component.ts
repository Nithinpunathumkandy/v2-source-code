import { Component, OnInit } from '@angular/core';
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { Router } from "@angular/router";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-issue-processes',
  templateUrl: './issue-processes.component.html',
  styleUrls: ['./issue-processes.component.scss']
})
export class IssueProcessesComponent implements OnInit {

  IssueListStore = IssueListStore;
  selectedIndex = 0;
  AppStore = AppStore;
  constructor(private _route: Router) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "no_processes_selected"});
    if(!IssueListStore.selectedId)
      this._route.navigateByUrl('/organization/context/issue-lists');
  }

  selectedIndexChanged(index){
    if(this.selectedIndex != index) this.selectedIndex = index;
    else this.selectedIndex = null;
  }

}
