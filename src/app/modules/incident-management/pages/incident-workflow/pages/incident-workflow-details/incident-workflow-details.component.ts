import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentWorkflowService } from 'src/app/core/services/incident-management/incident-workflow/incident-workflow.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-workflow-store';
declare var $: any;

@Component({
  selector: 'app-incident-workflow-details',
  templateUrl: './incident-workflow-details.component.html',
  styleUrls: ['./incident-workflow-details.component.scss']
})
export class IncidentWorkflowDetailsComponent implements OnInit {
  @ViewChild('userAddModal', { static: true }) userAddModal: ElementRef;
  @ViewChild('designationAddModal', { static: true }) designationAddModal: ElementRef;
  @ViewChild('headUnitAddModal', { static: true }) headUnitAddModal: ElementRef;
  @ViewChild('teamAddModal', { static: true }) teamAddModal: ElementRef;
  @ViewChild('roleAddModal', { static: true }) roleAddModal: ElementRef;
  @ViewChild('systemRoleAddModal', { static: true }) systemRoleAddModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commonModal') commonModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
	IncidentWorkflowStore = IncidentWorkflowStore;
  showDiv: boolean=false;
  workflowId: number;
  nextLevelId: number;
  workflowType: string;
  workFlowSourceData = {
    values: null,
    type: null
  }
  workFlowUserAddObject = {
    values: null,
    type: null
  }
  workFlowDesignationAddObject = {
    values: null,
    type: null
  }
  workFlowHeadofUnitAddObject = {
    values: null,
    type: null
  }
  workFlowTeamAddObject = {
    values: null,
    type: null
  }
  workFlowRoleAddObject = {
    values: null,
    type: null
  }
  workFlowCommonAddObject = {
    values: null,
    type: null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  workflowUserAddModalSubscription: any;
  workflowSystemRoleModalSubscription: any;
  modalStyleSubscription: any;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
	idleTimeoutSubscription: any;

  constructor(	private _renderer2: Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _incidentWorkflowService: IncidentWorkflowService,
    private _router: Router,
    private _khFileService: KhFileServiceService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
   
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      IncidentWorkflowStore.workflowId = this.workflowId = id
      this.getIncidentWorkflow(id);
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
      if(NoDataItemStore.clikedNoDataItem){
        this.swithDivStatus();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    NoDataItemStore.setNoDataItems({title: "no_risk_workflow_data", subtitle: 'no_risk_workflow_sub_data', buttonText: 'add_workflow'});
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../' }
    ]);
   


    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteWorkflow(item);
    })
    this.workflowUserAddModalSubscription = this._eventEmitterService.incidentflowUserAddModal.subscribe(res => {
      this.closeModal(1)
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowIncidentDesignationAddModal.subscribe(res => {
      this.closeModal(2)
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowIncidentHeadUnitAddModal.subscribe(res => {
      this.closeModal(3)
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowIncidentTeamAddModal.subscribe(res => {
      this.closeModal(4)
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowIncidentRoleAddModal.subscribe(res => {
      this.closeModal(5)
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.incidentWorkflowCommonAddModal.subscribe(res => {
      this.closeModal(6)
    });
    this.workflowSystemRoleModalSubscription = this._eventEmitterService.workflowSystemRoleModal.subscribe(res => {
      this.closeModal(7)
    });
    this.modalStyleSubscription = this._eventEmitterService.ModalStyle.subscribe(res => {
      this.setZindex()
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
			if(!status){
			  this.changeZIndex();
			}
		  })
		  this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
			if(!status){
			  this.changeZIndex();
			}
		  })
  }

  setZindex() {
    this._renderer2.setStyle(this.commonModal.nativeElement, 'z-index', '999999');
    this._renderer2.setStyle(this.commonModal.nativeElement, 'overflow', 'auto');
  }

  changeZIndex(){
    if($(this.commonModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.commonModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.commonModal.nativeElement,'overflow','scroll');
    }
    if($(this.roleAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.roleAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.roleAddModal.nativeElement,'overflow','scroll');
    }
    if($(this.teamAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.teamAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.teamAddModal.nativeElement,'overflow','scroll');
    }
    if($(this.userAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.userAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.userAddModal.nativeElement,'overflow','scroll');
    }
    if($(this.headUnitAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.headUnitAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.headUnitAddModal.nativeElement,'overflow','scroll');
    }
    if($(this.designationAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.designationAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.designationAddModal.nativeElement,'overflow','scroll');
    }
    if($(this.systemRoleAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.systemRoleAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.systemRoleAddModal.nativeElement,'overflow','scroll');
    }
  }

  swithDivStatus(){
    this.showDiv = true;
  }

  openPopupSection(type:string,level:number){
    let levelId = level+1;
    IncidentWorkflowStore.workflowPopupEnabled = true;
    this.workFlowSourceData.type = "Add"
    this.workFlowSourceData.values = {
      workflowId: this.workflowId,
      level: levelId,
      module:'IM',
      moduleGroupId:1900
    }
    $(this.commonModal.nativeElement).modal('show');
  }

  workflowPopupsSections(type: string, level?) {
    this.workFlowSourceData.type = type
    this.workFlowSourceData.values = {
      workflowId: this.workflowId,
      level: this.nextLevelId,
      module:'IM',
      moduleGroupId:1900
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
      case 'system_role':
        $(this.systemRoleAddModal.nativeElement).modal('show');
        break;
      case 'common':
          IncidentWorkflowStore.workflowPopupEnabled = true;
            this.workFlowSourceData.values = {
              workflowId: this.workflowId,
              level: level + 1,
              module:'IM',
              moduleGroupId:1900
            }
            $(this.commonModal.nativeElement).modal('show');
            break;
      default:
        break;
    }
  }

  getIncidentWorkflow(id) {
  
    this._incidentWorkflowService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this.nextLevelId = res.workflow_items.length + 1;
    });
  }


  deleteWorkflow(status: boolean) {
    if (status && this.popupObject.id) {
      this._incidentWorkflowService.deleteWorkflowSections(this.popupObject.id,this.workflowId).subscribe(resp => {
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
      this.getIncidentWorkflow(this.workflowId);
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
    
  }

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
  }

  deleteWorkflowSections(id: number, type: string,level) {
    this.workflowType = type;
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Remove Level?';
    this.popupObject.subtitle = 'Are you sure you want to remove the level '+level+' from the Workflow?';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }


  closeModal(popUp: number) {
    if (!IncidentWorkflowStore.workflowPopupEnabled) {
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
    if (popUp == 7) {
      $(this.systemRoleAddModal.nativeElement).modal('hide');
    }
    this.getIncidentWorkflow(this.workflowId)
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  createImageUrl(token, type) {
    return this._khFileService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  viewDescription(type,workflow){
    if(type == 'more')
    workflow.view_more = true;
    else{
      workflow.view_more = false;
      this._utilityService.scrollToTop();
    }
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionContent(workflow){
    var descriptionContent = workflow.description.substring(0,185);
    return descriptionContent;
  }

  getCreatedByPopupDetails(users, created?: string,type:any='') {
    
    let userDetial: any = {};
    if(type=='user'){
      userDetial['first_name'] = users?.first_name;
      userDetial['last_name'] = users?.last_name;
      userDetial['designation'] = users?.designation;
      userDetial['image_token'] = users?.image?.token;
      userDetial['email'] = users?.email;
      userDetial['mobile'] = users?.mobile;
      userDetial['id'] = users?.id;
      userDetial['department'] = users?.department;
      userDetial['status_id'] = users?.status?.id;
      userDetial['created_at'] = null;
    }
    if(type=='default'){
      userDetial['first_name'] = users?.created_by.first_name;
      userDetial['last_name'] = users?.created_by.last_name;
      userDetial['designation'] = users?.created_by.designation;
      userDetial['image_token'] = users?.created_by.image.token;
      userDetial['email'] = users?.created_by.email;
      userDetial['mobile'] = users?.created_by.mobile;
      userDetial['id'] = users?.created_by.id;
      userDetial['department'] = users?.created_by.department;
      userDetial['status_id'] = users?.created_by.status.id ? users?.created_by.status.id : users?.created_by?.status?.id;
      userDetial['created_at'] = created ? created : null;
    }
    return userDetial;

  }

  getTimezoneFormatted(time){
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
    this.popupControlEventSubscription.unsubscribe()
    this.workflowUserAddModalSubscription.unsubscribe()
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.showDiv = false;
    IncidentWorkflowStore.unsetIndividualIncidentTemplate();
  }

}
