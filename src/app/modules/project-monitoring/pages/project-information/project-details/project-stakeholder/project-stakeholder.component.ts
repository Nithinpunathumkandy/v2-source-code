import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StakeholderStore } from 'src/app/stores/project-monitoring/project-stakeholder-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { Stakeholder } from 'src/app/core/models/project-monitoring/project-monitoring.modal';

declare var $: any;

@Component({
  selector: 'app-project-stakeholder',
  templateUrl: './project-stakeholder.component.html',
  styleUrls: ['./project-stakeholder.component.scss']
})
export class ProjectStakeholderComponent implements OnInit {
  @ViewChild('newStakeholder', {static: true}) newStakeholder: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  StakeholderStore = StakeholderStore;
  SubMenuItemStore = SubMenuItemStore;
  newStakeholderObject = {
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
  stakeholderSubscriptionEvent: any = null;

  constructor(
    private _renderer2: Renderer2,
    private _router: ActivatedRoute,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _route: Router,
    private _helperService : HelperServiceService,
    private _projectService : ProjectMonitoringService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title:"No Stakeholders has been added", subtitle: 'Click on the below button to add a new stakeholder',buttonText: 'New Stakeholder'});
    this.reactionDisposer = autorun(() => {  

      var subMenuItems = [
        {activityName: 'PROJECT_MONITORING_STAKEHOLDER_LIST', submenuItem: {type: 'search'}},
        {activityName: 'CREATE_PROJECT_MONITORING_STAKEHOLDER', submenuItem: {type: 'new_modal'}},
        {activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      if(!AuthStore.getActivityPermission(3200,'CREATE_STRATEGY_PROFILE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewStakeholderModal();
            break;
          case "search":
             StakeholderStore.searchText = SubMenuItemStore.searchText;
             this.pageChange(1); 
             break;
          default:
						break;
				}
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.openNewStakeholderModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.stakeholderSubscriptionEvent = this._eventEmitterService.projectStakeholderModal.subscribe(item => {
      this.closeNewStakeholder();
      this.pageChange(1)
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange(1)
  }

  pageChange(newPage:number = null){
    if (newPage) StakeholderStore.setCurrentPage(newPage);
    this._projectService.getItemStakeholder().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openNewStakeholderModal(){
    this.newStakeholderObject.type = 'Add';
    this.newStakeholderObject.value = null; // for clearing the value
    this.openNewStakeholder()

  }

  openNewStakeholder(){
    this._renderer2.addClass(this.newStakeholder.nativeElement,'show');
    this._renderer2.setStyle(this.newStakeholder.nativeElement,'display','block');
    this._renderer2.setStyle(this.newStakeholder.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newStakeholder.nativeElement,'z-index',99999);
  }

  closeNewStakeholder(){
 
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.newStakeholderObject.type = null;
      this.newStakeholderObject.value = null;
      this._renderer2.removeClass(this.newStakeholder.nativeElement,'show');
      this._renderer2.setStyle(this.newStakeholder.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  getStakeholder(id: number) {
		const Stakeholder: Stakeholder = StakeholderStore.getStakeholderById(id);
		//set form value
		this.newStakeholderObject.value = {
			title: Stakeholder.title,
		}
		this.newStakeholderObject.type = 'Edit';
		this.openNewStakeholder();
	}

  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_stakeholder?';
    this.popupObject.subtitle = 'delete_stakeholder_subtitle';
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
        case '': this.deleteStakeholder(status)
          break;
      }
  
    }

  // delete function call
  deleteStakeholder(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectService.deleteStakeholder(this.popupObject.id).subscribe(resp => {
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

  editStakeholder(value){
    event.stopPropagation();
    // this._projectService.induvalProjectInformation(id).subscribe(res=>{
      this.newStakeholderObject.type = 'Edit';
      this.newStakeholderObject.value = value;
      this.openNewStakeholder()
      this._utilityService.detectChanges(this._cdr);
    }

  ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.stakeholderSubscriptionEvent.unsubscribe();
      this.popupControlEventSubscription.unsubscribe();
  
    }  


}
