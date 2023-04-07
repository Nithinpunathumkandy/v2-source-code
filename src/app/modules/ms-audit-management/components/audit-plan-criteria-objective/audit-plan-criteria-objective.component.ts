import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2, OnDestroy} from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditPlanCriteriaMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-plan-criteria-store';
import { MsAuditPlanCriteriaService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-plan-criteria/ms-audit-plan-criteria.service';

@Component({
  selector: 'app-audit-plan-criteria-objective',
  templateUrl: './audit-plan-criteria-objective.component.html',
  styleUrls: ['./audit-plan-criteria-objective.component.scss']
})
export class AuditPlanCriteriaObjectiveComponent implements OnInit {
  MsAuditPlanCriteriaMasterStore=MsAuditPlanCriteriaMasterStore;
  AppStore = AppStore;
  criteraArray=[];
  selectAll:boolean = false;
  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _msAuditPlanCriteriaService: MsAuditPlanCriteriaService,
  ) { }

  ngOnInit(): void {
    this.criteraArray = JSON.parse(JSON.stringify(MsAuditPlanCriteriaMasterStore._selectedMsAuditPlanCriteriaAll));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    this.selectAll = false;
    if (newPage) MsAuditPlanCriteriaMasterStore.setCurrentPage(newPage);
    this._msAuditPlanCriteriaService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  checkCriteriaPresent(criteria){
    
    if(this.criteraArray.length==0)
    {
      this.criteraArray = JSON.parse(JSON.stringify(MsAuditPlanCriteriaMasterStore._selectedMsAuditPlanCriteriaAll));
    }
  
    var pos = this.criteraArray.findIndex(e => e.id == criteria.id);
    
    if (pos != -1)
      return true;
    else
      return false;

  }

  selectCriteria(criteria,splice:boolean = true){
    var pos = this.criteraArray.findIndex(e => e.id == criteria.id);
    if (pos != -1){
      if(splice) this.criteraArray.splice(pos, 1);
    } 
    else
      this.criteraArray.push(criteria);
  }

  checkAll(e){
    if (e.target.checked) {
      this.selectAll = true;
      for(let i of MsAuditPlanCriteriaMasterStore.allItems){
        // this.selectCriteria(i,false)
        var pos = this.criteraArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.criteraArray.push(i);}          
      }
    } else {
      this.selectAll = false;
      for(let i of MsAuditPlanCriteriaMasterStore.allItems){
        // this.selectCriteria(i);
        var pos = this.criteraArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.criteraArray.splice(pos,1);}    
      }
    }
  }

  newCriteriaAddChecked(id){
    MsAuditPlanCriteriaMasterStore.setCurrentPage(1);
    this._msAuditPlanCriteriaService.searchTextCriteria(false, `&q=${id}`).subscribe(res => {          
    
      this.criteraArray.push(res.data[0]);
      this._utilityService.detectChanges(this._cdr);
    }); 
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    //this.searchText=null;
    this.criteraArray = JSON.parse(JSON.stringify(MsAuditPlanCriteriaMasterStore._selectedMsAuditPlanCriteriaAll));
    this._eventEmitterService.dismissAuditPlanCriteriaModal();
    //this.searchInCriteriaList(this.searchText);
  }

  sortTitle(type: string) {
    this._msAuditPlanCriteriaService.sortMsAuditPlanCriteriaList(type, null);
    this.pageChange();
  }

  save(close: boolean = false) {
    this._msAuditPlanCriteriaService.selectRequiredCriteria(this.criteraArray);
    if (this.criteraArray.length > 0) this._utilityService.showSuccessMessage('critera_selected', 'the_selected_criteria_has_been_added_to_your_list');
    if (close) this.cancel();
  }

  clear() {

    this.pageChange(1);
  }


}
