import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { FocusAreaService } from 'src/app/core/services/masters/strategy/focus-area/focus-area.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { FocusAreaMasterStore } from 'src/app/stores/masters/strategy/focus-area-master-store';
import { StrategicThemesMasterStore } from 'src/app/stores/masters/strategy/strategy-theme.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
declare var $: any;

@Component({
  selector: 'app-add-focus-area',
  templateUrl: './add-focus-area.component.html',
  styleUrls: ['./add-focus-area.component.scss']
})
export class AddFocusAreaComponent implements OnInit {
  @Input('source') focusAreaSource: any;
  @ViewChild('focusAreaMasterModal') focusAreaMasterModal: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('noteModal') noteModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  FocusAreaMasterStore = FocusAreaMasterStore
  AppStore = AppStore;
  AuthStore = AuthStore;
  UsersStore = UsersStore;
  StrategyStore = StrategyStore;
  StrategicThemesMasterStore = StrategicThemesMasterStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore
  focusAreaMasterSubscription: any;
  organisationChangesModalSubscription: any;
  notesModalEventSubscription: any = null;
  confirmationEventSubscription: any = null;

  openModelPopup: boolean;
  selectedIndex = null;
  swot_availability:Boolean = false;
  pestel_availabale:Boolean = false;
  selectedNoteTab = 0;
  isNoteLoaded: boolean = false;
  selected_note = [];

  focusAreaObject = {
    type: null,
    values: null
  }
  noteObject = {
    type: null,
    value: null,
    id:null
  }

  deleteObjects = {
    id: null,
    title: '',
    type: '',
    subtitle:''
  };

  focusForm: FormGroup;
  formErrors: any;
  
