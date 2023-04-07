import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';
import { RiskTypeService } from 'src/app/core/services/masters/risk-management/risk-type/risk-type.service';
import { RiskCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-category-store';
import { RiskTypeMasterStore } from 'src/app/stores/masters/risk-management/risk-type-store';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';
import { IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';


@Component({
  selector: 'app-add-risk-mapping',
  templateUrl: './add-risk-mapping.component.html',
  styleUrls: ['./add-risk-mapping.component.scss']
})
export class AddRiskMappingComponent implements OnInit {
  @Input('title') title:boolean=false;
  @Input('riskModalTitle') riskModalTitle: any;

  AppStore = AppStore;
  RisksStore = RisksStore;
  MappingStore = MappingStore;
  DepartmentStore = DepartmentMasterStore;
  reactionDisposer: IReactionDisposer;
  MeetingPlanStore = MeetingPlanStore;
  RiskTypeMasterStore = RiskTypeMasterStore;
  RiskCategoryMasterStore = RiskCategoryMasterStore;
  
  selectedRisk = [];
  searchTerm = null;

  risk_type_id = null;
  department_ids = null;
  risk_category_id = null;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _riskService: RisksService,
    private _utilityService: UtilityService,
    private _riskTypeService: RiskTypeService,
    private _departmentService: DepartmentService,
    private _meetingPlanService: MeetingPlanService,
    private _riskCategoryService: RiskCategoryService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {

    this.selectedRisk = JSON.parse(JSON.stringify(MeetingPlanStore.selectedRiskList));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
  
    if (newPage) RisksStore.setCurrentPage(newPage);
    else RisksStore.setCurrentPage(1);
    this._riskService.getItems(false, this.generateSortParams()).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  save(close: boolean = false) {
    MappingStore.saveSelected = true;

    this._meetingPlanService.selectRequiredRisk(this.selectedRisk);
    if (this.selectedRisk.length > 0) this._utilityService.showSuccessMessage('Risk Selected', 'The selected Risk has been added to your list');
    if (close) this.cancel();
  }
  
  cancel() {
    if (MappingStore.saveSelected) {
      this._eventEmitterService.dismissRiskSelectModal();
    } else {
      MappingStore.saveSelected = false;
      this._eventEmitterService.dismissRiskSelectModal();
    }
    this.searchTerm = null;
    this.searchRisk();
  }

  searchRisk() {
    RisksStore.setCurrentPage(1);
    var searchParams = this.generateSortParams();
    this._riskService.getItems(false, searchParams).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  sortRisk() {
    var params = this.generateSortParams();
    this._riskService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setIssueSort(type) {

    this._riskService.sortRiskList(type, false);
    this.pageChange(1)
    this._utilityService.detectChanges(this._cdr);
  }

  clear() {
    this.searchTerm = null;
    this.pageChange(1);
  }

  selectAllIssues(event) {

    if (event.target.checked) {
      for (let i of RisksStore.riskDetails) {
        var pos = this.selectedRisk.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedRisk.push(i);
        }
      }
    } else {
      for (let i of RisksStore.riskDetails) {
        var pos = this.selectedRisk.findIndex(e => e.id == i.id);
        if (pos != -1) {
          this.selectedRisk.splice(pos, 1);
        }
      }
    }

  }

  issueSelected(issues) {

    var pos = this.selectedRisk.findIndex(e => e.id == issues.id);
    if (pos != -1) {
      this.selectedRisk.splice(pos, 1);
    }
    else {
      this.selectedRisk.push(issues);
    }

  }

  issuePresent(risk) {
    const index = this.selectedRisk.findIndex(e => e.id == risk.id);
    if (index > -1)
      return true;
    else
      return false;
  }

  generateSortParams() {
    var params = '';
    if (this.department_ids) params = params + `department_ids=${this.department_ids}`;
    if (this.risk_type_id) {
      params = params + `&risk_type_ids=${this.risk_type_id}`;
    }
    if (this.risk_category_id) {
      params = params + `&risk_category_ids=${this.risk_category_id}`;
    }

    if (this.searchTerm)
      params = params + `&q=${this.searchTerm}`;
    return params;
  }

  searchDepartment(e) {
    this._departmentService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDepartment() {
    this._departmentService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getRiskCategory() {
    this._riskCategoryService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchRiskCategory(e) {
    this._riskCategoryService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getRiskType() {
    this._riskTypeService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchRiskType(e) {
    this._riskTypeService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

}
