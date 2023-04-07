import { Component, OnInit,ChangeDetectorRef,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskHeatMapStore } from 'src/app/stores/risk-management/risk-heat-map/risk-heat-map.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

@Component({
  selector: 'app-risk-heat-map',
  templateUrl: './risk-heat-map.component.html',
  styleUrls: ['./risk-heat-map.component.scss']
})
export class RiskHeatMapComponent implements OnInit {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  AppStore = AppStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  constructor( private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2:Renderer2) { }

  ngOnInit(): void {
    RisksStore.corporate=false;
    AppStore.showDiscussion = false;
    setTimeout(() => {
     
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
      this._utilityService.detectChanges(this._cdr);

    }, 250);
  }

  scrollEvent = (event: any): void => {

    const number = event.target.documentElement?.scrollTop;
    if (number > 50) {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
      this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
    }
    else {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
    }
  }

  ngOnDestroy(){
    RiskHeatMapStore.unsetRiskHeatMapDetails();
    RiskHeatMapStore.unsetHeatMapByCategoryDetails();
    RiskHeatMapStore.unsetHeatMapByDepartmentDetails();
    RiskHeatMapStore.unsetHeatMapByDivisionDetails();
    RiskHeatMapStore.unsetHeatMapBySectionDetails();
    RiskHeatMapStore.unsetHeatMapBySourceDetails();
  }
  

}
