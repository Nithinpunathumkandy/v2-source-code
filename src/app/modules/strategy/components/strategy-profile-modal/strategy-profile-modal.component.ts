import { ChangeDetectorRef, Component, OnInit , Input, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

@Component({
  selector: 'app-strategy-profile-modal',
  templateUrl: './strategy-profile-modal.component.html',
  styleUrls: ['./strategy-profile-modal.component.scss']
})
export class StrategyProfileModalComponent implements OnInit , OnDestroy {

  @Input() source

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _strategyService:StrategyService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
  ) { }

  searchText=null
  StrategyStore = StrategyStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  public profileEmptyList;
  private strategicProfile$ = new Subject()

  ngOnInit(): void {
    this.pageChange(1)
  }

  //getting strategy profile *takeuntill used to unsubscribe http call
  pageChange(newPage: number = null) {
    if (newPage) StrategyStore.setCurrentPage(newPage);
    StrategyStore.orderItem="strategy_profiles.title"
    this._strategyService.getItems(false,'&is_default_enable=true').pipe(takeUntil(this.strategicProfile$)).subscribe(res => {                                   
    })
  }

  //passing profile id to mapping page
  getProfileID(id){
    if(id !=this.source.id){
      StrategyMappingStore.unsetIndividualStrategyMapping()
    }    
    this.closeFormModal(id);    
  }

  //searching profiles *takeuntill used to unsubscribe http call
  searchProfile(event?) {
    StrategyStore.setCurrentPage(1);
    this.searchText = event.target.value;
    if (this.searchText) {
      this._strategyService.getItems(false, `&q=${this.searchText}`).pipe(takeUntil(this.strategicProfile$)).subscribe(res => {
        if(res.data.length == 0){
          this.profileEmptyList = 'no_strategy_profile';
        }
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.pageChange();
    }
  }

  //it'll clear searched items
  clear() {
    this.searchText = '';
    this.pageChange(1);
  }

  //cancel popup
  cancel() {
    this.closeFormModal(this.source.id);
  }

  //closing modal
  closeFormModal(resId?) {    
    this._eventEmitterService.dismissStrategyProfileModal(resId);
  }

    //getting token as 
    createImageUrl(token, type?) {
      if (type === "strategy_profile") {
        return this._strategyService.getThumbnailPreview('profile', token);
      } else {
        return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
      }
    }

    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }

  //Don't forget to unsubscribe event , services and store
  ngOnDestroy() {    
    this.strategicProfile$.next()
    this.strategicProfile$.complete()     
    StrategyStore.loaded=false
  }
}