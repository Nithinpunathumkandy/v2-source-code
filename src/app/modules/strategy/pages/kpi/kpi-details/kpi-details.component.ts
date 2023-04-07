import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { KpiStore } from 'src/app/stores/strategy-management/kpi.store';

@Component({
  selector: 'app-kpi-details',
  templateUrl: './kpi-details.component.html',
  styleUrls: ['./kpi-details.component.scss']
})
export class KpiDetailsComponent implements OnInit {
  KpiStore =KpiStore
  constructor(private _startegySercive : StrategyService,private _router: ActivatedRoute,
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService,) { }

  ngOnInit(): void {
    let id : number
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this._router.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      if(id){
        KpiStore.selectedKpiId = id
      //   this.getInduvalKpi(id);
      //   this.getReviewFreequency(id)
       }
  })

}

 
ngOnDestroy(){
  BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  this.KpiStore.induvalKpiLoaded = false;
  this.KpiStore._induavalKpi = null;
  KpiStore.loaded = false;
  KpiStore._kpiReviews = [];


}
}
