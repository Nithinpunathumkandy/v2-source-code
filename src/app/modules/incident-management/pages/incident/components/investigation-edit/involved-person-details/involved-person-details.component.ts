import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';

@Component({
  selector: 'app-involved-person-details',
  templateUrl: './involved-person-details.component.html',
  styleUrls: ['./involved-person-details.component.scss']
})
export class InvolvedPersonDetailsComponent implements OnInit {
  @Input ('source') page: any;

  UsersStore = UsersStore;
  IncidentInvestigationStore = IncidentInvestigationStore
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore


  constructor(private  _eventEmitterService: EventEmitterService,private _helperService: HelperServiceService,
    private _userService: UsersService,    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,     private _imageService: ImageServiceService,
    private _formBuilder: FormBuilder,private _investigationService : InvestigationService,
    private _incidentService : IncidentService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      investigation_involved_user_ids: [null,[Validators.required]],
      remarks : ''
    })
  }

  cancel() {
    this._eventEmitterService.dismissInvolvedPersonDetailsModalControl();
  }


  processData(){
    let saveData = {
      investigation_involved_user_ids: this.form.value.investigation_involved_user_ids ? this.form.value.investigation_involved_user_ids : [],
      remarks: this.form.value.remarks ? this.form.value.remarks : '',
 
    }

    return saveData;
  }
  getEditValue(fields) {
    return this._helperService.getArrayProcessed(fields,'id')
  }
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  saveInvolvedUserDetails(close:boolean = false){
    if(this.form.valid){
      let saveData ={
        user_ids : this.form.value.investigation_involved_user_ids ? this.getEditValue(this.form.value.investigation_involved_user_ids) : []
      }
      AppStore.enableLoading();
      let save 
      if(this.page == 'incident'){
        save = this._incidentService.addIncidentInvolvedUser(saveData)
      }else{
        save = this._investigationService.addInvestigationInvolvedUser(saveData)
        this.form.value.investigation_involved_user_ids.map(data=>{
          this.IncidentInvestigationStore.setInvolvedUserDetails(data)
        })
      }
      save.subscribe(res=>{
        AppStore.disableLoading();
        this.form.reset();
        if(close){
          this.cancel();
        }
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error.errors;
  
           this.processFormErrors();
        } else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
      })
   
      this._utilityService.detectChanges(this._cdr)
      // this.form.reset();
    }
    
  }
  processFormErrors(){
    var errors = this.formErrors;
   
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
          if(key.startsWith('user_ids.')){
           let keyValueSplit = key.split('.');
           let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['user_ids'] = this.formErrors['user_ids']? this.formErrors['user_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
    
      }
    }
   
    this._utilityService.detectChanges(this._cdr);
  }

  getPersonInvolved(){
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchPersonInvolved(e){
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

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

}
