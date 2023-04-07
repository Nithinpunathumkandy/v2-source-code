import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';

declare var $: any;
@Component({
  selector: 'app-audit-workflow-common-popup',
  templateUrl: './audit-workflow-common-popup.component.html',
  styleUrls: ['./audit-workflow-common-popup.component.scss']
})
export class AuditWorkflowCommonPopupComponent implements OnInit {
  @Input('source') WorkFlowSource: any;
  @ViewChild('userAddModal', { static: true }) userAddModal: ElementRef;
  @ViewChild('designationAddModal', { static: true }) designationAddModal: ElementRef;
  @ViewChild('headUnitAddModal', { static: true }) headUnitAddModal: ElementRef;
  @ViewChild('teamAddModal', { static: true }) teamAddModal: ElementRef;
  @ViewChild('roleAddModal', { static: true }) roleAddModal: ElementRef;

  loadPopup:boolean = false;
  AuditWorkflowStore = AuditWorkflowStore;
  workflowUserAddModalSubscription: any;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.workflowUserAddModalSubscription = this._eventEmitterService.auditWorkflowUserAddModal.subscribe(res => {
      if(AuditWorkflowStore.enabledPopup){
        this.closeModal();
      }
      this._utilityService.detectChanges(this._cdr);
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.auditWorkflowDesignationAddModal.subscribe(res => {
      if(AuditWorkflowStore.enabledPopup){
        this.closeModal()
      }
      this._utilityService.detectChanges(this._cdr);
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.auditWorkflowHeadUnitAddModal.subscribe(res => {
      if(AuditWorkflowStore.enabledPopup){
        this.closeModal()
      }
      this._utilityService.detectChanges(this._cdr);
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.auditWorkflowTeamAddModal.subscribe(res => {
      if(AuditWorkflowStore.enabledPopup){
        this.closeModal()
      }
      this._utilityService.detectChanges(this._cdr);
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.auditWorkflowRoleAddModal.subscribe(res => {
      if(AuditWorkflowStore.enabledPopup){
        this.closeModal()
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  closeModal(){
    switch (AuditWorkflowStore.enabledPopup) {
      case 'user':
        $(this.userAddModal.nativeElement).modal('hide');
        this.close();
        break;
      case 'designation':
        $(this.designationAddModal.nativeElement).modal('hide');
        this.close();
        break;
      case 'head-of-the-unit':
        $(this.headUnitAddModal.nativeElement).modal('hide');
        this.close();
        break;
      case 'team':
        $(this.teamAddModal.nativeElement).modal('hide');
        this.close();
        break;
      case 'user-type':
        $(this.roleAddModal.nativeElement).modal('hide');
        this.close();
        break;

      default:
        break;
    }
  }

  showPopUp(type:string){
    this.loadPopup = true;
    this.AuditWorkflowStore.enabledPopup = type;
    switch (type) {
      case 'user':
        $(this.userAddModal.nativeElement).modal('show');
        break;
      case 'designation':
        $(this.designationAddModal.nativeElement).modal('show');
        break;
      case 'head-of-the-unit':
        $(this.headUnitAddModal.nativeElement).modal('show');
        break;
      case 'team':
        $(this.teamAddModal.nativeElement).modal('show');
        break;
      case 'user-type':
        $(this.roleAddModal.nativeElement).modal('show');
        break;

      default:
        break;
    }
    // this.close();
  }

  close() {
    this.loadPopup = false;
    this._eventEmitterService.dismissAuditWorkflowCommonAddModal()
  }

}
