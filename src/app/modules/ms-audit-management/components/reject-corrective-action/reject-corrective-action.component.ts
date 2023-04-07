import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { FollowUpService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/follow-up/follow-up.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditPlanWorkflowStore } from 'src/app/stores/ms-audit-management/audit-plan-workflow/audit-plan-workflow.store';
@Component({
  selector: 'app-reject-corrective-action',
  templateUrl: './reject-corrective-action.component.html',
  styleUrls: ['./reject-corrective-action.component.scss']
})
export class RejectCorrectiveActionComponent implements OnInit {
  @Input('source') caSource : any;

    AppStore = AppStore;
    AuditPlanWorkflowStore = AuditPlanWorkflowStore
    title: string;
    comments: string
    formErrors: any;
    levelArray=[];
    level:number;

  constructor(private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private  _followUpService : FollowUpService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {

  }

    getButtonText(text) {
      return this._helperService.translateToUserLanguage(text);
    }

    save(close: boolean = false) {

      let save;
      AppStore.enableLoading();

      let comment = {
        comment: this.comments
      }
      save = this._followUpService.rejectCA(this.caSource.id,comment)
      save.subscribe(
        (res: any) => {
          this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error;
            // this.processFormErrors()
          } else {
            this._utilityService.showErrorMessage(
              "Error!",
              "Something went wrong. Please try again."
            );
            this._utilityService.detectChanges(this._cdr);
          }
        }
      );

    }

    cancel() {
      this.closeFormModal();
    }

    closeFormModal() {
      AppStore.disableLoading();
      this.comments = null;
      this._eventEmitterService.dismissMsAuditCaRejectModal();
    }

    ngOnDestroy() {
      this.formErrors = null;
      this.comments = null;
    }
  }
