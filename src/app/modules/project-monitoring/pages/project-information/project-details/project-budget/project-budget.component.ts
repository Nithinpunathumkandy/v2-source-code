import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Budgets } from 'src/app/core/models/project-monitoring/project-budget';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectBudgetService } from 'src/app/core/services/project-monitoring/project-budget/project-budget.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BudgetStore } from 'src/app/stores/project-monitoring/project-budget-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-project-budget',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.scss']
})
export class ProjectBudgetComponent implements OnInit, OnDestroy {

  @ViewChild('newBudget', {static: true}) newBudget: ElementRef;
  @ViewChild('newPayment', {static: true}) newPayment: ElementRef;
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
  newPaymentObject = {
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
  paymentSubscriptionEvent: any;

  constructor(
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _projectBudgetService : ProjectBudgetService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title:"No project budget has been added", subtitle: 'Click on the below button to add a new project budget',buttonText: 'New Project budget'});
    this.reactionDisposer = autorun(() => {  
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'close', path: '../'}}
     ]
     this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);

      if(NoDataItemStore.clikedNoDataItem){
        this.openNewBudgetModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.budgetSubscriptionEvent = this._eventEmitterService.projectBudgetModal.subscribe(item => {
      this.closeNewBudget()
      // this.pageChange(1)
    })
    this.paymentSubscriptionEvent = this._eventEmitterService.ProjectPaymentModal.subscribe(item => {
      this.closeNewPayment()
      this.pageChange(1)
      this.getPaymentsList()

    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange(1)
    this.getPaymentsList()
  }

  pageChange(newPage:number = null){
    if (newPage) BudgetStore.setCurrentPage(newPage);
    this._projectBudgetService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getPaymentsList(){
    this._projectBudgetService.getPaymentList().subscribe(res=>{
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
    // this._renderer2.addClass(this.newBudget.nativeElement,'show');
    this._renderer2.setStyle(this.newBudget.nativeElement,'display','block');
    this._renderer2.setStyle(this.newBudget.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newBudget.nativeElement,'z-index',99999);
  }

  closeNewBudget(){
 
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.newBudgetObject.type = null;
      this.newBudgetObject.value = null;
      $(this.newBudget.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newBudget.nativeElement,'show');
      this._renderer2.setStyle(this.newBudget.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  openNewPaymentModal(){
    this.newPaymentObject.type = 'Add';
    this.newPaymentObject.value = null; // for clearing the value
    this.openNewPayment()

  }

  openNewPayment(){
    setTimeout(() => {
      $(this.newPayment.nativeElement).modal('show');
    }, 100);
    this._renderer2.addClass(this.newPayment.nativeElement,'show');
    this._renderer2.setStyle(this.newPayment.nativeElement,'display','block');
    this._renderer2.setStyle(this.newPayment.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newPayment.nativeElement,'z-index',99999);
    this._utilityService.detectChanges(this._cdr)
 
  }

  closeNewPayment(){
 
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.newPaymentObject.type = null;
      this.newPaymentObject.value = null;
      $(this.newPayment.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newPayment.nativeElement,'show');
      this._renderer2.setStyle(this.newPayment.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  editPayment(payment){
    // event.stopPropagation();
    this.newPaymentObject.type = 'Edit'
    this.newPaymentObject.value = payment;
    this.openNewPayment();
    this._utilityService.detectChanges(this._cdr);
  }

  getBudget(id: number) {
		const Budget: Budgets = BudgetStore.getBudgetById(id);
		//set form value
		this.newBudgetObject.value = {
			amount: Budget.amount,
      year : Budget.year,
		}
		this.newBudgetObject.type = 'Edit';
		this.openNewBudget();
	}

  deletePayment(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_payment';
    this.popupObject.subtitle = 'pm_payment_delete_message';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_budget';
    this.popupObject.subtitle = 'pm_budget_delete_message';
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
        case 'delete_budget': this.deleteBudget(status)
          break;
          case 'delete_payment': this.deleteProjectPayment(status)
          break;
      }
  
    }


     // delete payment function call
  deleteProjectPayment(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectBudgetService.deletePayment(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.pageChange(1);
        this.getPaymentsList();
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
  deleteBudget(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectBudgetService.deleteBudget(this.popupObject.id).subscribe(resp => {
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
  totalPayment(){
    let total  = 0
    if(BudgetStore.payment.length > 0){
      BudgetStore.payment.map(data=>{
        total = Number(total) + Number(data.payment_total)
      })
    }
    return Number(total)
  }

  totalPerc(){
   let per = (this.totalPayment()*100)/this.getBudgetTotal()
   return Math.trunc(per)
  }

  getGrandTotal(){
    let total  = 0
    if(BudgetStore.payment.length > 0){
      BudgetStore.payment.map(data=>{
        total = Number(total) + Number(data.payment_total)
      })
    }
    return total.toFixed(2)
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
    // this._projectService.induvalProjectInformation(id).subscribe(res=>{
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
      this.paymentSubscriptionEvent.unsubscribe();
  
    }
}
