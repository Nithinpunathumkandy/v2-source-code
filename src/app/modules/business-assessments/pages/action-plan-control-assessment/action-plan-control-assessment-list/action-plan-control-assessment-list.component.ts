import { Component, OnInit, ElementRef, ViewChild,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer,autorun } from 'mobx';
import { ControlAssessmentActionPlanService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-action-plan/control-assessment-action-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CAActionPlanStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-action-plan-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-action-plan-control-assessment-list',
  templateUrl: './action-plan-control-assessment-list.component.html',
  styleUrls: ['./action-plan-control-assessment-list.component.scss']
})
export class ActionPlanControlAssessmentListComponent implements OnInit {

  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  actionPlanModalObject = {
    values: null,
    type: null,
    controlId:null,
  };
  deleteObject = {
    id: null,
    type: '',
    subtitle:''
  };
  actionPlanSubscriptionEvent: any = null;
  NoDataItemStore=NoDataItemStore;
  SubMenuItemStore=SubMenuItemStore;
  CAActionPlanStore=CAActionPlanStore;
  AppStore=AppStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  deleteEventSubscription:any;
  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _controlAssessmentActionPlanService:ControlAssessmentActionPlanService,
    private _router: Router
  ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: '', submenuItem: { type: 'refresh' } },
        // { activityName: 'GENERATE_BUSINESS_ASSESSMENT_FRAMEWORK_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: '', submenuItem: { type: 'export_to_excel' } },
        { activityName: '', submenuItem: { type: 'search' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "control_assessment_title", subtitle: 'control_assessment_nodata_subtitle'});
     
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "refresh":
            CAActionPlanStore.loaded = false;
              this.pageChange(1)
              break;
          case "export_to_excel":

            this._controlAssessmentActionPlanService.exportToExcel();
            break;
          case "search":
            CAActionPlanStore.searchText = SubMenuItemStore.searchText;
            this.searchActionPlan();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.actionPlanSubscriptionEvent = this._eventEmitterService.controlAssessmentActionModalControl.subscribe(res => {
      this.closeFormModal();
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })
    this.pageChange(1)
  }
  
  addNewActionPlan(){
    this.actionPlanModalObject.type = 'Add';
    this.actionPlanModalObject.values=null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  searchActionPlan() {
    CAActionPlanStore.setCurrentPage(1);
    this._controlAssessmentActionPlanService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  pageChange(page:number)
  {
    if (page) CAActionPlanStore.setCurrentPage(page);
    this._controlAssessmentActionPlanService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
 
  }

  closeFormModal() {
    //this.pageChange(1);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this.actionPlanModalObject.type = null;
  }
  getDetails(id)
  {
    this._router.navigateByUrl('/business-assessments/control-assessment-action-plans/'+id);
  }

  edit(id,event)
  {
    event.stopPropagation();
    this._controlAssessmentActionPlanService.getItem(id).subscribe(res => {
      this.actionPlanModalObject.controlId=res['control_assessment_document_version_content_control'].id
      this.actionPlanModalObject.values = {
        id: res['id'],
        title: res['title'],
        description: res['description'],
        responsible_users: res['responsible_users'],
        start_date:res['start_date'],
        target_date:res['target_date'],
    
      }
      this.actionPlanModalObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        this.openFormModal();
      }, 100);

    })
  }

  deleteActionPlan(id,event)
  {
    event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_control_assessment_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._controlAssessmentActionPlanService.delete(this.deleteObject.id);
          break;
      }
      type.subscribe(resp => {
        this.closeConfirmationPopUp();
        this.pageChange(CAActionPlanStore.currentPage);
        // setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      }, (error => {
        this.closeConfirmationPopUp();
        setTimeout(() => {
          if (error.status == 405) {
            // this.deactivate(this.deleteObject.id);
    
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.closeConfirmationPopUp();
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }
  closeConfirmationPopUp() {
    // setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    // }, 250);
  }
  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

    // for sorting
    sortTitle(type: string) {
      // FindingsStore.setCurrentPage(1);
      this._controlAssessmentActionPlanService.sortActionPlanList(type, null);
      this.pageChange(1);
    }

  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.actionPlanSubscriptionEvent.unsubscribe();
    CAActionPlanStore.unsetCAActionPlans();
    this.deleteEventSubscription.unsubscribe();
  }

}
