import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { IncidentWorkflowService } from 'src/app/core/services/incident-management/incident-workflow/incident-workflow.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

@Component({
  selector: 'app-incident-workflow-user-add',
  templateUrl: './incident-workflow-user-add.component.html',
  styleUrls: ['./incident-workflow-user-add.component.scss']
})
export class IncidentWorkflowUserAddComponent implements OnInit {
  @Input('source') WorkFlowSource: any;
  commonForm: FormGroup;
  formErrors: any;
  users: any = [];
  AppStore = AppStore;
  UsersStore = UsersStore;
  constructor( private _userService: UsersService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _khFileService: KhFileServiceService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _incidentWorkflowService: IncidentWorkflowService,
    private _helperService: HelperServiceService,) { }

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
      save = this._incidentWorkflowService.saveUserAdd(saveData,this.WorkFlowSource.values?this.WorkFlowSource.values.workflowId:'');
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

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  createImageUrl(token, type) {
    return this._khFileService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  close() {
    this.resetForm();
    this._eventEmitterService.dismissIncidentWorkflowUserAddModal()
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
