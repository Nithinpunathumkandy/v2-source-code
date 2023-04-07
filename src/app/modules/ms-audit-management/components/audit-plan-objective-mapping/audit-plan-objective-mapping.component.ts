import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2, OnDestroy} from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditPlanObjectiveService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-plan-objective/ms-audit-plan-objective.service';
import { MsAuditPlanObjectiveMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-plan-objective-store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';

@Component({
  selector: 'app-audit-plan-objective-mapping',
  templateUrl: './audit-plan-objective-mapping.component.html',
  styleUrls: ['./audit-plan-objective-mapping.component.scss']
})
export class AuditPlanObjectiveMappingComponent implements OnInit {
  MsAuditPlansStore = MsAuditPlansStore;
  MsAuditPlanObjectiveMasterStore=MsAuditPlanObjectiveMasterStore;
  AppStore = AppStore;
  selectedObjectives=[];
  selectAll = false;
  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _msAuditPlanObjectiveService: MsAuditPlanObjectiveService,
  ) { }

  ngOnInit(): void {
    this.selectedObjectives = JSON.parse(JSON.stringify(MsAuditPlanObjectiveMasterStore._selectedMsAuditPlanObjectiveAll));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    this.selectAll = false;
    if (newPage) MsAuditPlanObjectiveMasterStore.setCurrentPage(newPage);
    this._msAuditPlanObjectiveService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  checkCriteriaPresent(criteria){
    if(this.selectedObjectives.length==0)
    {
      this.selectedObjectives = JSON.parse(JSON.stringify(MsAuditPlanObjectiveMasterStore._selectedMsAuditPlanObjectiveAll));
    }
    var pos = this.selectedObjectives.findIndex(e => e.id == criteria.id);
    if (pos != -1)
      return true;
    else
      return false;
  
  }
  
  selectCriteria(criteria,splice:boolean = true){
  var pos = this.selectedObjectives.findIndex(e => e.id == criteria.id);
    if (pos != -1){
      if(splice) this.selectedObjectives.splice(pos, 1);
    }
    else
      this.selectedObjectives.push(criteria);
  }
  
  checkAll(e){
    if (e.target.checked) {
      this.selectAll = true;
      for(let i of MsAuditPlanObjectiveMasterStore.allItems){
        var pos = this.selectedObjectives.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedObjectives.push(i);}          
      }
    } else {
      this.selectAll = false;
      for(let i of MsAuditPlanObjectiveMasterStore.allItems){
        var pos = this.selectedObjectives.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedObjectives.splice(pos,1);}    
      }
    }
  }

  newAddMeetingObjectiveChecked(id){
    MsAuditPlanObjectiveMasterStore.setCurrentPage(1);
    this._msAuditPlanObjectiveService.searchTextObjective(false, `&q=${id}`).subscribe(res => {          
      this.selectedObjectives.push(res.data[0]);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  save(close: boolean = false) {
    
    this._msAuditPlanObjectiveService.selectRequiredObjective(this.selectedObjectives);
    if (this.selectedObjectives.length > 0) this._utilityService.showSuccessMessage('objective_selected', 'the_selected_objective_has_been_added_to_your_list');
    if (close) this.cancel();
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    this.selectedObjectives = JSON.parse(JSON.stringify(MsAuditPlanObjectiveMasterStore._selectedMsAuditPlanObjectiveAll));
    this._eventEmitterService.dismissAuditPlanObjectiveModal();
    //this.searchText = null;
    //this.searchInCriteriaList(this.searchText);
  }

  

}
