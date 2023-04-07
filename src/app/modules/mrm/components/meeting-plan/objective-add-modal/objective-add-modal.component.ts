import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2, OnDestroy} from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import{MeetingObjectiveMasterStore} from 'src/app/stores/masters/mrm/meeting-objective-store';
import { MeetingObjectiveService } from 'src/app/core/services/masters/mrm/meeting-objective/meeting-objective.service';
import{MeetingPlanStore} from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-objective-add-modal',
  templateUrl: './objective-add-modal.component.html',
  styleUrls: ['./objective-add-modal.component.scss']
})
export class ObjectiveAddModalComponent implements OnInit, OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('controlObjectiveModal') controlObjectiveModal: ElementRef;

  AppStore = AppStore;
  MeetingPlanStore=MeetingPlanStore;
  MeetingObjectiveMasterStore=MeetingObjectiveMasterStore;
  
  serviceSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  selectedObjectives=[];
  selectAll = false;
  searchText=null;
  formErrors: any;

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _meetingObjectiveService: MeetingObjectiveService,
    ) { }

  ngOnInit(): void {
    
    this.selectedObjectives = JSON.parse(JSON.stringify(MeetingObjectiveMasterStore._selectedMeetingObjectiveAll));
    this.pageChange(1);
    this.serviceSubscriptionEvent = this._eventEmitterService.meetingObjective.subscribe(res=>{
      if(res){
        this.newAddMeetingObjectiveChecked(res);
      }
      this.closeAddMeetingObjectiveModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        if($(this.controlObjectiveModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.controlObjectiveModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.controlObjectiveModal.nativeElement,'overflow','auto');
        }
        
      }
    })
  }

  pageChange(newPage: number = null) {
    this.selectAll = false;
    if (newPage) MeetingObjectiveMasterStore.setCurrentPage(newPage);
    this._meetingObjectiveService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchInCriteriaList(e){
    if(e){
      this.searchText = e.target.value;
    }else{
      this.searchText=e;
    }
    MeetingObjectiveMasterStore.setCurrentPage(1);
    
    if (this.searchText) {
      this._meetingObjectiveService.getItems(false, `&q=${this.searchText}`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      }); 
    } else{
      this.pageChange();
    }
  }
  

  checkCriteriaPresent(criteria){
    if(this.selectedObjectives.length==0)
    {
      this.selectedObjectives = JSON.parse(JSON.stringify(MeetingObjectiveMasterStore._selectedMeetingObjectiveAll));
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
      for(let i of MeetingObjectiveMasterStore.allItems){
        var pos = this.selectedObjectives.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedObjectives.push(i);}          
      }
    } else {
      this.selectAll = false;
      for(let i of MeetingObjectiveMasterStore.allItems){
        var pos = this.selectedObjectives.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedObjectives.splice(pos,1);}    
      }
    }
  }

  newAddMeetingObjectiveChecked(id){
    MeetingObjectiveMasterStore.setCurrentPage(1);
    this._meetingObjectiveService.searchTextObjective(false, `&q=${id}`).subscribe(res => {          
      this.selectedObjectives.push(res.data[0]);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    this.selectedObjectives = JSON.parse(JSON.stringify(MeetingObjectiveMasterStore._selectedMeetingObjectiveAll));
    this._eventEmitterService.dismissMrmObjectiveControlAddModal();
    this.searchText = null;
    this.searchInCriteriaList(this.searchText);
  }

  openAddMeetingObjectiveModal()
  {
    this.searchText = null;
    this.pageChange(1);
    MeetingObjectiveMasterStore.addMeetingObjectiveModal=true;
    $(this.controlObjectiveModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
      this._utilityService.detectChanges(this._cdr);
  }

  closeAddMeetingObjectiveModal() {
    MeetingObjectiveMasterStore.addMeetingObjectiveModal = false;
    $(this.controlObjectiveModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }
  
  sortTitle(type: string) {
    this._meetingObjectiveService.sortMeetingObjectiveList(type, null);
    this.pageChange();
  }

  save(close: boolean = false) {
    
    this._meetingObjectiveService.selectRequiredObjective(this.selectedObjectives);
    if (this.selectedObjectives.length > 0) this._utilityService.showSuccessMessage('objective_selected', 'the_selected_objective_has_been_added_to_your_list');
    if (close) this.cancel();
  }

  ngOnDestroy() {
    this.serviceSubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
  }

}
