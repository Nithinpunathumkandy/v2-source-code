import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ControlAssessmentActionPlanService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-action-plan/control-assessment-action-plan.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-add-action-plan-control-assessment',
  templateUrl: './add-action-plan-control-assessment.component.html',
  styleUrls: ['./add-action-plan-control-assessment.component.scss']
})
export class AddActionPlanControlAssessmentComponent implements OnInit {
  @Input('source') actionPlanSource: any;
  form: FormGroup;
  AppStore=AppStore;
  UsersStore=UsersStore;
  formErrors=null;
  constructor(
    private _eventEmitterService:EventEmitterService,
    private _formBuilder:FormBuilder,
    private _helperService:HelperServiceService,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _controlAssessmentActionPlanService:ControlAssessmentActionPlanService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id:[null],
      title: ['', [Validators.required]],
      description: [''],
      responsible_user_ids: [[], [Validators.required]],
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],

    });
    if(this.actionPlanSource.type=='Edit')
    {
      this.setEditValues();
    }
  }
  setEditValues()
  {
    this.form.patchValue({
      id:this.actionPlanSource.values.id,
      title:this.actionPlanSource.values.title,
      description:this.actionPlanSource.values.description,
      responsible_user_ids:this.actionPlanSource.values.responsible_users,
      start_date:this._helperService.processDate(this.actionPlanSource.values.start_date, 'split'),
      target_date:this._helperService.processDate(this.actionPlanSource.values.target_date, 'split'),
    })
  }
  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  closeFormModal() {
    this.form.reset();
    this._eventEmitterService.dismissControlAssessmentActionPlanModal();
 
   }
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  getResponsibleUsers() {

     
      this._userService.getAllItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    
  }

  searchUsers(e) {
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
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  resetForm()
  {
    this.form.reset();
  }
  processSaveData() {
    
    let saveData = this.form.value;
    saveData['start_date'] = this._helperService.processDate(this.form.value.start_date, 'join');
    saveData['target_date'] = this._helperService.processDate(this.form.value.target_date, 'join');
    saveData['control_assessment_document_version_content_control_id']=this.actionPlanSource?.controlId
    saveData['responsible_user_ids']=this.getIds(this.form.value?.responsible_user_ids);
    return saveData;
  }
  getIds(data)
  {
    let item=[];
    for(let i of data)
    {
      item.push(i.id);
    }
    return item;
  }
  save(close: boolean = false)
  {
    let save;
    AppStore.enableLoading();
    if(this.form.value.id)
    {
        save = this._controlAssessmentActionPlanService.updateItem(this.form.value.id, this.processSaveData());
    }
    else
    {
      save = this._controlAssessmentActionPlanService.saveItem(this.processSaveData());
    }
    save.subscribe(
      (res: any) => {
        if(this.actionPlanSource.type=='Add')
        {
          this.resetForm();
        }
       
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        if (close) this.closeFormModal();
      },
      (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else {
          this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
        }
        this._utilityService.detectChanges(this._cdr);
      }
    )

}
}
