import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-review-frequency-popup',
  templateUrl: './review-frequency-popup.component.html',
  styleUrls: ['./review-frequency-popup.component.scss']
})
export class ReviewFrequencyPopupComponent implements OnInit {

  @Input('source') reviewFrequencySource: any;

  StrategyStore = StrategyStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  constructor(private _strategyService : StrategyService,
    private _utilityService: UtilityService,private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.getObjectiveTarget();
  }

  getObjectiveTarget(){
    this._strategyService.getObjectiveTargetBreakdown().subscribe(()=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  cancel(){
    this._eventEmitterService.dismissReviewFrequencyModal();
  }

}
