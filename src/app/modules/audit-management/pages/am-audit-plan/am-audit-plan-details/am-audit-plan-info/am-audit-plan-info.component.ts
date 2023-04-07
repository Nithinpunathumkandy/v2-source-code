import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditPlanWorkflowStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan-workflow.store';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AmWorkflowStore } from 'src/app/stores/audit-management/am-workflow-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-am-audit-plan-info',
  templateUrl: './am-audit-plan-info.component.html',
  styleUrls: ['./am-audit-plan-info.component.scss']
})
export class AmAuditPlanInfoComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer:IReactionDisposer;
  AmAuditPlansStore = AmAuditPlansStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AmAuditPlanWorkflowStore = AmAuditPlanWorkflowStore;
  AmWorkflowStore = AmWorkflowStore;
  AuthStore = AuthStore;
  auditPlanObject = {
    component: 'Audit Plan',
    values: null,
    type: null
  };
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  auditPlanEventSubscription: any;


  constructor(private _auditPlansService:AmAuditPlanService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _route:ActivatedRoute,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _renderer2:Renderer2,
    private _router:Router) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      if(AmAuditPlansStore.individualAuditPlanDetails?.am_annual_plan_auditable_item_status?.type!='auditable-item-approved' && AmAuditPlansStore.individualAuditPlanDetails?.am_annual_plan_auditable_item_status?.type!='in-progress'){
        var subMenuItems = [
          { activityName: 'CREATE_AM_ANNUAL_PLAN', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_AM_ANNUAL_PLAN', submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: { type: 'close',path:'/audit-management/am-audit-plans' } },
          ]
      }
      else{
        subMenuItems = [
       
          { activityName: null, submenuItem: { type: 'close',path:'/audit-management/am-audit-plans' } },
          ]
        
      }

         
      
      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              this.editAuditPlan(AmAuditPlansStore.auditPlanId);
            }, 1000);
            break;
            case "delete":
              this.deleteAuditPlan(AmAuditPlansStore.auditPlanId);
              break;
          
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.auditPlanEventSubscription = this._eventEmitterService.auditManagementAuditPlanAddModal.subscribe(item => {
      this.closeFormModal();
    })

  

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    if(AmAuditPlansStore.auditPlanId==null || !AmAuditPlansStore.individual_auditPlan_loaded)
    this.getDetails();
   
  }

  getDetails(){
     
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._auditPlansService.saveAuditPlanId(id);
      this._auditPlansService.getItem(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    })
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }
  


  /**
* Delete the audit plan
* @param id -audit plan id
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._auditPlansService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('/audit-management/am-audit-plans')
        
        }, 500);
        this.clearDeleteObject();
      }, (error => {
        setTimeout(() => {
          if (error.status == 405) {
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  closeFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this.auditPlanObject.type = null;
  }

  deleteAuditPlan(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_plan_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }


  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  editAuditPlan(id) {

    this._auditPlansService.getItem(id).subscribe(res => {

      this.auditPlanObject.values = {
        id: id,
        am_audit_category_id: res['am_audit_category'],
        am_annual_plan_frequency_id: res['am_annual_plan_frequency'],
        start_date: this._helperService.processDate(res['start_date'], 'split'),
        end_date: this._helperService.processDate(res['end_date'], 'split'),

      }
      this.auditPlanObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);

    })
  }

  
	getCreatedByPopupDetails(users, supplier: boolean = false) {
		let userDetial: any = {};

		
			userDetial['first_name'] = users?.first_name ? users?.first_name : '';
			userDetial['last_name'] = users?.last_name;
			userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
			userDetial['image_token'] = users?.image?.token;
			userDetial['email'] = users?.email;
			userDetial['mobile'] = users?.mobile;
			userDetial['id'] = users?.id;
			userDetial['department'] = users?.department;
			userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
      userDetial['created_at']=AmAuditPlansStore?.individualAuditPlanDetails?.created_at;
		
		return userDetial;
	}



  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.auditPlanEventSubscription.unsubscribe();

    SubMenuItemStore.searchText = '';
    AmAuditPlansStore.searchText = '';
  }

}
