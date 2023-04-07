import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { AuditObjectiveService } from 'src/app/core/services/masters/internal-audit/audit-objective/audit-objective.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { AuditObjectiveMasterStore } from 'src/app/stores/masters/internal-audit/audit-objective-store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-objective-modal',
  templateUrl: './add-objective-modal.component.html',
  styleUrls: ['./add-objective-modal.component.scss']
})
export class AddObjectiveModalComponent implements OnInit {

  objectiveArray=[];
  AuditObjectiveMasterStore = AuditObjectiveMasterStore;
  AuditPlanStore = AuditPlanStore;
  allObjectives:boolean = false;
  objectiveEmptyList = "No Objectives To Show";
  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _auditPlanService: AuditPlanService,
    private _auditObjectiveService: AuditObjectiveService) { }

  ngOnInit(): void {

     
     this.objectiveArray = JSON.parse(JSON.stringify(AuditPlanStore.objectiveToDisplay));
     // calling objective api
     this.pageChange(1);

  }
  pageChange(newPage: number = null) {
    if (newPage) AuditObjectiveMasterStore.setCurrentPage(newPage);
    this._auditObjectiveService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      if (AuditObjectiveMasterStore.loaded) {
        if (this.objectiveArray.length > 0) {
          AuditObjectiveMasterStore.allItems.forEach(element => {
            this.objectiveArray.forEach(item => {
              if (element.id == item.id) {
                element['is_enabled'] = true;
              }
            });
          });
        } else {
          this.objectiveArray = [];
        }
        this._utilityService.detectChanges(this._cdr);
      }
    });
  }

  searchInObjectiveList(e){
    AuditObjectiveMasterStore.setCurrentPage(1);
    let searchText = e.target.value;
    if (searchText) {
      this._auditObjectiveService.getItems(false, `&q=${searchText}`).subscribe(res => {
        if(res.data.length == 0 ){
          this.objectiveEmptyList = "Your search did not match any objectives. Please make sure you typed the objective name correctly, and then try again.";
        }
        this._utilityService.detectChanges(this._cdr);
      }); 
    } else{
      this.pageChange();
    }
  }

  checkSelectedStatus(id: number){
    var pos = this.objectiveArray.findIndex(e => e.id == id);
    if(pos != -1) return true;
    else return false;
  }


  selectObjective(event,objective, index){
    var pos = this.objectiveArray.findIndex(e=>e.id == objective.id);
    if(pos != -1)
        this.objectiveArray.splice(pos,1);
    else
        this.objectiveArray.push(objective);
  }

  checkAll(event){
    if (event.target.checked) {
      this.allObjectives = true;
      for(let i of AuditObjectiveMasterStore.allItems){
        var pos = this.objectiveArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.objectiveArray.push(i);}          
      }
    } else {
      this.allObjectives = false;
      for(let i of AuditObjectiveMasterStore.allItems){
        var pos = this.objectiveArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.objectiveArray.splice(pos,1);}    
      }
    }
  }

  // getSelectedObjectives(){
  //   if (AuditObjectiveMasterStore.allItems.length>0){
  //   for (let i of AuditObjectiveMasterStore.allItems){
  //     var pos =  this.objectiveArray.findIndex(e=>e.id==i.id);
  //     if(i['is_enabled']==true && pos==-1){
  //       this.objectiveArray.push(i);} 
  //       else if(i['is_enabled'] == false && pos!=-1){
  //         this.objectiveArray.splice(pos , 1);
  //       }
  //   }
  // }
  // }

  save(close: boolean = false) {

    

    this._auditPlanService.selectRequiredObjective(this.objectiveArray);
    this._utilityService.showSuccessMessage('Objective Selected', 'The selected Objective has been added to your list');
    if (close) this.cancel();
  }


  cancel() {
   this._eventEmitterService.dismissAddObjectiveModal();
  }



}
