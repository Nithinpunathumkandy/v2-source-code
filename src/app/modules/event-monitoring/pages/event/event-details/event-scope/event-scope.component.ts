import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventScopeService } from 'src/app/core/services/event-monitoring/events/event-scope/event-monitoring.service';
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
declare var $: any;

@Component({
  selector: 'app-event-scope',
  templateUrl: './event-scope.component.html',
  styleUrls: ['./event-scope.component.scss']
})
export class EventScopeComponent implements OnInit {
  @ViewChild('newScope', {static: true}) newScope: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  EventMonitoringStore = EventMonitoringStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  EventsStore=EventsStore;
  AuthStore = AuthStore
  reactionDisposer: IReactionDisposer;
  emptyMessage="no_data_found"
  newScopeObject = {
    id : null,
    type : null,
    scopeType : '',
    value : null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  selectedSection = 'scope';
  eventScopeEventSubscrion: any;
  popupControlEventSubscription: any;

  constructor(private _renderer2: Renderer2, private _router: ActivatedRoute,private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,
    private _route: Router,private _helperService : HelperServiceService, private _eventService : EventScopeService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.gotoSection(this.selectedSection);
    this.reactionDisposer = autorun(() => {  

      if(NoDataItemStore.clikedNoDataItem){
        this.openSelectPopup();   
        NoDataItemStore.unSetClickedNoDataItem();
     }
    });
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: "../"}
    ]);

    this.eventScopeEventSubscrion = this._eventEmitterService.eventScopeModal.subscribe(item => {
      this.closeNewScope()
      this.getScopes()
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.getScopes();
  }

  openNewScopeModal(type){
    this.newScopeObject.type =  "Add"
    this.newScopeObject.scopeType =  type
    this.openNewScope();
    }
  
    
    openNewScope(){
      setTimeout(() => {
        $(this.newScope.nativeElement).modal('show');
      }, 100);
      // this._renderer2.addClass(this.newScope.nativeElement,'show');
      this._renderer2.setStyle(this.newScope.nativeElement,'display','block');
      this._renderer2.setStyle(this.newScope.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.newScope.nativeElement,'z-index',99999);
    }
  
    closeNewScope(){
   
      setTimeout(() => {
        // $(this.newScope.nativeElement).modal('hide');
        this.newScopeObject.type = null;
        this.newScopeObject.value = null;
        $(this.newScope.nativeElement).modal('hide');
        this._renderer2.removeClass(this.newScope.nativeElement,'show');
        this._renderer2.setStyle(this.newScope.nativeElement,'display','none');
        $('.modal-backdrop').remove();
        this._utilityService.detectChanges(this._cdr);
      }, 200);
    }

  getScopes(){
    this._eventService.getScopes().subscribe(res=>{
      console.log(EventMonitoringStore.scopeOfWorks)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  


  editScope(type,scope){
    this.newScopeObject.type =  "Edit"
    this.newScopeObject.scopeType =  type
    this.newScopeObject.value =  scope

    this.openNewScope()

  }

     // for delete
     deleteIn(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'delete_inscope_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

     // for delete
     deleteOut(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'delete_exclusion_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

     // for delete
     deleteAssump(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'delete_assumption_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

        // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

     // modal control event
 modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case 'are_you_sure': this.deleteInscope(status)
      break;
    case 'are_you_sure': this.deleteOutscope(status)
      break;
    case 'are_you_sure': this.deleteAssumption(status)
      break;     
  }

}
gotoSection(type) {
  this.selectedSection = type;
  switch (type) {
    case 'scope':
      if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
      {
        NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_scope" });
      }
      else
      {
        NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle" });
      }
      break;
    case 'exclusion':
      if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
      {
        NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_exclusion" });
      }
      else
      {
        NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle"});
      }
      break;
    case 'assumption':
      if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
      {
        NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_assumption" });
      }
      else
      {
        NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle"});
      }
     
      break;
    
  } 
  

}
openSelectPopup() {
  switch (this.selectedSection) {
    case 'scope': this.openNewScopeModal(this.selectedSection); break;
    case 'exclusion': this.openNewScopeModal(this.selectedSection); break;
    case 'assumption': this.openNewScopeModal(this.selectedSection); break;
  }
}

  // delete function call
  deleteInscope(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventService.deleteScope(this.popupObject.id,this.selectedSection).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.getScopes();
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }
  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  // delete function call
  deleteOutscope(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventService.deleteScope(this.popupObject.id,this.selectedSection).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.getScopes();
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  // delete function call
  deleteAssumption(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventService.deleteScope(this.popupObject.id,this.selectedSection).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.getScopes();
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  nodataCheck(inScope){
    let nodata = true;
    if(inScope){
      for(let data of inScope){
        if(data.type == 'scope'){
          nodata = false
        }else{
          if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
          {
            NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_scope" });
          }
          else
          {
            NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle" });
          }

        }
      }
    }   
    return nodata
  }
  nodataCheckOutScope(inScope){
    let nodata = true;
    if(inScope){
      for(let data of inScope){
        if(data.type == 'exclusion'){
          nodata = false
        }else{
          if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
        {
          NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_exclusion" });
        }
        else
        {
          NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle"});
        }

        }
      }
    }   
    return nodata
  }
  nodataCheckAssumption(inScope){
    let nodata = true;
    if(inScope){
      for(let data of inScope){
        if(data.type == 'assumption'){
          nodata = false
        }else{
          if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
          {
            NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_assumption" });
          }
          else
          {
            NoDataItemStore.setNoDataItems({ title: "Looks like Event is not mapped with any item here", subtitle: "common_nodata_subtitle"});
          }

        }
      }
    }   
    return nodata
  }
 


  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.eventScopeEventSubscrion.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();

  }

}
