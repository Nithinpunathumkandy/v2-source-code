import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { AuditCriterionService } from 'src/app/core/services/masters/internal-audit/audit-criterion/audit-criterion.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { AuditCriterionMasterStore } from 'src/app/stores/masters/internal-audit/audit-criterion-store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-criteria-modal',
  templateUrl: './add-criteria-modal.component.html',
  styleUrls: ['./add-criteria-modal.component.scss']
})
export class AddCriteriaModalComponent implements OnInit {

  criteraArray = [];
  AuditCriterionMasterStore = AuditCriterionMasterStore;
  AuditPlanStore = AuditPlanStore;
  allCriterias: boolean = false;
  criteriaEmptyList = "No Criteria To Show";
  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _auditPlanService: AuditPlanService,
    private _auditCriteriaService: AuditCriterionService) { }

  ngOnInit(): void {


    this.criteraArray = JSON.parse(JSON.stringify(AuditPlanStore.criteriaToDisplay));
    // calling checklist api
    this.pageChange(1);

  }
  pageChange(newPage: number = null) {
    if (newPage) AuditCriterionMasterStore.setCurrentPage(newPage);
    this._auditCriteriaService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AuditCriterionMasterStore.loaded) {
        if (this.criteraArray.length > 0) {
          AuditCriterionMasterStore.allItems.forEach(element => {
            this.criteraArray.forEach(item => {
              if (element.id == item.id) {
                element['is_enabled'] = true;
              }
            });
          });
        } else {
          this.criteraArray = [];
        }
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  searchInCriteriaList(e) {
    AuditCriterionMasterStore.setCurrentPage(1);
    let searchText = e.target.value;
    if (searchText) {
      this._auditCriteriaService.getItems(false, `&q=${searchText}`).subscribe(res => {
        if(res.data.length == 0){
          this.criteriaEmptyList = "Your search did not match any criteria. Please make sure you typed the criteria name correctly, and then try again.";
        }
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.pageChange();
    }
  }


  selectCriteria(event, criteria, index) {
    var pos = this.criteraArray.findIndex(e=>e.id == criteria.id);
    if(pos != -1)
        this.criteraArray.splice(pos,1);
    else
        this.criteraArray.push(criteria);
  }

  checkSelectedStatus(id: number){
    var pos = this.criteraArray.findIndex(e => e.id == id);
    if(pos != -1) return true;
    else return false;
  }

  checkAll(event) {
    if (event.target.checked) {
      this.allCriterias = true;
      for(let i of AuditCriterionMasterStore.allItems){
        var pos = this.criteraArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.criteraArray.push(i);}          
      }
    } else {
      this.allCriterias = false;
      for(let i of AuditCriterionMasterStore.allItems){
        var pos = this.criteraArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.criteraArray.splice(pos,1);}    
      }
    }

  }

  // getSelectedCriterion() {
  //   if (AuditCriterionMasterStore.allItems.length > 0) {
  //     for (let i of AuditCriterionMasterStore.allItems) {
  //     var pos =  this.criteraArray.findIndex(e=>e.id==i.id);
  //       if (i['is_enabled'] == true && pos==-1) {
  //         this.criteraArray.push(i);
  //       } else if(i['is_enabled'] == false && pos!=-1){
  //         this.criteraArray.splice(pos , 1);
  //       }
  //     }
  //   }
  // }
  save(close: boolean = false) {
    

    this._auditPlanService.selectRequiredCriteria(this.criteraArray);
    this._utilityService.showSuccessMessage('Critera Selected', 'The selected Criteria has been added to your list');
    if (close) this.cancel();
  }


  cancel() {
    this._eventEmitterService.dismissAddCriteriaModal();
  }


}