  constructor(private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2,
    private _usersService:UsersService, private _imageService:ImageServiceService,
    private _formBuilder: FormBuilder,private _focusAreaService: FocusAreaService,
    private _utilityService: UtilityService, private _service : StrategyService, 
    private _cdr: ChangeDetectorRef,private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    this.focusAreaMasterSubscription = this._eventEmitterService.focusAreaModalControl.subscribe(res=>{
      this.closeFocusAreaMasters();
    })
    this.focusForm=this._formBuilder.group({
      strategy_profile_id : null,
      focus_area_id: [null, [Validators.required]],
      weightage:StrategyManagementSettingStore?.strategyManagementSettings?.is_weightage == 1 ? [null,[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]] : [null],
      accountable_user_id: [null,[Validators.required]],
      theme_ids:[[]],
      strategy_profile_note_ids:[[]],
      organization_ids: [[]],
      department_ids: [[]],
      division_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
      strategy_profile_focus_area_id : null
    })
    
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    this.focusForm.controls['division_ids'].setValidators(Validators.required);
   if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    this.focusForm.controls['section_ids'].setValidators(Validators.required);
  if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    this.focusForm.controls['sub_section_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_department)
    this.focusForm.controls['department_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
    this.focusForm.controls['organization_ids'].setValidators(Validators.required);

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );

    this.notesModalEventSubscription = this._eventEmitterService.notesModal.subscribe(item=>{
      this.closeNoteModal();
    })

    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    if(this.focusAreaSource.type =="Edit"){
      this.setEditData();
      this.getFocusAreas();
    }else{
      this.getFocusAreas();
      this.setInitialOrganizationLevels();
      this.setInitialFormValues();
    }
    this.getStrategyNotes();
    this.getUsers();
  }

  setEditData(){
    if(this.focusAreaSource.value){
      this.searchFocusArea({term :this.focusAreaSource.value.focus_area.id })
      this.focusForm.patchValue({
        focus_area_id : this.focusAreaSource.value.focus_area.id,
        weightage : Number(this.focusAreaSource.value.weightage) ,
        strategy_profile_focus_area_id : this.focusAreaSource.value.id,
        accountable_user_id : this.focusAreaSource.value?.accountable_user ? this.focusAreaSource.value?.accountable_user : null,
        // theme_ids: this.getData(this.focusAreaSource.value?.themes),
        theme_ids:this.getData(this.focusAreaSource.value?.themes),
        strategy_profile_note_ids: this.focusAreaSource.value?.strategy_profile_notes ? this.getData(this.focusAreaSource.value?.strategy_profile_notes,'id') : [],
        division_ids: this.getData(this.focusAreaSource.value?.divisions),
        department_ids: this.getData(this.focusAreaSource.value?.departments),
        section_ids: this.getData(this.focusAreaSource.value?.sections),
        sub_section_ids: this.getData(this.focusAreaSource.value?.sub_sections),
        organization_ids: this.getData(this.focusAreaSource.value?.organizations),
      })
      this.selected_note = this.getData(this.focusAreaSource.value?.strategy_profile_notes);
    }
    this._utilityService.detectChanges(this._cdr);  
  }

  setInitialOrganizationLevels(){
    this.focusForm.patchValue({
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
      department_ids:AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      section_ids:AuthStore?.user?.section ? [AuthStore?.user?.section] : [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
      organization_ids: AuthStore.user?.organization ? [AuthStore.user?.organization] : []
    });
    this._utilityService.detectChanges(this._cdr); 
  }

  setInitialFormValues(){
    this.focusForm.patchValue({
      accountable_user_id : StrategyStore.induvalStrategyProfile?.accountable_user ? StrategyStore.induvalStrategyProfile?.accountable_user : null,
      // theme_ids: this.getData(StrategyStore.induvalStrategyProfile?.themes),
      // strategy_profile_note_ids: this.getData(StrategyStore.profileNotes,'id'),
    });
    this._utilityService.detectChanges(this._cdr);
  }

  getNotes(){
    this._service.getSelectedNotes(StrategyStore._strategyProfileId).subscribe(()=>this._utilityService.detectChanges(this._cdr));
  }

  getStrategyNotes(){
    this._service.strategyProfileNotsList().subscribe(res=>{
      this.isNoteLoaded = false
      this._utilityService.detectChanges(this._cdr);
    })
  }

  weightageChange(value){

  }

  openFocusAreaMasters(){
    this.focusAreaObject.type = 'Add';
    this._renderer2.addClass(this.focusAreaMasterModal.nativeElement,'show');
    this._renderer2.setStyle(this.focusAreaMasterModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.focusAreaMasterModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.focusAreaMasterModal.nativeElement,'z-index',99999);
  }

  closeFocusAreaMasters(){
    this.focusAreaObject.type = null;
    this._renderer2.removeClass(this.focusAreaMasterModal.nativeElement,'show');
    this._renderer2.setStyle(this.focusAreaMasterModal.nativeElement,'display','none');
    this._renderer2.setStyle(this.focusAreaMasterModal.nativeElement,'z-index',9999);
    this.searchFocusArea({term : FocusAreaMasterStore.lastInsertedId},true)

  }

  resetForm(){
    this.focusForm.reset();
  }

  proccessData(){
    let saveData =  {
      strategy_profile_focus_area_id : this.focusForm.value.strategy_profile_focus_area_id ? this.focusForm.value.strategy_profile_focus_area_id : null,
      strategy_profile_id : StrategyStore._strategyProfileId,
      focus_area_id : this.focusForm.value.focus_area_id ? this.focusForm.value.focus_area_id :  [],
      weightage : this.focusForm.value.weightage ? this.focusForm.value.weightage : '',
      accountable_user_id : this.focusForm.value.accountable_user_id ? this.focusForm.value.accountable_user_id.id : null,
      // theme_ids: this.focusForm.value.theme_ids?.id ? [this.focusForm.value.theme_ids?.id] : [],
      theme_ids: this.focusForm.value.theme_ids?.length > 0 ? this.getData(this.focusForm.value.theme_ids,'id') : [],
      // strategy_profile_note_ids: this.getData(StrategyStore.profileNotes,'id'),
      strategy_profile_note_ids: this.focusForm.value.strategy_profile_note_ids ? this.focusForm.value.strategy_profile_note_ids : [],
      organization_ids : this.focusForm.value.organization_ids ? this._helperService.getArrayProcessed(this.focusForm.value.organization_ids, 'id') : [AuthStore.user?.organization.id],
      division_ids : this.focusForm.value.division_ids ? this._helperService.getArrayProcessed(this.focusForm.value.division_ids, 'id') : [AuthStore.user?.division.id],
      department_ids : this.focusForm.value.department_ids ? this._helperService.getArrayProcessed(this.focusForm.value.department_ids, 'id') : [AuthStore.user?.department.id],
      section_ids : this.focusForm.value.section_ids ? this._helperService.getArrayProcessed(this.focusForm.value.section_ids, 'id') : [AuthStore.user?.section.id],
      sub_section_ids : this.focusForm.value.sub_section_ids ? this._helperService.getArrayProcessed(this.focusForm.value.sub_section_ids, 'id') : [AuthStore.user?.sub_section.id],
    }
    return  saveData
  }

  save(close: boolean = false){
    let save 
    AppStore.enableLoading();
    if (this.selected_note.length > 0) {
      let notes = [];
      for (let i of this.selected_note) {
        notes.push(i.id)
      }
      this.focusForm.patchValue({
        strategy_profile_note_ids: notes
      })
    }
    else{
      this.focusForm.patchValue({
        strategy_profile_note_ids: []
      })
    }
    if(this.focusAreaSource.type == "Edit"){
      save = this._service.updateFocusArea(this.proccessData(),this.focusAreaSource.value.id)
    }else{
      save = this._service.addFocusArea(this.proccessData())
    }
    save.subscribe(res=>{
      this.resetForm();
      AppStore.disableLoading();
      this.setInitialOrganizationLevels()
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if(close) this.cancel();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
         this.cancel();;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    });
    // if(this.focusForm.valid){
    //   let focusObject = {id: StrategyDemoStore.strategyFocusAreas.length+1, title: this.focusForm.value.focus_area, weightage: this.focusForm.value.weightage };
    //   StrategyDemoStore.strategyFocusAreas.push(focusObject);
     
    // }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  } 

  cancel(){
    this._eventEmitterService.dismissFocuAreaModal();
    this.focusAreaMasterSubscription.unsubscribe();
    AppStore.disableLoading();

  }

  getFocusAreas(){
   this._focusAreaService.getItems().subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);

   })
  }

