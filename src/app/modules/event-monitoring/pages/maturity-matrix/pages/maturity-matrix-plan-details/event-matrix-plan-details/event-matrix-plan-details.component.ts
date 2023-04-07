import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild,Renderer2 } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MaturityMatrixService } from 'src/app/core/services/event-monitoring/event-maturity-matrix/maturity-matrix.service';
import { MaturityMatrixPlanStore } from 'src/app/stores/event-monitoring/event-maturity-matrix/event-maturity-matrix-plan-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-event-matrix-plan-details',
  templateUrl: './event-matrix-plan-details.component.html',
  styleUrls: ['./event-matrix-plan-details.component.scss']
})
export class EventMatrixPlanDetailsComponent implements OnInit {
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  @ViewChild('matrixPlanModal') matrixPlanModal: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  MaturityMatrixPlanStore=MaturityMatrixPlanStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  matrixPlan = {
    type: null,
    values: null
  };

  planId: number;
  matrixPlanSubscription: any = null;
  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _maturityMatrixService: MaturityMatrixService,
    private _renderer2: Renderer2,

  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.route.params.subscribe(params => {
      this.planId = +params['id']; // (+) converts string 'id' to a number                        
    });

    if (MaturityMatrixPlanStore.selectedPlanId || this.planId) {
      this.getMatrixPlanDetails(this.planId)
    } else {
      this._router.navigateByUrl('event-monitoring/maturity-matrix/maturity-matrix-plan');
    }

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'UPDATE_MATURITY_MATRIX_PLAN', submenuItem: { type: 'edit_modal' } },
        // { activityName: null, submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editPlan();
            break;

          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    
    this.matrixPlanSubscription = this._eventEmitterService.matrixPlanModal.subscribe(item => {
      this.closeMatrixPlanModal();
    })

  

    
  }

  getMatrixPlanDetails(id)
  {
    this._maturityMatrixService.getPlanItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

 
  closeMatrixPlanModal()
  {
    setTimeout(() => {
      this.matrixPlan.type = null;
      this.matrixPlan.values = null;
     $(this.matrixPlanModal.nativeElement).modal('hide');
     this._renderer2.removeClass(this.matrixPlanModal.nativeElement,'show');
     this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'display','none');
     this._utilityService.detectChanges(this._cdr);
      
    }, 200);
  }

  editPlan(){
    event.stopPropagation();
    setTimeout(() => {
      this.matrixPlan.type = 'Edit';
      this.matrixPlan.values = {id:this.planId};
      setTimeout(() => {
        $(this.matrixPlanModal.nativeElement).modal('show');
      }, 100);
      this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'display','block');
      this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
    return userDetial;
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }



  

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    this.matrixPlanSubscription.unsubscribe();
    //MaturityMatrixPlanStore.unsetMatricPlanDetails();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    // this.popupControlEventSubscription.unsubscribe();
  }

}
