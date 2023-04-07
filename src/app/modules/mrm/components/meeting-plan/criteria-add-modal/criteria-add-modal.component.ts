import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2, OnDestroy} from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import{MeetingCriteriaMasterStore} from 'src/app/stores/masters/mrm/meeting-criteria-store';
import { MeetingCriteriaService } from 'src/app/core/services/masters/mrm/meeting-criteria/meeting-criteria.service';


declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-criteria-add-modal',
  templateUrl: './criteria-add-modal.component.html',
  styleUrls: ['./criteria-add-modal.component.scss']
})
export class CriteriaAddModalComponent implements OnInit, OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('controlMeetingCriteriaFormModal') controlMeetingCriteriaFormModal: ElementRef;

  AppStore = AppStore;
  MeetingCriteriaMasterStore=MeetingCriteriaMasterStore;
  
  formErrors: any;
  searchText=null;
  criteraArray=[];
  selectAll:boolean = false;
  idleTimeoutSubscription: any;
  serviceSubscriptionEvent: any = null;

    constructor(
      private _renderer2: Renderer2,
      private _cdr: ChangeDetectorRef,
      private _utilityService: UtilityService,
      private _eventEmitterService: EventEmitterService,
      private _meetingCriteriaService: MeetingCriteriaService,
    ) { }

  ngOnInit(): void {
    
    this.criteraArray = JSON.parse(JSON.stringify(MeetingCriteriaMasterStore._selectedMeetingCriteriaAll));
    this.pageChange(1);
    this.serviceSubscriptionEvent = this._eventEmitterService.meetingCriteria.subscribe(res=>{
      if(res){
        this.newCriteriaAddChecked(res);
      }
      this.closeAddMeetingCriteriaModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        if($(this.controlMeetingCriteriaFormModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.controlMeetingCriteriaFormModal.nativeElement,'z-index','999999');
          this._renderer2.setStyle(this.controlMeetingCriteriaFormModal.nativeElement,'overflow','auto');
        }
        
      }
    })
    
  }

  pageChange(newPage: number = null) {
    this.selectAll = false;
    if (newPage) MeetingCriteriaMasterStore.setCurrentPage(newPage);
    this._meetingCriteriaService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchInCriteriaList(e){
    if(e){
      this.searchText = e.target.value;
    }else{
      this.searchText=e;
    }
    MeetingCriteriaMasterStore.setCurrentPage(1);
    if (this.searchText) {
      this._meetingCriteriaService.getItems(false, `&q=${this.searchText}`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      }); 
    } else{
      this.pageChange();
    }
  }

  checkCriteriaPresent(criteria){
    
    if(this.criteraArray.length==0)
    {
      this.criteraArray = JSON.parse(JSON.stringify(MeetingCriteriaMasterStore._selectedMeetingCriteriaAll));
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
      for(let i of MeetingCriteriaMasterStore.allItems){
        // this.selectCriteria(i,false)
        var pos = this.criteraArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.criteraArray.push(i);}          
      }
    } else {
      this.selectAll = false;
      for(let i of MeetingCriteriaMasterStore.allItems){
        // this.selectCriteria(i);
        var pos = this.criteraArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.criteraArray.splice(pos,1);}    
      }
    }
  }

  newCriteriaAddChecked(id){
    MeetingCriteriaMasterStore.setCurrentPage(1);
    this._meetingCriteriaService.searchTextCriteria(false, `&q=${id}`).subscribe(res => {          
    
      this.criteraArray.push(res.data[0]);
      this._utilityService.detectChanges(this._cdr);
    }); 
  }

  cancel() {
    this.closeFormModal();
  }

  openAddMeetingCriteriaModal()
  {
    this.searchText=null;
    this.pageChange(1);
    MeetingCriteriaMasterStore.addMeetingCriteriaModal=true;
      $(this.controlMeetingCriteriaFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
      this._utilityService.detectChanges(this._cdr);
  }

  closeAddMeetingCriteriaModal() {
    MeetingCriteriaMasterStore.addMeetingCriteriaModal = false;
    $(this.controlMeetingCriteriaFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal() {
    this.searchText=null;
    this.criteraArray = JSON.parse(JSON.stringify(MeetingCriteriaMasterStore._selectedMeetingCriteriaAll));
    this._eventEmitterService.dismissMrmCriteriaControlAddModal();
    this.searchInCriteriaList(this.searchText);
  }

  sortTitle(type: string) {
    this._meetingCriteriaService.sortMeetingCriteriaList(type, null);
    this.pageChange();
  }

  save(close: boolean = false) {
    this._meetingCriteriaService.selectRequiredCriteria(this.criteraArray);
    if (this.criteraArray.length > 0) this._utilityService.showSuccessMessage('critera_selected', 'the_selected_criteria_has_been_added_to_your_list');
    if (close) this.cancel();
  }

  clear() {
    this.searchText = ''
    this.pageChange(1);
  }
 
  ngOnDestroy() {
    this.serviceSubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
  }

}
