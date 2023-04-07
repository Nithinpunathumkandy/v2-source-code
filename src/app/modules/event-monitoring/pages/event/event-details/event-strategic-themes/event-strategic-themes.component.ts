import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import {EventStrategicThemesService} from 'src/app/core/services/event-monitoring/event-strategic-themes/event-strategic-themes.service';
import { StrategicThemesStore } from 'src/app/stores/event-monitoring/events/event-strategic-themes-store';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;
@Component({
  selector: 'app-event-strategic-themes',
  templateUrl: './event-strategic-themes.component.html',
  styleUrls: ['./event-strategic-themes.component.scss']
})
export class EventStrategicThemesComponent implements OnInit,OnDestroy {
  @ViewChild('eventObjectiveModal', {static: true}) eventObjectiveModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('strategicThemeModal', {static: true}) strategicThemeModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  mainAccordianId:any;
  childAccordianId:any;
  selectedKpi:number;
  AppStore=AppStore;
  StrategicThemesStore = StrategicThemesStore;
  EventsStore = EventsStore;
  AuthStore=AuthStore;
  actulExposureEditId:number;
  eventObjective = {
    type: null,
    values: null
  };
  strategicTheme = {
    type: null,
    values: null
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  selectedObjectiveIndex: any = 0;
  selectedObjectiveIndexChild:any =0;
  selectedThemePos: any = 0;
  eventObjectiveSubscription: any = null;
  popupControlEventSubscription: any;
  eventStrategicThemeSubscription: any;
  constructor(private _eventEmitterService: EventEmitterService, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService, private _eventStrategicThemesService: EventStrategicThemesService,
    private _utilityService: UtilityService,private _renderer2: Renderer2,
   
    ) { }

  ngOnInit(): void {
   
    this.reactionDisposer = autorun(() => {  
      var subMenuItems=[];
      if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
      {
        subMenuItems.push({activityName: null, submenuItem: {type: 'new_modal'}})
      //   subMenuItems = [
      //     {activityName: null, submenuItem: {type: 'new_modal'}},
      //     {activityName:null, submenuItem: {type: 'close', path: '../'}}
      //  ]
      }
      subMenuItems.push({activityName:null, submenuItem: {type: 'close', path: '../'}})
       
    if(!AuthStore.getActivityPermission(3700,'CREATE_EVENT_OBJECTIVE') && (EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')){
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
    this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);
    if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
    {
      NoDataItemStore.setNoDataItems({title:"em_event_objective_data_title", subtitle: 'em_event_objective_subtitle',buttonText: 'em_new_event_objective'});
    }
    else
    {
      NoDataItemStore.setNoDataItems({title:"em_event_objective_data_title", subtitle: 'em_event_objective_subtitle'});
    }
    
    //NoDataItemStore.setNoDataItems({title:"em_event_strategic_theme_title", subtitle: 'em_event_strategic_theme_subtitle',buttonText: 'em_new_strategic_theme'});
    
    if (SubMenuItemStore.clikedSubMenuItem) {
      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":
          this.openNewEventObjective();
          break;
        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    } 
    if(NoDataItemStore.clikedNoDataItem){
       this.openNewEventObjective();
      NoDataItemStore.unSetClickedNoDataItem();
    }
  });
  this.eventObjectiveSubscription = this._eventEmitterService.eventObjectModal.subscribe((res)=>{
    this.closeEventObjectModal();
  })
  this.eventStrategicThemeSubscription = this._eventEmitterService.eventStrategicThemeModal.subscribe((res)=>{
    this.closeTheme();
  })
  this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.modalControl(item);
 })
  this.getAllEventObjectives()
  }

  openNewEventObjective() {
		this.eventObjective.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.openNewEventObjectiveModal()
	}

  openNewEventObjectiveModal() {
    setTimeout(() => {
      $(this.eventObjectiveModal.nativeElement).modal('show');
    }, 100);
  }

  changeZIndex() {
		if ($(this.eventObjectiveModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.eventObjectiveModal.nativeElement, 'z-index', 99999);
			this._renderer2.setStyle(this.eventObjectiveModal.nativeElement, 'overflow', 'scroll');
		}
	}

  closeEventObjectModal() {
    $(this.eventObjectiveModal.nativeElement).modal('hide');
    this.eventObjective.type = null;
  }

