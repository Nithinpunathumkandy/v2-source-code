import { Component, OnInit, Renderer2, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BcmRiskAssessmentService } from 'src/app/core/services/bcm/risk-assessment/bcm-risk-assessment.service';
import { RiskMatrixCalculationMethodService } from 'src/app/core/services/masters/risk-management/risk-matrix-calculation-method/risk-matrix-calculation-method.service';

@Component({
  selector: 'app-risk-assessment-detail',
  templateUrl: './risk-assessment-detail.component.html',
  styleUrls: ['./risk-assessment-detail.component.scss']
})
export class RiskAssessmentDetailComponent implements OnInit {

  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  OrganizationModulesStore = OrganizationModulesStore
  BcmRiskAssessmentStore = BcmRiskAssessmentStore

  constructor(private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _bcmRiskAssessmentService: BcmRiskAssessmentService,
    private _riskMatrixCalculationMethodService:RiskMatrixCalculationMethodService) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true)
    SubMenuItemStore.setNoUserTab(true);
    
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; 
      BcmRiskAssessmentStore.selectedId = id
      BcmRiskAssessmentStore.detailsLoaded = false
      this._bcmRiskAssessmentService.getItem(id).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    })

    if(BcmRiskAssessmentStore.calculationMethod==null)
    this.getCalculationMethod();
  }

  getCalculationMethod(){
    this._riskMatrixCalculationMethodService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      let pos = res['data'].findIndex(e=>e.is_selected);
      if(pos>-1)
      BcmRiskAssessmentStore.calculationMethod = res['data'][pos];
   
    })
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
      }
    }

  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
  }

}
