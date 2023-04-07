import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Risks } from 'src/app/core/models/project-monitoring/project-risk';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectRiskService } from 'src/app/core/services/project-monitoring/project-risk/project-risk.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { RiskStore } from 'src/app/stores/project-monitoring/project-risk-store';

declare var $: any;

@Component({
  selector: 'app-project-risk',
  templateUrl: './project-risk.component.html',
  styleUrls: ['./project-risk.component.scss']
})
export class ProjectRiskComponent implements OnInit {
  @ViewChild('newRisk', {static: true}) newRisk: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  RiskStore = RiskStore;
  AuthStore = AuthStore
  SubMenuItemStore = SubMenuItemStore;
  ProjectMonitoringStore = ProjectMonitoringStore
  newRiskObject = {
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
  riskSubscriptionEvent: any = null;

  constructor(
    private _renderer2: Renderer2,
    private _router: ActivatedRoute,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _route: Router,
    private _helperService : HelperServiceService,
    private _projectRiskService : ProjectRiskService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title:"No Project Risks has been added", subtitle: 'Click on the below button to add a new project risk',buttonText: 'New Project Risk'});
    this.reactionDisposer = autorun(() => {  

      // var subMenuItems = [
      //   {activityName: 'PROJECT_MONITORING_RISK_LIST', submenuItem: {type: 'search'}},
      //   {activityName: 'CREATE_PROJECT_MONITORING_RISK', submenuItem: {type: 'new_modal'}},
      //   {activityName: null, submenuItem: { type: 'close', path: '../' } },
      // ]
      if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_MONITORING_RISK')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      // this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewRiskModal();
            break;
          case "search":
             RiskStore.searchText = SubMenuItemStore.searchText;
             this.pageChange(1); 
             break;
          default:
						break;
				}
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.openNewRiskModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.riskSubscriptionEvent = this._eventEmitterService.projectRiskModal.subscribe(item => {
      this.closeNewRisk()
      this.pageChange(1)
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange(1)
  }

  pageChange(newPage:number = null){
    if (newPage) RiskStore.setCurrentPage(newPage);
    this._projectRiskService.getItems().subscribe(res=>{
      this.getSubMenus()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  getSubMenus() {
    
    if(ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='draft' || ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='send-back') {
     var subMenuItems = [
      {activityName: 'PROJECT_MONITORING_RISK_LIST', submenuItem: {type: 'search'}},
      {activityName: 'CREATE_PROJECT_MONITORING_RISK', submenuItem: {type: 'new_modal'}},
      {activityName: null, submenuItem: { type: 'close', path: '../' } },
     ]
     this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
     this._utilityService.detectChanges(this._cdr);
   }else {
     var subMenuItems = [
      {activityName: 'PROJECT_MONITORING_RISK_LIST', submenuItem: {type: 'search'}},
      {activityName: 'CREATE_PROJECT_MONITORING_RISK', submenuItem: {type: ''}},
      {activityName: null, submenuItem: { type: 'close', path: '../' } },
     ]
     this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
   }
   this._utilityService.detectChanges(this._cdr);
 }

  openNewRiskModal(){
    this.newRiskObject.type = 'Add';
    this.newRiskObject.value = null; // for clearing the value
    this.openNewRisk()

  }

  openNewRisk(){
    setTimeout(() => {
      $(this.newRisk.nativeElement).modal('show');
    }, 100);
    // this._renderer2.addClass(this.newRisk.nativeElement,'show');
    this._renderer2.setStyle(this.newRisk.nativeElement,'display','block');
    this._renderer2.setStyle(this.newRisk.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newRisk.nativeElement,'z-index',99999);
  }

  closeNewRisk(){
 
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.newRiskObject.type = null;
      this.newRiskObject.value = null;
      $(this.newRisk.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newRisk.nativeElement,'show');
      this._renderer2.setStyle(this.newRisk.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  getRisk(id: number) {
		const Risk: Risks = RiskStore.getRiskById(id);
		//set form value
		this.newRiskObject.value = {
			title: Risk.title,
      risk_rating_id : Risk.risk_rating_id,
      risk_resolving_plan : Risk.risk_resolving_plan,
		}
		this.newRiskObject.type = 'Edit';
		this.openNewRisk();
	}

  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure';
    this.popupObject.subtitle = 'delete_risk_subtitle';
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
        case 'are_you_sure': this.deleteRisk(status)
          break;
      }
  
    }

  // delete function call
  deleteRisk(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectRiskService.deleteRisk(this.popupObject.id).subscribe(resp => {
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

  editRisk(value){
    event.stopPropagation();
    //  this._projectRiskService.getRisk(value.id).subscribe(res=>{
      this.newRiskObject.type = 'Edit';
      this.newRiskObject.value = value;
      this.openNewRisk()
      this._utilityService.detectChanges(this._cdr);
    // })
  }

  ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.riskSubscriptionEvent.unsubscribe();
      this.popupControlEventSubscription.unsubscribe();
  
    }
}


