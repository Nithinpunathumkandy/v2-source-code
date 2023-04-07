import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { WorkflowService } from 'src/app/core/services/knowledge-hub/work-flow/workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { WorkFlowStore } from 'src/app/stores/knowledge-hub/work-flow/workFlow.store';

@Component({
  selector: 'app-workflow-edit-popup',
  templateUrl: './workflow-edit-popup.component.html',
  styleUrls: ['./workflow-edit-popup.component.scss']
})
export class WorkflowEditPopupComponent implements OnInit {

  @Input('source') WorkFlowSource: any;
  commonForm: FormGroup;
  formErrors: any;
  users: any = [];
  AppStore = AppStore;
  UsersStore = UsersStore;
  multiple: boolean = false

  type = [
    { name: "Team", id: 1, type: "team" },
    { name: "User", id: 2, type: "user" },
  ]

  constructor(    
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _utilityService: UtilityService,
    private _workFlowService: WorkflowService,
    private _imageService: ImageServiceService,
    private _khFileService: KhFileServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,    
  ) { }

  ngOnInit(): void {
    this.commonForm = this._formBuilder.group({
      user_ids: [[], [Validators.required]],
      user_type: ['', [Validators.required]],
    })
    this.resetForm();
    this.getUsers();
    if (this.WorkFlowSource.values.itemId) {
      this.getItem(this.WorkFlowSource.values.itemId)
    }

    this.commonForm.get('user_type').valueChanges.subscribe(value => {
      if (value == 'User' || value?.type == 'user') {
        this.multiple = false
      } else {
        this.multiple = true
      }
    })    
  }

  setFormValues() {    
    if (WorkFlowStore.getUserWorkflow.type == 'team') {
      this.commonForm.patchValue({
        user_type: 'Team',        
      })
      setTimeout(() => {
        this.commonForm.patchValue({          
          user_ids: WorkFlowStore.getUserWorkflow.document_workflow_item_users,
        })
      }, 500)
    } else {
      this.commonForm.patchValue({
        user_type: 'User',        
      })
      setTimeout(() => {
        this.commonForm.patchValue({          
          user_ids: WorkFlowStore.getUserWorkflow.user,
        })
      }, 500)
    }    
  }

  getItem(id) {
    this._workFlowService.showWorkflowLevel(id).subscribe(res => {
      if (res) {
        this.setFormValues()
      }
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getUsers() {
    this._userService
      .getAllItems()
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  save(close: boolean = false) {
    let save;
    let saveData
    if (this.commonForm.value) {
      AppStore.enableLoading();
      if (this.commonForm.value.user_ids?.id) {
        saveData = {
          "user_ids": [this.commonForm.value.user_ids.id],
          "level": this.WorkFlowSource.values.level ? this.WorkFlowSource.values.level : '',
          "type": 'user'
        }
      } else {
        saveData = {
          "user_ids": this._helperService.getArrayProcessed(this.commonForm.value.user_ids, 'id'),
          "level": this.WorkFlowSource.values.level ? this.WorkFlowSource.values.level : '',
          "type": 'team'
        }
      }      
      this.formErrors = null;
      if (this.WorkFlowSource.values.itemId) {
        save = this._workFlowService.updateUserLevel(this.WorkFlowSource.values.itemId, saveData);
      } else {
        save = this._workFlowService.addUserLevel(this.WorkFlowSource.values.documentId, saveData);
      }
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
      } else if (err.status == 500 || err.status == 403) {
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
    return this._khFileService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  close() {
    this.resetForm();
    this._eventEmitterService.dismissWorkflowUserAddModal()
    this._eventEmitterService.setModalStyle()
  }

  resetForm() {
    this.commonForm.reset();
    this.commonForm.pristine;
    this.formErrors = null;
    this.users = [];
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if (search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }


  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

}
