import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
// import{ProjectIssueStatusMasterStore} from '../../../../../stores/masters/project-monitoring/project-issue-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ProjectIssueStatusService } from 'src/app/core/services/masters/project-monitoring/project-issue-status/project-issue-status.service';
import { ProjectIssueStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-issue-store';

declare var $: any;

@Component({
  selector: 'app-project-issue-status',
  templateUrl: './project-issue-status.component.html',
  styleUrls: ['./project-issue-status.component.scss']
})
export class ProjectIssueStatusComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  ProjectIssueStatusMasterStore = ProjectIssueStatusMasterStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
   popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  deleteEventSubscription: any;

  constructor(
    private _projectIssueStatusService: ProjectIssueStatusService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,

  ) { }

  ngOnInit() {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'PROJECT_ISSUE_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_PROJECT_ISSUE_STATUS', submenuItem: {type: 'export_to_excel'}},

        {activityName: null, submenuItem: {type: 'close', path: 'project-monitoring'}},
      ]
     
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
         
          case "export_to_excel":
            this._projectIssueStatusService.exportToExcel();
            break;
            case "search":
              ProjectIssueStatusMasterStore.searchText  = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
           
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.pageChange(1);
  }

   pageChange(newPage: number = null) {
    if (newPage)ProjectIssueStatusMasterStore.setCurrentPage(newPage);
    this._projectIssueStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

//    Delte New Modal
// modal Control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {

    case 'Activate': this.activateProjectIssueStatus(status)
      break;

    case 'Deactivate': this.deactivateProjectIssueStatus(status)
      break;
  }
}

activateProjectIssueStatus(status){
  if (status && this.popupObject.id) {
  
    this._projectIssueStatusService.activate(this.popupObject.id)
    .subscribe(resp => { setTimeout(() => {
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
deactivateProjectIssueStatus(status){
  if (status && this.popupObject.id) {
    this._projectIssueStatusService.deactivate(this.popupObject.id)
    .subscribe(resp => { setTimeout(() => {
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

closeConfirmationPopUp(){
  $(this.confirmationPopUp.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}

// for popup object clearing
clearPopupObject() {
  this.popupObject.id = null;

}

// for activate 
activate(id: number) {
 // event.stopPropagation();
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'activate_project_objective';
  this.popupObject.subtitle = 'are_you_sure_activate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
//event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'deactivate_project_objective';
  this.popupObject.subtitle = 'are_you_sure_deactivate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    // this.projectObjectiveSubscriptionEvent.unsubscribe();
    ProjectIssueStatusMasterStore.searchText = '';
    ProjectIssueStatusMasterStore.currentPage = 1 ;

  }

//    // for sorting

 sortTitle(type: string) {
  ProjectIssueStatusMasterStore.setCurrentPage(1);
  this._projectIssueStatusService.sortProjectObjectiveList(type, SubMenuItemStore.searchText);
  this.pageChange();
}
}
  
