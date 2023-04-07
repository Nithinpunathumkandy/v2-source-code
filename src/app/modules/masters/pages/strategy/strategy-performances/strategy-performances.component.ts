import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { StrategyPerformances } from 'src/app/core/models/masters/strategy/strategy-performance.model';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyPerformancesService } from 'src/app/core/services/masters/strategy/strategy-performances/strategy-performances.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyPerformancesMasterStore } from 'src/app/stores/masters/strategy/strategy-performance.store';
declare var $:any;
@Component({
  selector: 'app-strategy-performances',
  templateUrl: './strategy-performances.component.html',
  styleUrls: ['./strategy-performances.component.scss']
})
export class StrategyPerformancesComponent implements OnInit {
  
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  StrategyPerformancesMasterStore = StrategyPerformancesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_performances_message';

  performancesObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  performancesSubscriptionEvent: any = null;
  popupControlEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _performancesService: StrategyPerformancesService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_strategy_performances'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'KPI_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_KPI_TYPE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_KPI_TYPE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_KPI_TYPE', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path:'strategy-management'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_KPI_TYPE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
            this._performancesService.generateTemplate();
            break;
          case "export_to_excel":
            this._performancesService.exportToExcel();
            break;
          case "search":
            StrategyPerformancesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.pageChange(1);

  }

  addNewItem(){
    this.performancesObject.type = 'Add';
    this.performancesObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) StrategyPerformancesMasterStore.setCurrentPage(newPage);
    this._performancesService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // for opening modal
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.performancesObject.type = null;
  }

  // for edit performances
  editPerformances(id: number) {
    const performances: StrategyPerformances = StrategyPerformancesMasterStore.getstrategyPerformancesById(id);
    //set form value
    this.performancesObject.values = {
      id: performances.id,
      title: performances.title,
      description: performances.description
    }
    this.performancesObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deletePerformances(status)
        break;

      case 'Activate': this.activatePerformances(status)
        break;

      case 'Deactivate': this.deactivatePerformances(status)
        break;
    }
  }

  // delete function call
  deletePerformances(status: boolean) {
    if (status && this.popupObject.id) {
      this._performancesService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
             
        if(error.status == 405 && StrategyPerformancesMasterStore.getstrategyPerformancesById(this.popupObject.id).status_id == AppStore.activeStatusId){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else{
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        }

      })
      );
    }
    else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }

  closeConfirmationPopUp(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }
 
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
  }

  // calling activate function
  activatePerformances(status: boolean) {
    if (status && this.popupObject.id) {
      this._performancesService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
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

  // calling deactivate function
  deactivatePerformances(status: boolean) {
    if (status && this.popupObject.id) {
      this._performancesService.deactivate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
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

  // for activate 
  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activate_strategy_performance';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate_strategy_performance';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_strategy_performances';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for sorting
  sortTitle(type: string) {
    this._performancesService.sortPerformanceslList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.performancesSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    StrategyPerformancesMasterStore.searchText = '';
    SubMenuItemStore.searchText='';
    StrategyPerformancesMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
