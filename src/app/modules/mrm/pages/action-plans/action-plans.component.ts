import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionPlansStore } from 'src/app/stores/mrm/action-plans/action-plans-store';


@Component({
  selector: 'app-action-plans',
  templateUrl: './action-plans.component.html',
  styleUrls: ['./action-plans.component.scss']
})
export class ActionPlansComponent implements OnInit,OnDestroy {
  ActionPlansStore=ActionPlansStore;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    ActionPlansStore.unSetActionPlans();
  }

}
