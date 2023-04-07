import { Component, OnInit,ElementRef,ViewChild,ChangeDetectorRef,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ControlAssessmentDetailsStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-details-store';
import { ControlAssessmentInnerDetailsService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-inner-details/control-assessment-inner-details.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ControlAssessmentStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment.store';

declare var $: any;
@Component({
  selector: 'app-assessment-in-control',
  templateUrl: './assessment-in-control.component.html',
  styleUrls: ['./assessment-in-control.component.scss']
})
export class AssessmentInControlComponent implements OnInit,OnDestroy {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  ControlAssessmentDetailsStore=ControlAssessmentDetailsStore;
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  ControlAssessmentStore=ControlAssessmentStore;
  reactionDisposer: IReactionDisposer;
  controlAssessmentModalObject = {
    values: null,
    type: null
  };
  deleteObject = {
    id: null,
    type: '',
    subtitle:''
  };
  controlAssessmentSubscriptionEvent: any = null;
  deleteEventSubscription: any;
  NoDataItemStore=NoDataItemStore;
  AuthStore=AuthStore;
  AppStore=AppStore;
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _controlAssessmentInnerDetailsService: ControlAssessmentInnerDetailsService,

  ) { }

  ngOnInit(): void {
    ControlAssessmentDetailsStore.unSetControlAssessmentId();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"control_assessments",
        path:`/business-assessments/control-assessments`
      });
    }
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: '', submenuItem: { type: 'new_modal' } },
        { activityName: '', submenuItem: { type: 'refresh' } },
        // { activityName: 'GENERATE_BUSINESS_ASSESSMENT_FRAMEWORK_TEMPLATE', submenuItem: { type: 'template' } },
        //{ activityName: '', submenuItem: { type: 'export_to_excel' } },
        { activityName: '', submenuItem: { type: 'search' } },
        { activityName: '', submenuItem: { type: 'close',path:'/business-assessments/control-assessments' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "cyber_control_assessment_title", subtitle: 'cyber_control_assessment_nodata_subtitle',buttonText: 'cyber_add_control_assessment_modal'});
     
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.addNewControlAssessment();
            }, 1000);
            break;
          case "refresh":
            ControlAssessmentDetailsStore.loaded = false;
              this.pageChange(1)
              break;
          // case "export_to_excel":

          //   this._controlAssessmentInnerDetailsService.exportToExcel('?status=all&document_version_ids='+ControlAssessmentStore?.docversionId);
          //   break;
          case "search":
            ControlAssessmentDetailsStore.searchText = SubMenuItemStore.searchText;
            this.searchControlAssesment();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewControlAssessment();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.controlAssessmentSubscriptionEvent = this._eventEmitterService.conrolAssessmentModalControl.subscribe(res => {
      this.closeFormModal();
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })
    this.pageChange(1)
  }

  searchControlAssesment() {
    ControlAssessmentDetailsStore.setCurrentPage(1);
    this._controlAssessmentInnerDetailsService.getItems(false,'status=all'+'&document_ids='+ControlAssessmentStore?.docDetails?.id).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }
  pageChange(page:number)
  {
    if (page) ControlAssessmentDetailsStore.setCurrentPage(page);
    this._controlAssessmentInnerDetailsService.getItems(false,'status=all'+'&document_ids='+ControlAssessmentStore?.docDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  addNewControlAssessment(){
    this.controlAssessmentModalObject.type = 'Add';
    this.controlAssessmentModalObject.values=null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
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
    this.controlAssessmentModalObject.type = null;
  }

  gotoRedirect(item)
  {
    ControlAssessmentDetailsStore.setControlAssessmentId(item.id);
    ControlAssessmentDetailsStore.setControlAssessmentDocumentversionId(item.document_version_id);
    ControlAssessmentDetailsStore.setControlAssessmentDocumentversionData(item);
    this._router.navigateByUrl('/business-assessments/control-assessments/'+item?.document_version_id
    +'/assessments/'+item.id);
  }
  edit(id,event)
  {
    event.stopPropagation();
    this._controlAssessmentInnerDetailsService.getItem(id).subscribe(res => {

      this.controlAssessmentModalObject.values = {
        id: res['id'],
        title: res['title'],
        description: res['description'],
        business_assessment_framework: res['business_assessment_framework'],
        maturity_model_id:res['maturity_model']
      }
      this.controlAssessmentModalObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        this.openFormModal();
      }, 100);

    })
  }
  deleteAssessment(id,event)
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
        case '': type = this._controlAssessmentInnerDetailsService.delete(this.deleteObject.id);
          break;
      }
      type.subscribe(resp => {
        this.closeConfirmationPopUp();
        this.pageChange(ControlAssessmentDetailsStore.currentPage);
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
  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.controlAssessmentSubscriptionEvent.unsubscribe();
    ControlAssessmentDetailsStore.unsetControlAssessmentDetails()
    this.deleteEventSubscription.unsubscribe();
  }

}
