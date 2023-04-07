import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

@Component({
  selector: 'app-add-investigators',
  templateUrl: './add-investigators.component.html',
  styleUrls: ['./add-investigators.component.scss']
})
export class AddInvestigatorsComponent implements OnInit {
  addcontrolsEvent: any;

  UsersStore = UsersStore;
  IncidentStore = IncidentStore;
  AppStore = AppStore;

  form: FormGroup;
  formErrors: any;




  constructor(private _eventEmitterService: EventEmitterService,
              private _formBuilder: FormBuilder,
              private _userService: UsersService,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _imageService: ImageServiceService,
              private _incidentService : IncidentService,
              private _helperService:HelperServiceService


    ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id:[],
      leader_id : [null,[Validators.required]],
      team_user_ids : []

    })

    this.getInvestigator();
    this.getTeamMembers();

    this.setValue();
    
  }

  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i.id );
    }
    return returnValues;
  }

  getEditValues(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i );
    }
    return returnValues;
  }s

  processDataForSave() {
    
    let saveData = {
      
      leader_id: this.form.value.leader_id ? this.form.value.leader_id.id : [],
      team_user_ids: this.form.value.team_user_ids ? this.getEditValue(this.form.value.team_user_ids) : [],

 
     };
 
    
     return saveData;
   }
  setValue(){
    if(IncidentStore.investigatorsDetails){
      this.form.patchValue({
        leader_id : IncidentStore.investigatorsDetails.investigation_leader ? IncidentStore.investigatorsDetails.investigation_leader : [],
        team_user_ids : IncidentStore.investigatorsDetails.investigation_leader ? this.getEditValues  (IncidentStore.investigatorsDetails.investigators) : []
      })
      this._utilityService.detectChanges(this._cdr);
    }
  }

  cancel() {
    this._eventEmitterService.dismissAddInvestigatorModalControl();
  }


  getInvestigator(){
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchInvestigator(e){
    // if(this.form.value.department_ids){
    //   let params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  // }
  }

  getTeamMembers(){
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchTeamMembers(e){
    // if(this.form.value.department_ids){
    //   let params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  // }
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
        isWordThere.push(search.indexOf(arr_term) != -1);
      });
  
      const all_words = (this_word) => this_word;
      // Every method will return true if all values are true in isWordThere.
      return isWordThere.every(all_words);
    }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  submitForm(close:boolean = false){
    let save 
    AppStore.enableLoading();

    save = this._incidentService.addInvestigator(this.processDataForSave());


    save.subscribe((res: any) => {
      
      this.resetForm();
      AppStore.disableLoading();
      if(close){
        this.cancel();
      }
      this._utilityService.detectChanges(this._cdr);      
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
     
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);


    });
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  processFormErrors(){
    if(this.form.value.auditleader_idee_ids && this.form.value.leader_id.length>0){
    var errors = this.formErrors;
   
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
          if(key.startsWith('leader_id.')){
           let keyValueSplit = key.split('.');
           let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['leader_id'] = this.formErrors['leader_id']? this.formErrors['leader_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
    
      }
    }
   }
    this._utilityService.detectChanges(this._cdr);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

}
