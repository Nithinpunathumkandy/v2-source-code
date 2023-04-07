import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';

@Component({
  selector: 'app-audit-workflow-user-add-modal',
  templateUrl: './audit-workflow-user-add-modal.component.html',
  styleUrls: ['./audit-workflow-user-add-modal.component.scss']
})
export class AuditWorkflowUserAddModalComponent implements OnInit {
  @Input('source') WorkFlowSource: any;
  commonForm: FormGroup;
  formErrors: any;
  users: any = [];
  AppStore = AppStore;
  UsersStore = UsersStore;
  AuditWorkflowStore = AuditWorkflowStore;
  constructor(
    private _userService: UsersService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _khFileService: KhFileServiceService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _auditWorkflowService: AuditWorkflowService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    this.commonForm=this._formBuilder.group({
      user_ids: ['']
    })
    this.resetForm();
    this.getUsers();
  }

  getUsers() {
    this._userService
    .getAllItems()
    .subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  save(close: boolean = false){
    let save;
    if(this.commonForm.value){
      AppStore.enableLoading();
      let saveData = {
        "user_id": this.commonForm.value.user_ids?this.commonForm.value.user_ids.id:'',
        "level": this.WorkFlowSource.values ? this.WorkFlowSource.values.level : '',
      }
      save = this._auditWorkflowService.saveUserAdd(saveData,this.WorkFlowSource.values?this.WorkFlowSource.values.workflowId:'');
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

  searchUers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createImageUrl(token, type) {
    return this._khFileService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  close() {
    this.resetForm();
    this._eventEmitterService.dismissAuditWorkflowUserAddModal()
  }

  resetForm() {
    this.commonForm.reset();
    this.commonForm.pristine;
    this.formErrors = null;
    this.users = [];
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }
  
}
