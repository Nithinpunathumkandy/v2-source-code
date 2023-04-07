import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { StrategyObjectiveTypeService } from 'src/app/core/services/masters/strategy/strategy-objective-type/strategy-objective-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyObjectiveTypeMasterStore } from 'src/app/stores/masters/strategy/strategy-objective-type-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-strategy-mapping-objective-type-popup',
  templateUrl: './strategy-mapping-objective-type-popup.component.html',
  styleUrls: ['./strategy-mapping-objective-type-popup.component.scss']
})
export class StrategyMappingObjectiveTypePopupComponent implements OnInit {

  @Input() source

  searchText=null
  StrategyObjectiveTypeMasterStore = StrategyObjectiveTypeMasterStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  public objectiveTypeEmptyList;
  private objectiveType$ = new Subject()

  constructor(private _strategicObjectiveTypeService:StrategyObjectiveTypeService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService :UtilityService,private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.pageChange(1);
  }

  //getting ObjectiveType *takeuntill used to unsubscribe http call
  pageChange(newPage: number = null) {
    if (newPage) StrategyObjectiveTypeMasterStore.setCurrentPage(newPage);
    this._strategicObjectiveTypeService.getItems(false,null,true).pipe(takeUntil(this.objectiveType$)).subscribe(res => {                                   
    })
  }

  //passing ObjectiveType id to mapping page
  getTypeID(id){  
    this.closeFormModal(id);    
  }

  //searching ObjectiveType *takeuntill used to unsubscribe http call
  searchObjectiveType(event?) {
    StrategyObjectiveTypeMasterStore.setCurrentPage(1);
    this.searchText = event.target.value;
    if (this.searchText) {
      this._strategicObjectiveTypeService.getItems(false, `&q=${this.searchText}`).pipe(takeUntil(this.objectiveType$)).subscribe(res => {
        if(res.data.length == 0){
          this.objectiveTypeEmptyList = 'no_strategy_objective_type';
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
    this._eventEmitterService.dismissStrategyMappingObjectiveTypeModal(resId);
  }

  ngOnDestroy() {    
    this.objectiveType$.next()
    this.objectiveType$.complete()     
    StrategyObjectiveTypeMasterStore.loaded=false
  }

}
