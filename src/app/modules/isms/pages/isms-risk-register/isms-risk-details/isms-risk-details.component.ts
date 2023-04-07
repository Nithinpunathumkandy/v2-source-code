import { Component, OnInit, Renderer2, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { IsmsRisksService } from 'src/app/core/services/isms/isms-risks/isms-risks.service';
import { IsmsRiskMatrixCalculationMethodService } from 'src/app/core/services/masters/Isms/isms-risk-matrix-calculation-method/isms-risk-matrix-calculation-method.service';

@Component({
  selector: 'app-isms-risk-details',
  templateUrl: './isms-risk-details.component.html',
  styleUrls: ['./isms-risk-details.component.scss']
})
export class IsmsRiskDetailsComponent implements OnInit {

  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  IsmsRisksStore = IsmsRisksStore;
  AppStore = AppStore;
  OrganizationModulesStore = OrganizationModulesStore;

  constructor(private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private _utilityService: UtilityService,
    private _ismsRiskService: IsmsRisksService,
    private _cdr: ChangeDetectorRef,
    private _riskMatrixCalculationMethodService:IsmsRiskMatrixCalculationMethodService) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true)
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._ismsRiskService.saveRiskId(id);
      this.getRiskDetails(id);
    })
    SubMenuItemStore.makeEmpty();
    if(IsmsRisksStore.calculationMethod==null)
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
   
    this._ismsRiskService.getItem(id).subscribe(res=>{
      // In a real app: dispatch action to load the details here.
   
   this._utilityService.detectChanges(this._cdr);
   })
  }

  getCalculationMethod(){
    this._riskMatrixCalculationMethodService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      for(let i of res['data']){
        if(i.is_selected){
          IsmsRisksStore.calculationMethod = i;
        }
      }
      // this.calculationMethod=res['data'][0].id;
    })
  
  }

  ngOnDestroy(){
    IsmsRisksStore.unsetIndiviudalRiskDetails();
    IsmsRisksStore.corporate=false;
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }



}