  getAllEventObjectives()
  {
    this._eventStrategicThemesService.getEventObjective().subscribe(res=>{
      if(res.length)
      {  
          this.getSingleObjectiveDetails(res[0]?.id)
          StrategicThemesStore.setselectedEventObjectId(res[0]?.id);
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }
  selectObjectiveIndexChange(index,id){
    // console.log(index)
    if(this.selectedObjectiveIndex == index){
      this.selectedObjectiveIndex = null;
    }else{
      this.selectedObjectiveIndex = index
    }
    if(this.mainAccordianId)
    {
        if(id!=this.mainAccordianId)
        {
          this.selectedThemePos=0;
        }
    }
    else
    {
      this.selectedThemePos=0;
    }
    this.mainAccordianId=id;
    StrategicThemesStore.setselectedEventObjectId(id);
    this.getSingleObjectiveDetails(id)
  }

  selectObjectiveIndexChangeChild(index,id){

    if(this.selectedObjectiveIndexChild == index){
      this.selectedObjectiveIndexChild = null;
    }else{
      this.selectedObjectiveIndexChild = index
    }
    
  }
  
  selectTheme(pos,id){
    //this.selectedThemeId = id
    this.selectedThemePos = pos;
    if(this.childAccordianId)
    {
        if(id!=this.childAccordianId)
        {
          this.selectedObjectiveIndexChild=0;
        }
    }
    else
    {
      this.selectedObjectiveIndexChild=0;
    }
    this.childAccordianId=id;
    // ProjectMonitoringStore.setFocusAreaId(id)
    // this.getObjectives(this.selectedFocusAreaId);
    // this._utilityService.detectChanges(this._cdr);
  }

  getSingleObjectiveDetails(id)
  {
    this._eventStrategicThemesService.getSingleEventObjectiveDetails(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  editObjective(value)
  {
    event.stopPropagation();
      this.eventObjective.type = 'Edit';
      this.eventObjective.values = value;
      this._utilityService.detectChanges(this._cdr);
      this.openNewEventObjectiveModal();
  }

  
 
   // for delete
   deleteObjective(id: number) {
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure_delete_event_objective';
    this.popupObject.subtitle = 'delete_event_objective_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

      // for popup object clearing
clearPopupObject() {
  this.popupObject.id = null;
}

   // modal control event
modalControl(status: boolean) {
switch (this.popupObject.title) {
  case 'are_you_sure_delete_event_objective': this.deleteEventObjective(status)
  case 'are_you_sure_delete_event_theme': this.deleteEventTheme(status)
    break;
}

}

deleteEventObjective(status: boolean) {
  //console.log(this.popupObject.title)
  if (status && this.popupObject.id && this.popupObject.title=='are_you_sure_delete_event_objective') {
    this._eventStrategicThemesService.deleteEventObjective(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      //this.getAllEventObjectives()
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

deleteEventTheme(status: boolean) {
  if (status && this.popupObject.id && this.popupObject.title=='are_you_sure_delete_event_theme') {
    const index=StrategicThemesStore._eventObjectiveDetails.findIndex(e=>e.id==this.popupObject.id)
    this._eventStrategicThemesService.deleteEventTheme(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        if(index>0)
        {
          this.selectedThemePos=index-1;
        }
        else
        {
          this.selectedThemePos=0;
        }
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      //this.getAllEventObjectives()
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

addTheme(objective)
{
  setTimeout(() => {
    this.strategicTheme.type = 'Add';
    this.strategicTheme.values = {objectiveId:objective.id};
    setTimeout(() => {
      $(this.strategicThemeModal.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.strategicThemeModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.strategicThemeModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.strategicThemeModal.nativeElement,'z-index',99999);
    this._utilityService.detectChanges(this._cdr);
  }, 100);
}

closeTheme()
  {
    setTimeout(() => {
      this.strategicTheme.type = null;
      this.strategicTheme.values = null;
     $(this.strategicThemeModal.nativeElement).modal('hide');
     this._renderer2.removeClass(this.strategicThemeModal.nativeElement,'show');
     this._renderer2.setStyle(this.strategicThemeModal.nativeElement,'display','none');
     this._utilityService.detectChanges(this._cdr);
      
    }, 200);
  }

  editStrategicTheme(theme,objective)
  {
    setTimeout(() => {
      this.strategicTheme.type = 'Edit';
      this.strategicTheme.values = {objectiveId:objective.id,theme:theme};
      setTimeout(() => {
        $(this.strategicThemeModal.nativeElement).modal('show');
      }, 100);
      this._renderer2.setStyle(this.strategicThemeModal.nativeElement,'display','block');
      this._renderer2.setStyle(this.strategicThemeModal.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.strategicThemeModal.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  deleteTheme(id,objectiveId)
  {
    StrategicThemesStore.setselectedEventObjectId(objectiveId);
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure_delete_event_theme';
    this.popupObject.subtitle = 'delete_event_strategic_theme_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  numberOnly(evt): boolean {
	  //console.log(evt.target.value);
	var charCode = (evt.which) ? evt.which : evt.keyCode
	if (charCode != 46 && charCode > 31 
	  && (charCode < 48 || charCode > 57))
	   return false;

	return true;

  }
  editActualExposure(id)
  {
    this.actulExposureEditId=id;
  }

  saveActualExposure(kpiId,actualExposure,eventObjectiveId)
  {
    this.selectedKpi=kpiId;
    AppStore.enableLoading();
   const data={actual_exposure:actualExposure}
    this._eventStrategicThemesService.updateActualExposure(kpiId,data,eventObjectiveId).subscribe(res=>{
      AppStore.disableLoading();
      this.actulExposureEditId=null;
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
    },
    (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
      this.eventObjectiveSubscription.unsubscribe();
      this.popupControlEventSubscription.unsubscribe();
      this.eventStrategicThemeSubscription.unsubscribe();
      StrategicThemesStore.unsetEventObjectives();
  }

}
