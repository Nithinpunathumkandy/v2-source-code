import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaActionPlanService } from 'src/app/core/services/business-assessments/action-plans/ba-action-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BAActionPlanStore } from 'src/app/stores/business-assessments/assessments/assessment-action-plan.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

@Component({
  selector: 'app-assessment-action-plan-add',
  templateUrl: './assessment-action-plan-add.component.html',
  styleUrls: ['./assessment-action-plan-add.component.scss']
})
export class AssessmentActionPlanAddComponent implements OnInit {


  @Input ('source')sourceData:any;

  form: FormGroup;
  formErrors: any;
  AppStore=AppStore;
  UsersStore=UsersStore;
  BAActionPlanStore=BAActionPlanStore;
  todayDate: any = new Date();

  constructor(
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _BAactionPlanService:BaActionPlanService
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    AppStore.disableLoading();


    this.form = this._formBuilder.group({

      id: [null],
      title: ["", [Validators.required]],
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],
      responsible_user_ids: [null, [Validators.required]],
      description:['']
    });

    this.resetForm()

    if(this.sourceData && this.sourceData.values){

      this.setEditData()

    }


  }

  setEditData(){
    let patchData=this.sourceData.values

   
    this.form.patchValue({

      id:patchData.id?patchData.id:'',
      title:patchData.title?patchData.title:'',
      start_date:patchData.start_date?patchData.start_date:'',
      target_date:patchData.target_date?patchData.target_date:'',
      responsible_user_ids:patchData.is_edit?patchData.responsible_user_id:patchData.responsible_user_id[0],
      description:patchData.description?patchData.description:''
    })
  }

  createImageUrl(token) {// user-defined
    return this._imageService.getThumbnailPreview('user-profile-picture', token)
  }

  
  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getUsers() {
    var params = '';
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchUsers(e) {
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
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

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();

      if(this.sourceData.type=='submenu-edit'){

        if(this.form.value.id)
        save = this._BAactionPlanService.updateItem(this.form.value.id, this.processData('update'));
       
          
          save.subscribe(
            (res: any) => {
              this.resetForm();
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
      else{

        if(this.form.value.id){
          this.processData('update')
          this.resetForm();
          AppStore.disableLoading();
           if (close) this.closeFormModal();
        }else{
          this.processData('save')
          this.resetForm();
          AppStore.disableLoading();
           if (close) this.closeFormModal();
        }

      }
    }
  }

  
  cancel() {
    this.closeFormModal();
  }

  processData(type){

    let data=this.form.value

    if(this.sourceData.type=='checklist-edit'){
      if(type=='save'){
        delete data.id
        
        data={
          title:data.title,
          start_date:data.start_date,
          target_date:data.target_date,
          is_new:true,
          responsible_users:data.responsible_user_ids,
          display_user:data.responsible_user_ids,
          description:data.description
        }
        BAActionPlanStore.formType='add'
        BAActionPlanStore.setDisplayData(data)
      }
      
      else{
        
        data={
          id:data.id,
          title:data.title,
          start_date:data.start_date,
          target_date:data.target_date,
          is_edit:true,
          responsible_users:data.responsible_user_ids,
          display_user:data.responsible_user_ids,
          description:data.description
        }
  
        BAActionPlanStore.formType='edit'
        BAActionPlanStore.setDisplayData(data)
  
      }
  
    }
    else{
      // Processing form data for saving when adding/updating action plan normally without any relation to business assessment relation.

      if(type=='update'){
        data={
          id:data.id,
          title:data.title,
          start_date:this._helperService.processDate( data.start_date, 'join'),
          target_date:this._helperService.processDate( data.target_date, 'join'),
          responsible_user_ids:[data.responsible_user_ids.id],
          business_assessment_document_content_checklist_id:this.sourceData.values.checklistId,
          description:data.description
        }
        return data
      }
    }
  }

  closeFormModal() {
    if(this.sourceData.component=='checklist-child')
    this._eventEmitterService.dismissBAActionPlanChildModal(this.sourceData.clause_index);
    else
    this._eventEmitterService.dismissBAActionPlanModal();
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;

  }


}
