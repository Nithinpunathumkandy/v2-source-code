import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';

@Component({
  selector: 'app-meeting-action-plan',
  templateUrl: './meeting-action-plan.component.html',
  styleUrls: ['./meeting-action-plan.component.scss']
})
export class MeetingActionPlanComponent implements OnInit {
  @Input('source') source: any;
  UsersStore=UsersStore;
  MeetingsStore=MeetingsStore;
  AppStore=AppStore;
  form: FormGroup;
  formErrors: any;
  constructor(
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _meetingsService:MeetingsService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    //console.log(this.source);
    this.form = this._formBuilder.group({

      id: [null],
      minutes_id: [null],
      title: ["", [Validators.required]],
      description: ['',[Validators.required]],
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],
      responsible_user_id: [null, [Validators.required]],
      meeting_plan_meeting_agenda_id: [null],
    });
    this.setFormValues();
  }

  setFormValues()
  {
    this.form.patchValue({
      title:this.source.values?.agenda?.title?this.source.values?.agenda?.title:'',
      description:this.source?.values?.description?this.source?.values?.description:'',
      id:this.source.values?.agenda?.id?this.source.values?.agenda?.id:null,
      minutes_id:this.source?.values?.id?this.source?.values?.id:null,
      meeting_plan_meeting_agenda_id:this.source.values?.agenda?this.source.values?.agenda:null
    })
    if(this.source.type=='Edit')
    {
      this.form.controls.meeting_plan_meeting_agenda_id.setValidators([Validators.required]);
      this.form.controls.meeting_plan_meeting_agenda_id.updateValueAndValidity();
      this.form.controls.start_date.setValidators(null);
      this.form.controls.target_date.setValidators(null);
      this.form.controls.responsible_user_id.setValidators(null);
      this.form.controls.start_date.updateValueAndValidity();
      this.form.controls.target_date.updateValueAndValidity();
      this.form.controls.responsible_user_id.updateValueAndValidity();
    }
  }

  getAllUsers() {
    UsersStore.setAllUsers([]);
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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
  createImageUrl(token) {// user-defined
    return this._imageService.getThumbnailPreview('user-profile-picture', token)
    // return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }
  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  cancel()
  {
    this._eventEmitterService.dismissActionPlanMappingModal();
  }

  
  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
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

  save(val)
  {
      if(MeetingsStore.mappedActionPlan.length)
      {
            const index=MeetingsStore.mappedActionPlan.findIndex(e=>(e.description==this.source.values.description && e.meeting_plan_meeting_agenda_id==this.form.value.id ))
            if(index!=-1)
            {
              MeetingsStore.mappedActionPlan[index]['action_plan'].push({
                "title":this.form.value.title,
                "description":this.form.value.description,
                "responsible_user_id":this.form.value.responsible_user_id,
                'start_date':this.form.value.start_date,
                "target_date":this.form.value.target_date
              })
              this._utilityService.showSuccessMessage('success','Sucessfully added action plan');
            }
            if(!val)
              {
              this.form.patchValue({
                start_date:null,
                target_date:null,
                responsible_user_id:null
              })
            }
            else{
              this.cancel();
            }
      
      }
      //console.log(MeetingsStore.mappedActionPlan)
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  update(val)
  {
    AppStore.enableLoading();
    let save;
   
    if (this.source.type=='Edit') {
      const payload={
        title:this.form.value.description,
        meeting_plan_meeting_agenda_id:this.form.value.meeting_plan_meeting_agenda_id.id
      }
      save = this._meetingsService.updateMOM(this.form.value?.minutes_id , payload);
    }
    save.subscribe(res => {
      AppStore.disableLoading();
    
      if (val) this.cancel();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }
  


}
