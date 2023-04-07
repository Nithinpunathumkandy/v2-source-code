import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';

declare var $: any;

@Component({
  selector: 'app-workflow-popup-modal',
  templateUrl: './workflow-popup-modal.component.html',
  styleUrls: ['./workflow-popup-modal.component.scss']
})
export class WorkflowPopupModalComponent implements OnInit {

  @Input('source') WorkFlowSource: any;
  @ViewChild('userAddModal', { static: true }) userAddModal: ElementRef;
  @ViewChild('designationAddModal', { static: true }) designationAddModal: ElementRef;
  @ViewChild('headUnitAddModal', { static: true }) headUnitAddModal: ElementRef;
  @ViewChild('teamAddModal', { static: true }) teamAddModal: ElementRef;
  @ViewChild('roleAddModal', { static: true }) roleAddModal: ElementRef;
  @ViewChild('systemRoleAddModal', { static: true }) systemRoleAddModal: ElementRef;
  loadPopup:boolean = false;
  AuditWorkflowStore = AuditWorkflowStore;
  workflowUserAddModalSubscription: any;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowUserAddModal.subscribe(res => {
      this.closeModal(1)
      // this._utilityService.detectChanges(this._cdr);
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowDesignationAddModal.subscribe(res => {
      this.closeModal(2)
      // this._utilityService.detectChanges(this._cdr);
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowHeadUnitAddModal.subscribe(res => {
        this.closeModal(3)
      // this._utilityService.detectChanges(this._cdr);
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowTeamAddModal.subscribe(res => {
        this.closeModal(4)
      
      // this._utilityService.detectChanges(this._cdr);
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowRoleAddModal.subscribe(res => {

        this.closeModal(5)
      // this._utilityService.detectChanges(this._cdr);
    });
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowSystemRoleModal.subscribe(res => {
      this.closeModal(6)
    });
  }

  // closeModal(){
  //   switch (AuditWorkflowStore.enabledPopup) {
  //     case 'user':
  //       $(this.userAddModal.nativeElement).modal('hide');
  //       this.close();
  //       break;
  //     case 'designation':
  //       $(this.designationAddModal.nativeElement).modal('hide');
  //       this.close();
  //       break;
  //     case 'head-of-the-unit':
  //       $(this.headUnitAddModal.nativeElement).modal('hide');
  //       this.close();
  //       break;
  //     case 'team':
  //       $(this.teamAddModal.nativeElement).modal('hide');
  //       this.close();
  //       break;
  //     case 'user-type':
  //       $(this.roleAddModal.nativeElement).modal('hide');
  //       this.close();
  //       break;

  //     default:
  //       break;
  //   }
  // }

  closeModal(popUp: number) {



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
      $(this.systemRoleAddModal.nativeElement).modal('hide');
    }

    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  showPopUp(type:string){
    this.loadPopup = true;
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
      case 'role':
        $(this.systemRoleAddModal.nativeElement).modal('show');
        break;
      default:
        break;
    }
    // this.close();
  }

  close() {
    this.loadPopup = false;
    // this._eventEmitterService.dismissAuditWorkflowCommonAddModal()
  }
}
