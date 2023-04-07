import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ObjectiveScoreStore } from 'src/app/stores/strategy-management/objective-score.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-objective-score',
  templateUrl: './objective-score.component.html',
  styleUrls: ['./objective-score.component.scss']
})
export class ObjectiveScoreComponent implements OnInit {
  StrategyStore = StrategyStore
  ObjectiveScoreStore = ObjectiveScoreStore
  constructor(private _router: ActivatedRoute,) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id : number
    this._router.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      if(id){
        StrategyStore.setObjectiveId(id)
        ObjectiveScoreStore.selectedobjectiveId = id

      }
  })
  }

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    StrategyStore.objectiveTargetBreakdownLoaded = false
    ObjectiveScoreStore.induvalObjectiveLoaded = false; 
    ObjectiveScoreStore._induavalObjective = null,
    StrategyStore._objectiveTargetBreakdown = null
  }

}
