import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import { ChecklistAnswersListService } from 'src/app/core/services/internal-audit/audit-findings/checklist-answers-list/checklist-answers-list.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { ChecklistsAnswersListStore } from 'src/app/stores/internal-audit/audit-findings/checklist-answers-list/checklist-answers-list-store';
declare var $: any;
@Component({
  selector: 'app-checklist-answer-modal',
  templateUrl: './checklist-answer-modal.component.html',
  styleUrls: ['./checklist-answer-modal.component.scss']
})
export class ChecklistAnswerModalComponent implements OnInit ,OnDestroy{
  @Input('source') ChecklistSource: any;
  @ViewChild('viewChecklists', { static: true }) viewChecklists: ElementRef;

  AuditFindingsStore = AuditFindingsStore;
  AppStore = AppStore;
  ChecklistsAnswersListStore = ChecklistsAnswersListStore;
  checklistsArray = [];
  selectedChecklist_Id;
  allChecklist: boolean = false; 

  checklistObject = {
    component: 'Master',
    values: null,
    type: null,
    from: null
  };

  checklistAnswerEmptyList = "No Checklist Answers To Show";
  viewSingleChecklistsModalSubscription: any;
  constructor(private _eventEmitterService:EventEmitterService,
    private _checklistAnswersListService: ChecklistAnswersListService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _findingService:AuditFindingsService) { }

  ngOnInit(): void {

    if(this.ChecklistSource.type =='Edit'){
      this.checklistsArray = JSON.parse(JSON.stringify(AuditFindingsStore.ChecklistToDisplay));
    } else if(this.ChecklistSource.type =='Add') {
      this.checklistsArray = JSON.parse(JSON.stringify(AuditFindingsStore.ChecklistToDisplay));      
    }else{
      this.checklistsArray = [];
    }
// checklist modal close
this.viewSingleChecklistsModalSubscription = this._eventEmitterService.checklistSingleViewModal.subscribe(res => {
  this.closeChecklistModal();
})

    this.pageChange(1);
  } 

  pageChange(newPage: number = null){
    if (newPage) ChecklistsAnswersListStore.setCurrentPage(newPage);
    let params=`?audit_schedule_ids=${AuditFindingsStore.auditSChedule_Id}`;
    this._checklistAnswersListService.getAllItems(params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);

      if(ChecklistsAnswersListStore.loaded){
        if (this.checklistsArray.length > 0) {
          ChecklistsAnswersListStore.allItems.forEach(element => {
            this.checklistsArray.forEach(item => {
              if (element.audit_checklist_answer_key_id == item.id) {
                element['is_enabled'] = true;
              }
            });
          });
        } else {
          this.checklistsArray = [];
        }
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  searchInChecklistAnswers(e) {
    ChecklistsAnswersListStore.setCurrentPage(1);
    let searchText = e.target.value;
    if (searchText) {
      this._checklistAnswersListService.getAllItems(`?audit_schedule_ids=${AuditFindingsStore.auditSChedule_Id}&q=${searchText}`).subscribe(res => {
        if(res.data.length == 0){
          this.checklistAnswerEmptyList = "Your search did not match any checklists. Please make sure you typed the checklist name correctly, and then try again.";
        }
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.pageChange();
    }
  }

  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }

  selectChecklists(event, checklists, index) {
    var pos = this.checklistsArray.findIndex(e=>e.id == checklists.id);
    if(pos != -1)
        this.checklistsArray.splice(pos,1);
    else
        this.checklistsArray.push(checklists);
  }

  checkSelectedStatus(id: number){
    var pos = this.checklistsArray.findIndex(e => e.id == id);
    if(pos != -1) return true;
    else return false;
  }

  checkAll(event) {
    if (event.target.checked) {
      this.allChecklist = true;
      for(let i of ChecklistsAnswersListStore.allItems){
        var pos = this.checklistsArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.checklistsArray.push(i);}          
      }
    } else {
      this.allChecklist = false;
      for(let i of ChecklistsAnswersListStore.allItems){
        var pos = this.checklistsArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.checklistsArray.splice(pos,1);}    
      }
    }

  }


  viewSingleChecklist(id: number) {
    this.checklistObject.type = 'Add';
    this.checklistObject.values = {
      schedule_id: AuditFindingsStore.auditSChedule_Id,
      id: id
    }
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.viewChecklists.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
    this._renderer2.removeAttribute(this.viewChecklists.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.viewChecklists.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }
  closeChecklistModal() {
    this.checklistObject.type = null;
    this.checklistObject.values = null;
    this._renderer2.removeClass(this.viewChecklists.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.viewChecklists.nativeElement, 'display', 'none');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
    this._renderer2.setAttribute(this.viewChecklists.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.viewChecklists.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);

    // this.getAudit();
  }

  save(close:boolean = false){
    this._findingService.selectRequiredChecklists(this.checklistsArray);
    this._utilityService.showSuccessMessage('Checklits Selected', 'The selected Checklists has been added to your list');
    if (close) this.cancel();
  }

  // for closing the modal
  closeFormModal() {
    this._eventEmitterService.dismissFindingFormChecklistModal();

  }

  ngOnDestroy() {
    this.viewSingleChecklistsModalSubscription.unsubscribe();
  }

}
