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
  selector: 'app-involved-witness-person-details',
  templateUrl: './involved-witness-person-details.component.html',
  styleUrls: ['./involved-witness-person-details.component.scss']
})
export class InvolvedWitnessPersonDetailsComponent implements OnInit {
  @Input ('source') page: any;

  UsersStore = UsersStore;
  IncidentInvestigationStore = IncidentInvestigationStore
  AppStore = AppStore
  formErrors: any;
  form: FormGroup;
  constructor(private  _eventEmitterService: EventEmitterService,private _helperService: HelperServiceService,
    private _userService: UsersService,    private _utilityService: UtilityService,private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,  private _incidentService : IncidentService,  
     private _imageService: ImageServiceService,private _investigationService : InvestigationService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      investigation_witness_user_ids: [null,[Validators.required]],
      remarks : ''
    })
  }

  cancel() {
    this._eventEmitterService.dismissInvolvedWitnessDetailsModalControl();
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

  processData(){
    let saveData = {
      investigation_witness_user_ids: this.form.value.investigation_witness_user_ids ? this.form.value.investigation_witness_user_ids : [],
 
    }

    return saveData;
  }
  getEditValue(fields) {
    // var returnValues = [];
    // for (let i of fields) {  
    //     returnValues.push(i.id );
    // }
    // return returnValues;
    return this._helperService.getArrayProcessed(fields,'id');
  }
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  saveWitnessUserDetails(close:boolean = false){
    this.form.value.investigation_witness_user_ids.map(data=>{
      this.IncidentInvestigationStore.setWitnessUserDetails(data)

    })
    AppStore.enableLoading();
    let saveData ={
      user_ids : this.form.value.investigation_witness_user_ids ? this.getEditValue(this.form.value.investigation_witness_user_ids) : []
    }

    let save 
    if(this.page == 'incident'){
      save = this._incidentService.addIncidentInvolvedWitnessUser(saveData)
    }else{
      save = this._investigationService.addInvestigationInvolvedWitnessUser(saveData)
      this.form.value.investigation_witness_user_ids.map(data=>{
        this.IncidentInvestigationStore.setWitnessUserDetails(data)
  
      })
    }

    save.subscribe(res=>{
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr)
      this.form.reset();
      if(close){
        this.cancel();
      }
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
      }else if(err.status == 500 || err.status == 403){
        this.cancel();
      }
    },)
 
 
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

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

}
