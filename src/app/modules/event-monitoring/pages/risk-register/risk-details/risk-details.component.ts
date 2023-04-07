import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventRiskAssessmentService } from 'src/app/core/services/event-monitoring/event-risk-assessment/event-risk-assessment.service';
import { RiskRegisterService } from 'src/app/core/services/event-monitoring/risk-register/risk-register.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventRiskAssessmentStore } from 'src/app/stores/event-monitoring/event-risk-assessment/event-risk-assesment.store';
import { RiskRegisterStore } from 'src/app/stores/event-monitoring/risk-register/risk-register-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.scss']
})
export class RiskDetailsComponent implements OnInit {

  RiskRegisterStore = RiskRegisterStore;
  constructor(
    private route: ActivatedRoute,
    private _riskRegisterService: RiskRegisterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventRiskAssessmentService: EventRiskAssessmentService,
  ) { }

  ngOnInit(): void {
  BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; 
      RiskRegisterStore.RiskRegisterId = id
      RiskRegisterStore.individualLoaded = false
      this._riskRegisterService.getItem(id).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    })
    this._eventRiskAssessmentService.getItem(RiskRegisterStore.RiskRegisterId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    EventRiskAssessmentStore.unsetEventRiskDetails();
  }

}
