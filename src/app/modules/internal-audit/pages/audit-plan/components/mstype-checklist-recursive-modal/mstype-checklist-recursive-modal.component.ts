import { Component, Input, OnInit } from '@angular/core';
import { AuditPlanScheduleMasterStore } from 'src/app/stores/internal-audit/audit-plan-schedule/audit-plan-schedule-store';
import { AuditCheckListMasterStore } from 'src/app/stores/masters/internal-audit/audit-check-list-store';

@Component({
  selector: 'app-mstype-checklist-recursive-modal',
  templateUrl: './mstype-checklist-recursive-modal.component.html',
  styleUrls: ['./mstype-checklist-recursive-modal.component.scss']
})
export class MstypeChecklistRecursiveModalComponent implements OnInit {

  @Input() sourceData
  checkListArray = [];
  allChecklists: boolean = false;
  AuditCheckListStore = AuditCheckListMasterStore;
  AuditPlanScheduleMasterStore=AuditPlanScheduleMasterStore;
  constructor() { }

  ngOnInit(): void {
  }


  selectCheckList(event, checklists, index,clause_number?) {
    var pos = AuditPlanScheduleMasterStore.checkListArray.findIndex(e=>e.id == checklists.id);
    if(pos != -1)
        AuditPlanScheduleMasterStore.checkListArray.splice(pos,1);
    else
    {
      let passParams = {
          ...checklists,
          'clause_number':clause_number

      }

      AuditPlanScheduleMasterStore.checkListArray.push(passParams);
    }
       
  }
  checkSelectedStatus(id: number){
    var pos = AuditPlanScheduleMasterStore.checkListArray.findIndex(e => e.id == id);
    if(pos != -1) return true;
    else return false;
  }

  checkAll(event) { 
    if (event.target.checked) {
      this.allChecklists = true;
      for(let i of AuditCheckListMasterStore.allItems){
        var pos = AuditPlanScheduleMasterStore.checkListArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          AuditPlanScheduleMasterStore.checkListArray.push(i);}          
      }
    } else {
      this.allChecklists = false;
      for(let i of AuditCheckListMasterStore.allItems){
        var pos = AuditPlanScheduleMasterStore.checkListArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          AuditPlanScheduleMasterStore.checkListArray.splice(pos,1);}    
      }
    }

  }

}
