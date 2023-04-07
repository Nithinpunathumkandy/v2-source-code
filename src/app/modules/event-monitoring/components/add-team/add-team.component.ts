import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from "src/app/shared/services/utility.service";
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventTeamService } from "src/app/core/services/event-monitoring/event-team/event-team.service";
import { toJS } from 'mobx';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {
  @Input('source') eventTeamSource: any;
  teamForm: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UsersStore = UsersStore;
  EventsStore=EventsStore
  constructor(private _formBuilder: FormBuilder,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _userService: UsersService,
    private _eventEmitterService: EventEmitterService,private _helperService: HelperServiceService,
    private _imageService: ImageServiceService, private _eventTeamService: EventTeamService) { }

  ngOnInit(): void {
    this.teamForm = this._formBuilder.group({
      event_manager: [null,[Validators.required]],
      assistant_manager_ids: [[],[Validators.required]],
      member_ids:[[], Validators.required]
    });
    if (this.eventTeamSource.type == 'Edit' || this.eventTeamSource.type == 'Add') {
      this.setFormValues();
    }
  }

  searchUers(e,type){
    var params = '';
    if(type=='deputy_owner' || type=='event_owner')
    {
      params='&department_ids='+EventsStore?.eventDetails?.departments?.id
    }
    this._userService.searchUsers('?q='+e.term+params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setFormValues(){
    if (this.eventTeamSource.hasOwnProperty('values') && this.eventTeamSource.values) {
      //console.log(this.eventTeamSource.values)
      this.teamForm.patchValue({
        assistant_manager_ids: toJS(this.eventTeamSource.values.assistant_managers),
        event_manager:toJS(this.eventTeamSource.values.event_manager),
        member_ids: toJS(this.eventTeamSource.values.members)
      })
      //console.log(this.teamForm.value)
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Get all users
  getUsers(type){
    var params = '';
    if(type=='deputy_owner' || type=='event_owner')
    {
      params='?department_ids='+EventsStore?.eventDetails?.departments?.id
    }
    this._userService.getAllItems(params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  // Returns default image
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl('user-logo');
  }

   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
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

  createSaveData(){
    let saveData = {};
    saveData['assistant_manager_ids'] = this.teamForm.value.assistant_manager_ids ? this._helperService.getArrayProcessed(this.teamForm.value.assistant_manager_ids,'id') : []
    saveData['member_ids'] = this.teamForm.value.member_ids ? this._helperService.getArrayProcessed(this.teamForm.value.member_ids,'id') : []
    return saveData;
  }

  save(close?){
    this.formErrors = null;
    let save: any;
    AppStore.enableLoading();
    // if(this.teamForm.value.id){
    //   save = this._eventTeamService.updateItem(this.createSaveData());
    // }
    // else{
      save = this._eventTeamService.saveItem(this.createSaveData());
    // }
    save.subscribe(res=>{
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if(close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  closeFormModal(){
    this._eventEmitterService.dismissEventTeamModal();
    this.formErrors = null;
    this.teamForm.reset();
  }

  processFormErrors(){
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if(key.startsWith('assistant_manager_ids.')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['assistant_manager_ids'] = this.formErrors['assistant_manager_ids']? this.formErrors['assistant_manager_ids'] + errors[key] + '('+(errorPosition + 1)+')': errors[key]+ (errorPosition + 1);
        }
        if(key.startsWith('member_ids.')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['member_ids'] = this.formErrors['member_ids']? this.formErrors['member_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

}
