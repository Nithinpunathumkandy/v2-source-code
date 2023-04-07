import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectorRef} from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { ContractAssessmentService } from 'src/app/core/services/compliance-management/contract-assessment/contract-assessment.service';
import { ComplainceContractStore } from 'src/app/stores/compliance-management/complaince-checklist/contract-assessment-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
declare var $: any;
@Component({
  selector: 'app-contract-assessment-list',
  templateUrl: './contract-assessment-list.component.html',
  styleUrls: ['./contract-assessment-list.component.scss']
})
export class ContractAssessmentListComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  SubMenuItemStore=SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  NoDataItemStore=NoDataItemStore;
  AppStore=AppStore;
  contractObject = {
    values: null,
    type: null
  };
  deleteObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  deletePopupScubscription:any;
  addAssessmentSubscription:any;
  ComplainceContractStore=ComplainceContractStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _contractAssessmentService:ContractAssessmentService,
    private _humanCapitalService: HumanCapitalService
  ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: '', submenuItem: {type: 'new_modal'}},
        { activityName: null, submenuItem: { type: 'refresh' } },
  
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'search' } },
       
      ]

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_contract'});
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createAssessment();
            break;
          case "refresh":
            ComplainceContractStore.loaded = false;
              this.pageChange(1)
              break;
        
          case "export_to_excel":

           this._contractAssessmentService.exportToExcel();
            break;
          case "search":
            ComplainceContractStore.searchText = SubMenuItemStore.searchText;
            this.pageChange();
            break;
         
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
     
      
      if (NoDataItemStore.clikedNoDataItem) {
        this.createAssessment();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    
    })
    this.addAssessmentSubscription = this._eventEmitterService.addContractAssessmentModal.subscribe(res => {
      this.closeFormModal();
    })
    this.deletePopupScubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })
    this.pageChange(1);
  }

  pageChange(num?)
  {
    if (num) ComplainceContractStore.setCurrentPage(num);
    this._contractAssessmentService.getAllItems(false,'status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  closeFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this._renderer2.removeClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    this.contractObject.type = null;
  }

  createAssessment() {
    this.contractObject.type = 'Add';
    this.contractObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();

  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto')
  }

  gotoDetailsPage(id: number) {
    this._router.navigateByUrl(`/compliance-management/contract-assessments/${id}`)
  }

  deleteChecklist(id,event)
  {
    event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_contract';
    $(this.deletePopup.nativeElement).modal('show');
  }
  
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._contractAssessmentService.delete(this.deleteObject.id);
          break;
      }
      type.subscribe(resp => {
        this.closeConfirmationPopUp();
        this.pageChange(ComplainceContractStore.currentPage);
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      }, (error => {
        this.closeConfirmationPopUp();
        setTimeout(() => {
          if (error.status == 405) {
            
    
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
  edit(id,event)
  {
    event.stopPropagation();
    this._contractAssessmentService.getItem(id).subscribe(res => {
      this.contractObject.type = 'Edit';
      this.contractObject.values = res; // for clearing the value
      this.openFormModal();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  createImageUrl(token) { 
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  ngOnDestroy()
  {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    //ComplainceChecklistStore.unsetChecklist(
    this.deletePopupScubscription.unsubscribe();
    this.addAssessmentSubscription.unsubscribe();
  }

}
