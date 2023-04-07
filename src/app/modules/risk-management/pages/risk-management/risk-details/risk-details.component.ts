import { Component, OnInit, Renderer2, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RiskMatrixCalculationMethodService } from 'src/app/core/services/masters/risk-management/risk-matrix-calculation-method/risk-matrix-calculation-method.service';

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.scss']
})
export class RiskDetailsComponent implements OnInit {
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  RisksStore = RisksStore;
  OrganizationModulesStore = OrganizationModulesStore;
  AppStore = AppStore;

  constructor(private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private _utilityService: UtilityService,
    private _riskService: RisksService,
    private _cdr: ChangeDetectorRef,
    private _riskMatrixCalculationMethodService:RiskMatrixCalculationMethodService) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true)
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._riskService.saveRiskId(id);
      this.getRiskDetails(id);
    })
    SubMenuItemStore.makeEmpty();
    if(RisksStore.calculationMethod==null)
    this.getCalculationMethod();
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

  getRiskDetails(id) {
    this._riskService.getItem(id).subscribe(res=>{
      // In a real app: dispatch action to load the details here.
   
   this._utilityService.detectChanges(this._cdr);
   })
  }

  getCalculationMethod(){
    this._riskMatrixCalculationMethodService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      let pos = res['data'].findIndex(e=>e.is_selected);
      if(pos>-1)
      RisksStore.calculationMethod = res['data'][pos];
   
    })
  }

  ngOnDestroy(){
    RisksStore.unsetIndiviudalRiskDetails();
    RisksStore.corporate=false;
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    RisksStore.unset_Disable_Mapping_For_Event_Monitoring_Risk_Register();//it code only depending Event Monitoring Module connection
  }



}
