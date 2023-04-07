import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { CyberIncidentWorkflowService } from 'src/app/core/services/cyber-incident/cyber-incident-workflow/cyber-incident-workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { CyberIncidentWorkflowStore } from 'src/app/stores/cyber-incident/cyber-incident-workflow-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
declare var $: any;

@Component({
  selector: 'app-workflow-details',
  templateUrl: './workflow-details.component.html',
  styleUrls: ['./workflow-details.component.scss']
})
export class WorkflowDetailsComponent implements OnInit {
  @ViewChild('userAddModal', { static: true }) userAddModal: ElementRef;
  @ViewChild('designationAddModal', { static: true }) designationAddModal: ElementRef;
  @ViewChild('headUnitAddModal', { static: true }) headUnitAddModal: ElementRef;
  @ViewChild('teamAddModal', { static: true }) teamAddModal: ElementRef;
  @ViewChild('roleAddModal', { static: true }) roleAddModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commonModal') commonModal: ElementRef;

  AuthStore = AuthStore
  SubMenuItemStore = SubMenuItemStore;
  CyberIncidentWorkflowStore = CyberIncidentWorkflowStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  workflowId: number;

  workFlowSourceData = {
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  deleteObject = {
    title: '',
    id: null,
    subtitle: '',
    type: '',
    teamType: ''
  };

  modalStyleSubscription: Subscription
  idleTimeoutSubscription: Subscription
  workflowTeamSubscription: Subscription
  workflowRoleSubscription: Subscription
  workflowUserSubscription: Subscription
  networkFailureSubscription: Subscription
  workflowHeadUnitSubscription: Subscription
  popupControlEventSubscription: Subscription
  workflowDesignationSubscription: Subscription
  cyberIncidentWorkflowCommonSubscription: Subscription
  nextLevelId: number;
  workflowType: string;
  showDiv: boolean = false;
  reactionDisposer: IReactionDisposer;
  constructor(    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _khFileService: KhFileServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _cyberIncidentWorkflowService: CyberIncidentWorkflowService,) { }

  ngOnInit(): void {
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      CyberIncidentWorkflowStore.workflowId = id;
      this.workflowId = id;
      this.getStrategyWorkflow(id);
    });
    this.reactionDisposer = autorun(() => {

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.swithDivStatus();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    NoDataItemStore.setNoDataItems({ title: "no_risk_workflow_data", subtitle: 'no_risk_workflow_sub_data', buttonText: 'add_workflow' });
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../' }
    ]);

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteWorkflow(item);
    });

    this.workflowUserSubscription = this._eventEmitterService.workflowUserAddModal.subscribe(res => {
      this.closeModal(1)
    });

    this.workflowDesignationSubscription = this._eventEmitterService.workflowDesignationAddModal.subscribe(res => {
      this.closeModal(2)
    });

    this.workflowHeadUnitSubscription = this._eventEmitterService.workflowHeadUnitAddModal.subscribe(res => {
      this.closeModal(3)
    });

    this.workflowTeamSubscription = this._eventEmitterService.workflowTeamAddModal.subscribe(res => {
      this.closeModal(4)
    });

    this.workflowRoleSubscription = this._eventEmitterService.workflowRoleAddModal.subscribe(res => {
      this.closeModal(5)
    });

    this.cyberIncidentWorkflowCommonSubscription = this._eventEmitterService.cyberIncidentWorkflowCommonAddModal.subscribe(res => {
      this.closeModal(6)
    });

    this.modalStyleSubscription = this._eventEmitterService.ModalStyle.subscribe(res => {
      this.setZindex()
    });

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    });

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    });
    // this.getStrategyWorkflow();
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }
  createImageUrl(token, type) {
    return this._khFileService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getCreatedByPopupDetails(users, created?: string, type: any = '') {
    let userDetails: any = {};
    if (type == 'user') {
      userDetails['first_name'] = users?.first_name;
      userDetails['last_name'] = users?.last_name;
      userDetails['designation'] = users?.designation;
      userDetails['image_token'] = users?.image?.token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status?.id;
      userDetails['created_at'] = null;
    }
    if (type == 'default') {
      userDetails['first_name'] = users?.created_by.first_name;
      userDetails['last_name'] = users?.created_by.last_name;
      userDetails['designation'] = users?.created_by.designation;
      userDetails['image_token'] = users?.created_by.image.token;
      userDetails['email'] = users?.created_by.email;
      userDetails['mobile'] = users?.created_by.mobile;
      userDetails['id'] = users?.created_by.id;
      userDetails['department'] = users?.created_by.department;
      userDetails['status_id'] = users?.created_by.status.id ? users?.created_by.status.id : users?.created_by?.status?.id;
      userDetails['created_at'] = created ? created : null;
    }
    return userDetails;

  }

  setZindex() {
    this._renderer2.setStyle(this.commonModal.nativeElement, 'z-index', '999999');
    this._renderer2.setStyle(this.commonModal.nativeElement, 'overflow', 'auto');
  }

  deleteWorkflow(status: boolean) {
    if (status && this.deleteObject.id) {
      this._cyberIncidentWorkflowService.deleteWorkflowSections(this.deleteObject.id, this.workflowId).subscribe(resp => {
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

  changeZIndex() {
    if ($(this.commonModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.commonModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.commonModal.nativeElement, 'overflow', 'scroll');
    }
    if ($(this.roleAddModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.roleAddModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.roleAddModal.nativeElement, 'overflow', 'scroll');
    }
    if ($(this.teamAddModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.teamAddModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.teamAddModal.nativeElement, 'overflow', 'scroll');
    }
    if ($(this.userAddModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.userAddModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.userAddModal.nativeElement, 'overflow', 'scroll');
    }
    if ($(this.headUnitAddModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.headUnitAddModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.headUnitAddModal.nativeElement, 'overflow', 'scroll');
    }
    if ($(this.designationAddModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.designationAddModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.designationAddModal.nativeElement, 'overflow', 'scroll');
    }
  }

  clearPopupObject() {
    this.deleteObject.id = null;
    this.deleteObject.title = '';
    this.deleteObject.subtitle = '';
    this.deleteObject.type = '';
  }

  openPopupSection(type: string, level: number) {
    let levelId = level + 1;
    CyberIncidentWorkflowStore.workflowPopupEnabled = true;
    this.workFlowSourceData.type = "Add"
    this.workFlowSourceData.values = {
      workflowId: this.workflowId,
      level: levelId,
      module: 'CI',
      moduleGroupId: 3700
    }
    $(this.commonModal.nativeElement).modal('show');
  }

  workflowPopupsSections(type: string, level?) {

    this.workFlowSourceData.type = type
    this.workFlowSourceData.values = {
      workflowId: this.workflowId,
      level: CyberIncidentWorkflowStore.CyberIncidentWorkflowDetails.workflow_items.length + 1,
      module: 'CI',
      moduleGroupId: 4800
    }
    switch (type) {
      case 'user':
        $(this.userAddModal.nativeElement).modal('show');
        break;
      case 'designation':
        $(this.designationAddModal.nativeElement).modal('show');
        break;
      case 'headOfUnit':
        $(this.headUnitAddModal.nativeElement).modal('show');
        break;
      case 'team':
        $(this.teamAddModal.nativeElement).modal('show');
        break;
      case 'role':
        $(this.roleAddModal.nativeElement).modal('show');
        break;

      case 'common':

        CyberIncidentWorkflowStore.workflowPopupEnabled = true;
        this.workFlowSourceData.values = {
          workflowId: this.workflowId,
          level: level + 1,
          module: 'CI',
      moduleGroupId: 3700
        }
        $(this.commonModal.nativeElement).modal('show');
        break;

      default:
        break;
    }
  }

  closeModal(popUp: number) {
    if (!CyberIncidentWorkflowStore.workflowPopupEnabled) {
      this.workFlowSourceData.type = null;
      this.workFlowSourceData.values = null;
    }

    if (popUp == 1) {
      $(this.userAddModal.nativeElement).modal('hide');
    }
    if (popUp == 2) {
      $(this.designationAddModal.nativeElement).modal('hide');
    }
    if (popUp == 3) {
      $(this.headUnitAddModal.nativeElement).modal('hide');
    }
    if (popUp == 4) {
      $(this.teamAddModal.nativeElement).modal('hide');
    }
    if (popUp == 5) {
      $(this.roleAddModal.nativeElement).modal('hide');
    }
    if (popUp == 6) {
      $(this.commonModal.nativeElement).modal('hide');
    }

    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  getStrategyWorkflow(id) {
    this._cyberIncidentWorkflowService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this.nextLevelId = res.workflow_items.length + 1;
    });
  }

  swithDivStatus() {
    this.showDiv = true;
  }

  deleteWorkflowSections(id: number, type: string, level) {
    event.stopPropagation();
    this.deleteObject.type = '';
    this.deleteObject.id = id;
    this.deleteObject.title = 'Remove Level?';
    this.deleteObject.subtitle = 'Are you sure you want to remove the level ' + level + ' from the Workflow?';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  moveTo(type) {
    switch (type) {
      case 'left':  document.getElementById('slide-user-guide-menu').scrollLeft -=250;

        break;
      case 'right':  document.getElementById('slide-user-guide-menu').scrollLeft += 250;
       
        break;
    }
  }

  ngOnDestroy() {
    CyberIncidentWorkflowStore.workflowId = null;
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    CyberIncidentWorkflowStore.unsetIndividualWorkflow()
    this.modalStyleSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.workflowUserSubscription.unsubscribe();
    this.workflowRoleSubscription.unsubscribe();
    this.workflowUserSubscription.unsubscribe();
    this.workflowUserSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.workflowHeadUnitSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.cyberIncidentWorkflowCommonSubscription.unsubscribe();
    this.workflowDesignationSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
