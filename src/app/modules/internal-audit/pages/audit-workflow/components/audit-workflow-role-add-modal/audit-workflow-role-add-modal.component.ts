import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';

@Component({
  selector: 'app-audit-workflow-role-add-modal',
  templateUrl: './audit-workflow-role-add-modal.component.html',
  styleUrls: ['./audit-workflow-role-add-modal.component.scss']
})
export class AuditWorkflowRoleAddModalComponent implements OnInit {
  @Input('source') WorkFlowSource: any;

  commonForm: FormGroup;
  AuditWorkflowStore = AuditWorkflowStore;
  AppStore = AppStore;
  formErrors: any;
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _auditWorkflowService: AuditWorkflowService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.commonForm=this._formBuilder.group({
      user_ids: [''],
      user_type_id:['']
    })
    this.resetForm();
    this.getuserTypes();
  }

  save(close: boolean = false){
    let save;
    if(this.commonForm.value){
      AppStore.enableLoading();
      let saveData = {
        "user_type_id" : this.commonForm.value.user_type_id ? this.commonForm.value.user_type_id:'',
        "level": this.WorkFlowSource.values ? this.WorkFlowSource.values.level : ''
      }
      save = this._auditWorkflowService.saveRoleAdd(saveData,this.WorkFlowSource.values?this.WorkFlowSource.values.workflowId:'');
    }
    save.subscribe((res: any) => {
      if (!this.commonForm.value.id) {
        this.resetForm();
      }
     
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
     
      if (close) this.close();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      } else if(err.status == 500 || err.status == 403){
        this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }

  cancel() {
    this.close();
  }

  close() {
    this.resetForm();
    this._eventEmitterService.dismissAuditWorkflowRoleAddModal()
  }

  resetForm() {
    this.commonForm.reset();
    this.commonForm.pristine;
    this.formErrors = null;
  }

  getuserTypes(){
    this._auditWorkflowService.getUserTypes().subscribe(res=>{
    })
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


}
