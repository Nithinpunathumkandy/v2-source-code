import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IsmsRiskTreatmentStore } from 'src/app/stores/isms/isms-risks/isms-risk-treatment.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
// import { RiskTreatmentStore } from 'src/app/stores/risk-management/risks/risk-treatment.store';
// import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';

@Component({
  selector: 'app-isms-risk-treatments',
  templateUrl: './isms-risk-treatments.component.html',
  styleUrls: ['./isms-risk-treatments.component.scss']
})
export class IsmsRiskTreatmentsComponent implements OnInit {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  IsmsRisksStore = IsmsRisksStore;
  AppStore = AppStore;
  IsmsRiskTreatmentStore = IsmsRiskTreatmentStore;
  constructor(private _renderer2:Renderer2,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    setTimeout(() => {
     
      // this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
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
    window.removeEventListener('scroll',this.scrollEvent);
    IsmsRiskTreatmentStore.unsetTreatmentDetails();
  }

}
