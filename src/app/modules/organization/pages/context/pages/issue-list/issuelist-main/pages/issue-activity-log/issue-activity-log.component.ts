import { Component, OnInit } from '@angular/core';
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { Router } from "@angular/router";

@Component({
  selector: 'app-issue-activity-log',
  templateUrl: './issue-activity-log.component.html',
  styleUrls: ['./issue-activity-log.component.scss']
})
export class IssueActivityLogComponent implements OnInit {

  IssueListStore = IssueListStore;
  constructor(private _route: Router) { }

  ngOnInit(): void {
    if(!IssueListStore.selectedId)
      this._route.navigateByUrl('/organization/context/issue-lists');
  }

}
