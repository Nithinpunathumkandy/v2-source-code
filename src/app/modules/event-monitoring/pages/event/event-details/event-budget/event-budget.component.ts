import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Budgets } from 'src/app/core/models/event-monitoring/event-budget';
import { EventBudgetService } from 'src/app/core/services/event-monitoring/event-budget/event-budget.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BudgetStore } from 'src/app/stores/event-monitoring/event-budget-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';

declare var $: any;

@Component({
  selector: 'app-event-budget',
  templateUrl: './event-budget.component.html',
  styleUrls: ['./event-budget.component.scss']
})
export class EventBudgetComponent implements OnInit {

  @ViewChild('newBudget', {static: true}) newBudget: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  BudgetStore = BudgetStore;
  SubMenuItemStore = SubMenuItemStore;
  ProjectMonitoringStore = ProjectMonitoringStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  newBudgetObject = {
    id : null,
    type : null,
    value : null
  }
  
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlEventSubscription: any;
  budgetSubscriptionEvent: any = null;
  EventsStore=EventsStore;
  constructor(
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventBudgetService : EventBudgetService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
   
    this.reactionDisposer = autorun(() => { 
      var subMenuItems=[];
      if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
      {
        subMenuItems.push({activityName: 'CREATE_EVENT_MONITORING_BUDGET', submenuItem: {type: 'new_modal'}})
      } 
      subMenuItems.push({activityName:null, submenuItem: {type: 'close', path: '../'}})
     if(!AuthStore.getActivityPermission(3200,'CREATE_EVENT_MONITORING_BUDGET')){
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
     this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);
     if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
     {
      NoDataItemStore.setNoDataItems({title:"event_budget_nodata_title", subtitle: 'event_budget_nodata_subtitle',buttonText: 'new_event_budget'});
     }
     else
     {
      NoDataItemStore.setNoDataItems({title:"event_budget_nodata_title", subtitle: 'event_budget_nodata_subtitle'});
     }
    

     if (SubMenuItemStore.clikedSubMenuItem) {
      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":
          this.openNewBudgetModal();
          break;
        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    } 

      if(NoDataItemStore.clikedNoDataItem){
        this.openNewBudgetModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.budgetSubscriptionEvent = this._eventEmitterService.eventBudgetModal.subscribe(item => {
      this.closeNewBudget()
      this.pageChange(1)
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange(1)
  }

  pageChange(newPage:number = null){
    if (newPage) BudgetStore.setCurrentPage(newPage);
    this._eventBudgetService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }


  openNewBudgetModal(){
    this.newBudgetObject.type = 'Add';
    this.newBudgetObject.value = null; // for clearing the value
    this.openNewBudget()

  }

  openNewBudget(){
    setTimeout(() => {
      $(this.newBudget.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.newBudget.nativeElement,'display','block');
    this._renderer2.setStyle(this.newBudget.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newBudget.nativeElement,'z-index',99999);
  }

  closeNewBudget(){
 
    setTimeout(() => {
      this.newBudgetObject.type = null;
      this.newBudgetObject.value = null;
      $(this.newBudget.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newBudget.nativeElement,'show');
      this._renderer2.setStyle(this.newBudget.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }


  getBudget(id: number) {
		const Budget: Budgets = BudgetStore.getBudgetById(id);
		//set form value
		this.newBudgetObject.value = {
			amount: Budget.amount,
      year : Budget.year,
      comments : Budget.comments
		}
		this.newBudgetObject.type = 'Edit';
		this.openNewBudget();
	}

  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure';
    this.popupObject.subtitle = 'delete_budget_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  //for popup object clearing
  clearPopupObject() {
      this.popupObject.id = null;
  }

  //modal control event
  modalControl(status: boolean) {
      switch (this.popupObject.title) {
        case 'are_you_sure': this.deleteBudget(status)
          break;
      }
  
    }


  // delete function call
  deleteBudget(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventBudgetService.deleteBudget(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.pageChange(1)
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

  getBudgetTotal(){
    let total = 0
    if(BudgetStore.allItems.length > 0){
      BudgetStore.allItems.map(data=>{
        total = Number(total) + Number(data.amount)
      })
    }
    return total
  }

  getGrandTotalBudget(){
    let total = 0
    if(BudgetStore.allItems.length > 0){
      BudgetStore.allItems.map(data=>{
        total = Number(total) + Number(data.amount)
      })
    }
    return total.toFixed(2)
  }

  editBudget(value){
    event.stopPropagation();
      this.newBudgetObject.type = 'Edit';
      this.newBudgetObject.value = value;
      this.openNewBudget()
      this._utilityService.detectChanges(this._cdr);
    }

  ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.budgetSubscriptionEvent.unsubscribe();
      this.popupControlEventSubscription.unsubscribe();
  
    }
}
