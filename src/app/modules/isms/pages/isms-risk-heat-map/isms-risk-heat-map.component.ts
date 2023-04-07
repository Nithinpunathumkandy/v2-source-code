import { Component, OnInit,ChangeDetectorRef,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IsmsRiskHeatMapStore } from 'src/app/stores/isms/isms-risk-heat-map/isms-risk-heat-map.store';
// import { IsmsRiskHeatMapStore } from 'src/app/stores/risk-management/risk-heat-map/risk-heat-map.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';


@Component({
  selector: 'app-isms-risk-heat-map',
  templateUrl: './isms-risk-heat-map.component.html',
  styleUrls: ['./isms-risk-heat-map.component.scss']
})
export class IsmsRiskHeatMapComponent implements OnInit {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  AppStore = AppStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  constructor( private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2:Renderer2) { }

  ngOnInit(): void {
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
    IsmsRiskHeatMapStore.unsetRiskHeatMapDetails();
    IsmsRiskHeatMapStore.unsetHeatMapByCategoryDetails();
    IsmsRiskHeatMapStore.unsetHeatMapByDepartmentDetails();
    IsmsRiskHeatMapStore.unsetHeatMapByDivisionDetails();
    IsmsRiskHeatMapStore.unsetHeatMapBySectionDetails();
    IsmsRiskHeatMapStore.unsetHeatMapBySourceDetails();
  }
  
}
