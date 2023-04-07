import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RootCauseAnalysis } from 'src/app/core/models/risk-management/risks/root-cause-analyses';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AmFindingRCAStore } from 'src/app/stores/audit-management/am-audit-finding/am-finding-rca.store';
import { AmAuditFindingRcaService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding-rca/am-audit-finding-rca.service';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';

@Component({
  selector: 'app-am-audit-finding-rca',
  templateUrl: './am-audit-finding-rca.component.html',
  styleUrls: ['./am-audit-finding-rca.component.scss']
})
export class AmAuditFindingRcaComponent implements OnInit {

  @ViewChild('addRCAformModal', { static: true }) addRCAformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  rcaAddObject = {
    component: 'am-audit',
    type: null,
    values: null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  rcaRootCauseCategoryChildCloseEvent: any;
  rcaRootCauseSubCategoryChildEvent: any;
  lastItem: any;
  popupControlRiskEventSubscription: any;
  addRCASubscriptionEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AmFindingRCAStore = AmFindingRCAStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  AmAuditFindingStore = AmAuditFindingStore;


  constructor(
    private _rootCauseAnalysesService: AmAuditFindingRcaService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _renderer2: Renderer2,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed')
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_start_RCA' });
    else
    NoDataItemStore.setNoDataItems({ title: "", subtitle: 'common_nodata_title'});
   
    this.reactionDisposer = autorun(() => {
      if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'fieldwork'){

      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings' } },
      ]
    }
    else{
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-findings' } },
      ]
    }

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "template":
            this._rootCauseAnalysesService.generateTemplate(AmAuditFindingStore.auditFindingId);
            break;
          case "export_to_excel":
            this._rootCauseAnalysesService.exportToExcel(AmAuditFindingStore.auditFindingId);
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addRCA();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    //for closing the modal
    this.addRCASubscriptionEvent = this._eventEmitterService.riskRcaModalControl.subscribe(res => {
      this.closeFormModal();
    })

    this.rcaRootCauseCategoryChildCloseEvent = this._eventEmitterService.rcaRootCausechild.subscribe(res => {
      this.setModalstyle();
    })

    this.rcaRootCauseSubCategoryChildEvent = this._eventEmitterService.rcaRootCauseSubChild.subscribe(res => {
      this.setModalFocus();
    })
    // for deleting/activating/deactivating using delete modal
    this.popupControlRiskEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })


    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.addRCAformModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.addRCAformModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.addRCAformModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.addRCAformModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.addRCAformModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.addRCAformModal.nativeElement, 'overflow', 'auto');
      }
    })




    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.pageChange(1);
  }

  // page change event
  pageChange(newPage: number = null) {
    this.lastItem = null;
    var lastWhy = null;
    if (newPage) AmFindingRCAStore.setCurrentPage(newPage);
    this._rootCauseAnalysesService.getItems(AmAuditFindingStore.auditFindingId).subscribe(res => {
      lastWhy = AmFindingRCAStore.allItems[AmFindingRCAStore.allItems.length - 1];
      this.lastItem = lastWhy?.why;
      this._utilityService.detectChanges(this._cdr);
    });


  }

  // for opening modal
  openFormModal() {
    RisksStore.rcaDataLength = null;
    RisksStore.rcaDataLength = AmFindingRCAStore.allItems.length;
    setTimeout(() => {
      ($(this.addRCAformModal.nativeElement) as any).modal('show');
    }, 50);
  }
  // for closing the rca form modal
  closeFormModal() {
    setTimeout(() => {
      ($(this.addRCAformModal.nativeElement) as any).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 50);
    this.rcaAddObject.type = null;
    this.rcaAddObject.values = null;
    this.pageChange();
  }

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users.first_name;
    userDetial['last_name'] = users.last_name;
    userDetial['designation'] = users.designation;
    userDetial['image_token'] = users.image.token;
    userDetial['email'] = users.email;
    userDetial['mobile'] = users.mobile;
    userDetial['id'] = users.id;
    userDetial['department'] = users.department;
    userDetial['status_id'] = users.status_id ? users.status_id : users.status.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;

  }

  setModalstyle() {
    setTimeout(() => {
      this._renderer2.setStyle(this.addRCAformModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
      this._renderer2.setStyle(this.addRCAformModal.nativeElement, 'overflow', 'auto');
    }, 50);
  }

  setModalFocus() {
    setTimeout(() => {
      this._renderer2.setStyle(this.addRCAformModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
      this._renderer2.setStyle(this.addRCAformModal.nativeElement, 'overflow', 'auto');
    }, 50);
  }
  // for opening rca add form modal
  addRCA() {
    this.rcaAddObject.type = 'add';
    this.openFormModal();

  }

  editRCA(id: number) {
    const rca: RootCauseAnalysis = AmFindingRCAStore.getRCAById(id);
    //set form value
    this.rcaAddObject.values = {
      id: rca.id,
      root_cause_category_id: rca.root_cause_category_id,
      root_cause_sub_category_id: rca.root_cause_sub_category_id,
      why: rca.why,
      description: rca.description
    }
    this.rcaAddObject.type = 'Edit';
    this.openFormModal();
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteRCA(status)
        break;
    }
  }

  // delete function call
  deleteRCA(status: boolean) {

    if (status && this.popupObject.id) {
      this._rootCauseAnalysesService.delete(AmAuditFindingStore.auditFindingId, this.popupObject.id).subscribe(res => {
        this.pageChange();
        this._utilityService.detectChanges(this._cdr);
      });

    }
    setTimeout(() => {
      ($(this.confirmationPopUp.nativeElement) as any).modal('hide');
    }, 250);


  }



  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete RCA?';
    this.popupObject.subtitle = 'delete_rca_sub_title';

    ($(this.confirmationPopUp.nativeElement) as any).modal('show');
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  
	getPopupDetails(user) {
		// $('.modal-backdrop').remove(); 
		let userDetailObject: any = {};
		userDetailObject['id'] = user.created_by;
		userDetailObject['first_name'] = user.created_by_first_name;
		userDetailObject['last_name'] = user.created_by_last_name;
		userDetailObject['designation'] = user.created_by_designation;
		userDetailObject['department'] = user.created_by_department;
		userDetailObject['image_token'] = user.created_by_image_token;
		userDetailObject['email'] = user.created_by_email?user.created_by_email:'';
		userDetailObject['mobile'] = user.created_by_mobile?user.created_by_mobile:'';
		userDetailObject['created_at'] = user.created_at;
		return userDetailObject;
	
	  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlRiskEventSubscription.unsubscribe();
    this.addRCASubscriptionEvent.unsubscribe();
    this.rcaRootCauseCategoryChildCloseEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    NoDataItemStore.unsetNoDataItems();

  }


}