  searchFocusArea(e,patchValue:boolean = false){
    this._focusAreaService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.focusForm.patchValue({ focus_area_id: i.id });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchTheme(e,patchValue:boolean=false){
    // this._strategicThemeService.getItems(false,'&q=' + e.term).subscribe(
    //   (res: StrategyThemesPaginationResponse) => {
    //   if (res.data.length > 0 && patchValue) {
    //     for (let i of res.data) {
    //       if (i.id == e.term) {
    //         let theme = this.strategyForm.value.theme_ids ? this.strategyForm.value.theme_ids : [];
		// 				theme.push(i);
    //         this.strategyForm.patchValue({ theme_ids: theme });
    //         break;
    //       }
    //     }
    //   }
    //   this._utilityService.detectChanges(this._cdr);
    // })
  }

  getTheme(){
    // this._strategicThemeService.getItems().subscribe(res =>{
    //   this._utilityService.detectChanges(this._cdr);
    // })
  }

  getUsers() {
    // let params = '?department_ids=${}' +this.focusAreaSource.department;
    let params=`?department_ids=${this.focusAreaSource.department?this.focusAreaSource.department:this._helperService.getArrayProcessed(StrategyStore.induvalStrategyProfile?.departments,'id')}`;
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUers(e) {   
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getData(value, user?) {
    let data = [];
    for(let i of value) {
      if (user)
      data.push(user == 'user' ? i.user : i.id);
      else
      data.push(i);
    }
    return data;
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

  organisationChanges() {
    OrganizationalSettingsStore.isMultiple = true; 
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if(data){
      this.focusForm.patchValue({
        division_ids: data.division_ids ? data.division_ids : [],
        department_ids:data.department_ids ? data.department_ids : [],
        section_ids:data.section_ids ? data.section_ids : [],
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        organization_ids: data.organization_ids ? data.organization_ids : []
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }

  selectedIndexChange(index,id){
    this.swot_availability = false
    this.pestel_availabale = false
    StrategyStore.setNoteId(id)
    if(this.selectedIndex == index){
      this.selectedIndex = null;
    } else{
      this.selectedIndex = index;
      this._utilityService.detectChanges(this._cdr);
    }
      this._service.getInduvalNote(id).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
        if(res&&res.category.length!=0){
          StrategyStore.noteDetails.category.forEach(element => {
            if(element.is_swot&&element.is_swot==1){
              this.swot_availability = true;
            }
            if(element.is_pestel&&element.is_pestel==1){
              this.pestel_availabale = true
            }
          });
          this._utilityService.detectChanges(this._cdr);
        }
        this._utilityService.detectChanges(this._cdr);
      })
  }

  // editNotes(id){
  //   let notes 
  //   let noteArray = []
  //   this.noteObject.id = id
  //   this._service.getInduvalNote(id).subscribe(res=>{
  //     notes = res;
  //     for (let i = 0; i < notes.category.length; i++) {
  //         for (let k = 0; k < notes.category[i].issue.length; k++) {
  //           if(notes.category[i].is_pestel == 1 || notes.category[i].is_swot == 1){
  //             noteArray.push(notes.category[i].issue[k])
  //           }
  //         }
        
  //     }
  //     this.noteObject.value = {
  //       title : notes.title,
  //       organization_issue_ids : noteArray
        
  //     }
  //     this.noteObject.type = 'edit'
  //     this.openNoteModalPopup();
  //     this._utilityService.detectChanges(this._cdr);

  //   })  
  // }

  // openNoteModalPopup(){
  //   // $(this.noteModal.nativeElement).modal('show');
  //   this._renderer2.addClass(this.noteModal.nativeElement,'show');
  //   this._renderer2.setStyle(this.noteModal.nativeElement,'display','block');
  //   this._renderer2.setStyle(this.noteModal.nativeElement,'z-index',99999);
  //   this._renderer2.setStyle(this.noteModal.nativeElement,'overflow','auto');
  // }

  closeNoteModal(){
    this.noteObject.type = null;
    this.noteObject.id = null;
    this.selectedNoteTab = 0;
    // $(this.noteModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.noteModal.nativeElement,'show');
    this._renderer2.setStyle(this.noteModal.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  setSelectedNotesTab(num){
    this.selectedNoteTab = num;
    this._utilityService.detectChanges(this._cdr);
  }

  deleteProfileNotes(id){//delete
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'notes';
    this.deleteObjects.type = '';
    this.deleteObjects.subtitle = "Are you sure want to Delete"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }

  delete(status) {//delete
    let deleteId = [];
    let deleteData;

    if (status) {
      switch (this.deleteObjects.title) {
        case 'notes':
          if (this.deleteObjects.id)
            deleteData = this._service.deleteNotes(this.deleteObjects.id);
          break;
      }
      if (this.deleteObjects.id) {
        deleteData.subscribe(resp => {
          this.clearDeleteObject();
          if (this.deleteObjects.title == 'notes') {
            this.getStrategyNotes();
          }
          this._utilityService.detectChanges(this._cdr);
          this.clearDeleteObject();

        });
        setTimeout(() => {
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 100);
      }
      else {
        this.clearDeleteObject();
        setTimeout(() => {
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 100);
      }

    }
    else {
      this.clearDeleteObject();
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 100);
    }
  }

  clearDeleteObject() {//delete
    this.deleteObjects.id = null;
  }

  getProfileNotes(role) {
    let selected: boolean = false;
    for (let i of this.selected_note) {
      if (i.id == role.id) {
        selected = true;
        break;
      }
    }
    if (selected != true) {
      this.selected_note.push(role);
    }
    else {
      const index: number = this.selected_note.findIndex(e => e.id == role.id);
      this.selected_note.splice(index, 1);
    }
  }

  profileNotesChecked(role) {
    const index: number = this.selected_note.findIndex(e => e.id == role.id);
    if (index != -1) {
      return true
    }
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
  
  openNoteDetails(id){
    this.noteObject.id = id;
      this._renderer2.addClass(this.noteModal.nativeElement,'show');
      this._renderer2.setStyle(this.noteModal.nativeElement,'display','block');
      this._renderer2.setStyle(this.noteModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.noteModal.nativeElement,'overflow','auto');
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy(){
    this.organisationChangesModalSubscription.unsubscribe();
    this.swot_availability = false;
    this.pestel_availabale = false;
  }
}
