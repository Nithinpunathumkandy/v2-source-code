import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MeetingAgendaService } from 'src/app/core/services/masters/mrm/meeting-agenda/meeting-agenda.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MeetingAgendaMasterStore } from 'src/app/stores/masters/mrm/meeting-agenda-store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-agenda-add-modal',
  templateUrl: './agenda-add-modal.component.html',
  styleUrls: ['./agenda-add-modal.component.scss']
})
export class AgendaAddModalComponent implements OnInit {
  @Input('source') source: any;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('controlMeetingAgendaFormModal') controlMeetingAgendaFormModal: ElementRef;

  AppStore = AppStore;
  MeetingAgendaMasterStore=MeetingAgendaMasterStore;
  
  formErrors: any;
  searchText=null;
  agendaArray=[];
  selectAll:boolean = false;
  idleTimeoutSubscription: any;
  serviceSubscriptionEvent: any = null;

    constructor(
      private _renderer2: Renderer2,
      private _cdr: ChangeDetectorRef,
      private _utilityService: UtilityService,
      private _eventEmitterService: EventEmitterService,
      private _meetingAgendaService: MeetingAgendaService
    ) { }

  ngOnInit(): void {

    this.agendaArray = JSON.parse(JSON.stringify(MeetingAgendaMasterStore._selectedMeetingAgendaAll));
    this.pageChange(1);

    this.serviceSubscriptionEvent = this._eventEmitterService.meetingAgenda.subscribe(res=>{
      
      if(res){
        this.newAgendaAddChecked(res);
      }
      this.closeAddMeetingAgendaModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        if($(this.controlMeetingAgendaFormModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.controlMeetingAgendaFormModal.nativeElement,'z-index','999999');
          this._renderer2.setStyle(this.controlMeetingAgendaFormModal.nativeElement,'overflow','auto');
        }
        
      }
    })
    
  }

  pageChange(newPage: number = null) {
    this.selectAll = false;
    if (newPage) MeetingAgendaMasterStore.setCurrentPage(newPage);
    this._meetingAgendaService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchInCriteriaList(e){
    if(e){
      this.searchText = e.target.value;
    }else{
      this.searchText=e;
    }
    MeetingAgendaMasterStore.setCurrentPage(1);
    if (this.searchText) {
      this._meetingAgendaService.getItems(false, `&q=${this.searchText}`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      }); 
    } else{
      this.pageChange();
    }
  }

  checkCriteriaPresent(criteria){
    
    if(this.agendaArray.length==0)
    {
      this.agendaArray = JSON.parse(JSON.stringify(MeetingAgendaMasterStore._selectedMeetingAgendaAll));
    }
  
    var pos = this.agendaArray.findIndex(e => e.id == criteria.id);
    
    if (pos != -1)
      return true;
    else
      return false;

  }

  selectCriteria(criteria,splice:boolean = true){
    var pos = this.agendaArray.findIndex(e => e.id == criteria.id);
    if (pos != -1){
      if(splice) this.agendaArray.splice(pos, 1);
    } 
    else
      this.agendaArray.push(criteria);
  }

  checkAll(e){
    if (e.target.checked) {
      this.selectAll = true;
      for(let i of MeetingAgendaMasterStore.allItems){
        var pos = this.agendaArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.agendaArray.push(i);}          
      }
    } else {
      this.selectAll = false;
      for(let i of MeetingAgendaMasterStore.allItems){
        var pos = this.agendaArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.agendaArray.splice(pos,1);}    
      }
    }
  }

  newAgendaAddChecked(id){
    MeetingAgendaMasterStore.setCurrentPage(1);
    this._meetingAgendaService.searchTextAgenda(false, `&q=${id}`).subscribe(res => {          

      this.agendaArray.push(res.data[0]);
      this._utilityService.detectChanges(this._cdr);
    }); 
  }
  // cancel modal
  cancel() {
    this.closeFormModal();
  }

  openAddMeetingAgendaModal()
  {
    this.searchText=null;
    this.pageChange(1);
    MeetingAgendaMasterStore.addMeetingAgendaModal=true;
      $(this.controlMeetingAgendaFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
      this._utilityService.detectChanges(this._cdr);
  }

  closeAddMeetingAgendaModal() {
    MeetingAgendaMasterStore.addMeetingAgendaModal = false;
    $(this.controlMeetingAgendaFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // for closing the modal
  closeFormModal() {
    this.searchText=null;
    this.agendaArray = JSON.parse(JSON.stringify(MeetingAgendaMasterStore._selectedMeetingAgendaAll));
    this._eventEmitterService.dismissMrmAgengaControlAddModal();
    this.searchInCriteriaList(this.searchText);
  }

  sortTitle(type: string) {
    this._meetingAgendaService.sortMeetingAgendaList(type, null);
    this.pageChange();
  }

  save(close: boolean = false) {
    this._meetingAgendaService.selectRequiredAgenda(this.agendaArray);
    if (this.agendaArray.length > 0) this._utilityService.showSuccessMessage('agendas_selected', 'the_selected_agendas_has_been_added_to_your_list');
    if (close) this.cancel();
  }
 
  ngOnDestroy() {
    this.serviceSubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
  }
  
}
