import { Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from "src/app/stores/auth.store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { MeetingAgendaTypeMasterStore } from 'src/app/stores/masters/mrm/meeting-agenda-type-store';
import { MeetingAgendaTypesService } from 'src/app/core/services/masters/mrm/meeting-agenda-types/meeting-agenda-types.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.scss']
})
export class AgendaFormComponent implements OnInit {

 
  @Input('source') agendaSource: any;


  agendaForm:FormGroup;
  agendaFormErrors:any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  UsersStore = UsersStore;
  MeetingPlanStore=MeetingPlanStore;
  MeetingAgendaTypeMasterStore=MeetingAgendaTypeMasterStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _helperService:HelperServiceService,
    private _usersService: UsersService,
    private _imageService: ImageServiceService,
    private _meetingAgendaTypeService:MeetingAgendaTypesService
    ) { }

  ngOnInit(): void {


    this.agendaForm = this._formBuilder.group({
      id: [''],
      title: ['',[Validators.required, Validators.maxLength(255)]],
      description: [''],
      meeting_agenda_type_id: [''],
      start_time: [''],
      duration:[''],
      owner_id: [''],
    })
    this.resetForm();
    if (this.agendaSource) {
    if (this.agendaSource.hasOwnProperty('values') && this.agendaSource.values) {

      this.agendaForm.patchValue({
        id: this.agendaSource.values.id,
        title: this.agendaSource.values.title?this.agendaSource.values.title:'',
        description: this.agendaSource.values.description?this.agendaSource.values.description:'',
        duration: this.agendaSource.values.duration?this.agendaSource.values.duration:'',
        start_time: this.agendaSource.values.start_time?new Date('01 Jan 1978 '+this.agendaSource.values.start_time):'',
        owner_id: this.agendaSource.values.owner?this.agendaSource.values.owner:null,
        meeting_agenda_type_id: this.agendaSource.values.meeting_agenda_type?this.agendaSource.values.meeting_agenda_type:null,
      })

      }
    }
      


  }

  getAgendaType() {

    this._meetingAgendaTypeService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchAgendaType(event) {
    this._meetingAgendaTypeService.getAllItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
    // Returns default image
    getDefaultImage() {
      return this._imageService.getDefaultImageUrl('user-logo');
    }
    getStringsFormatted(stringArray, characterLength, seperator) {
      return this._helperService.getFormattedName(stringArray, characterLength, seperator);
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

    saveAgenda(close:boolean=false){

    this.agendaFormErrors=null;
    if (this.agendaForm.value) {

    
      AppStore.enableLoading();

        if (this.agendaSource.type=='edit') 
        this.sortUpdateParams(close)
        else
        this.sortSaveParams(close)     
    }
  }
  sortUpdateParams(close){

    let itemIndex=MeetingPlanStore.meetingPlanAgendas.findIndex(el=>el.id==this.agendaForm.value.id)

    let processedObject={
      ...this.agendaForm.value,
      display_time:this.agendaForm?.value?.start_time,
      display_owner:this.agendaForm?.value?.owner_id,
      display_agenda_type:this.agendaForm?.value?.meeting_agenda_type_id,
      start_time:this.agendaForm?.value?.start_time?this._helperService.processTime(this.agendaForm.value.start_time):null,
      meeting_agenda_type_id:this.agendaForm?.value?.meeting_agenda_type_id?this.agendaForm.value.meeting_agenda_type_id.id:null,
      owner_id:this.agendaForm?.value?.owner_id?this.agendaForm.value.owner_id.id:null,
      is_editable:true
    }

      MeetingPlanStore.meetingPlanAgendas.splice(itemIndex,1,processedObject)
      this._utilityService.showSuccessMessage('success','agenda_updated')
      AppStore.disableLoading();
      if(close)
      this.closeModal()
      else
      this.resetForm()  
    

  }

  sortSaveParams(close){

    let processedObject={
      ...this.agendaForm.value,
      display_time:this.agendaForm?.value?.start_time,
      display_owner:this.agendaForm?.value?.owner_id,
      display_agenda_type:this.agendaForm?.value?.meeting_agenda_type_id,
      start_time:this.agendaForm?.value?.start_time?this._helperService.processTime(this.agendaForm.value.start_time):null,
      meeting_agenda_type_id:this.agendaForm?.value?.meeting_agenda_type_id?this.agendaForm.value.meeting_agenda_type_id.id:null,
      owner_id:this.agendaForm?.value?.owner_id?this.agendaForm.value.owner_id.id:null,
      is_editable:false
    }

    if(MeetingPlanStore.meetingPlanAgendas.some(el=>el.title==processedObject.title)){
      this._utilityService.showWarningMessage('item_already_added','')
      AppStore.disableLoading();
      this.resetForm()
    }
    else{
      MeetingPlanStore.setMeetingPlanAgenda(processedObject)
      this._utilityService.showSuccessMessage('success','agenda_added')
      AppStore.disableLoading();
      if(close)
      this.closeModal()
      else
      this.resetForm()  
    }


  }


  closeModal(){
    this._eventEmitterService.dismissAgendaFormModal();
    this.resetForm();
  }

  

  resetForm() {

    this.agendaForm.reset();
    this.agendaForm.pristine;
    this.agendaFormErrors = null;
  }


 
 

  ngOnDestroy() {

    this.agendaSource.values=null;
    this.agendaSource.type=null;

  }

}
