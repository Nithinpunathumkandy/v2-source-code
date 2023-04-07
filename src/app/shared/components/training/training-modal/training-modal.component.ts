import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { AppStore } from "src/app/stores/app.store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { TrainingCategoryMasterStore } from "src/app/stores/masters/training/training-category-master-store";
import { TrainingCategoryService } from "src/app/core/services/masters/training/training-category/training-category.service";
import { CompetencyGroupMasterStore } from "src/app/stores/masters/human-capital/competency-group-master.store";
import { CompetencyGroupService } from "src/app/core/services/masters/human-capital/competency-group/competency-group.service";
import { CompetencyMasterStore } from "src/app/stores/masters/human-capital/competency-master.store";
import { CompetencyService } from "src/app/core/services/masters/human-capital/competency/competency.service";
import { TrainingsService } from "src/app/core/services/training/trainings/trainings.service";
import { TrainingsStore } from "src/app/stores/training/trainings/training-store";
import { AuthStore } from "src/app/stores/auth.store";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { TrainingCategoryPaginationResponse } from "src/app/core/models/masters/training/training-category";
import { CompetencyGroupPaginationResponse } from "src/app/core/models/masters/human-capital/competency-group";
import { CompetencyPaginationResponse } from "src/app/core/models/masters/human-capital/competency";
import { Router } from "@angular/router";
declare var $: any;

@Component({
  selector: "app-training-modal",
  templateUrl: "./training-modal.component.html",
  styleUrls: ["./training-modal.component.scss"],
})
export class TrainingModalComponent implements OnInit, OnDestroy {
  @Input("source") TrainingSource: any;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('addTrainingCategory') addTrainingCategory: ElementRef;
  @ViewChild('addCompetencyGroup') addCompetencyGroup: ElementRef; 
  @ViewChild('addCompetency') addCompetency: ElementRef;
  // @ViewChild('formModal', { static: true }) formModal: ElementRef; 
  trainingForm: FormGroup;
  trainingFormError: any;
  AppStore = AppStore;
  TrainingsStore = TrainingsStore;
  
  UsersStore = UsersStore;  
  TrainingCategoryMasterStore = TrainingCategoryMasterStore;
  CompetencyGroupMasterStore = CompetencyGroupMasterStore;
  CompetencyMasterStore = CompetencyMasterStore;
  todayDate: any = new Date();

  openModelPopup: boolean = false;
  

  openCompetency: boolean = false;
  organisationChangesModalSubscription: any = null;
  addTrainingCategoryEvent: any = null;
  addCompetencyGroupEvent: any = null;
  addCompetencyEvent: any = null;
  venueVisible = true;
  participant_list=[];
  public reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'

  config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      
      '|',
      'bold',
      'italic',
      
      '|',
      'link',
      'imageUpload',
      '|',
    
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'insertTable',
      'blockQuote',
     
    ],
    language: 'id',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    }
  };
  public Editor;
  public Config;
  constructor(
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _usersService: UsersService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _trainingCategoryService: TrainingCategoryService,
    private _competencyGroupService: CompetencyGroupService,
    private _competencyService: CompetencyService,
    private _eventEmeitterService: EventEmitterService,
    private _trainingService: TrainingsService,
    private _http: HttpClient,
    private _router: Router,
  ) { 
    this.Editor = myCkEditor;
   }
  
   public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof TrainingModalComponent
   */
  ngOnInit(): void {
    // ClassicEditor
    // .create( document.querySelector( '#description' ), {
    //     extraPlugins: [ MyUploadAdapter ],
    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

    this.trainingForm = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.required, Validators.maxLength(500)]],
      description: [''],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      trainer: ['', [Validators.required]],
      trainer_description: ['', [Validators.required,Validators.maxLength(500)]],
      web_url: ['', [Validators.pattern(this.reg)]],
      venue: [''],
      training_category_id: ['', [Validators.required]], 
      competency_group_id: [null, [Validators.required]],
      competency_ids: [[], [Validators.required]],
      training_participants: [[], [Validators.required]],
      organization_ids: [[]],
      department_ids: [[]],
      division_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
    });
    this.resetForm();
    if (this.TrainingSource.type == 'Edit') {
      this.setFormValues(this.TrainingSource.id)
    }
    else{
      this.setInitialOrganizationLevels();
    }
    this.getCategory();
    this.getCompetencyGroup();
    this.getCompetencies();
    this.getUsers();

    this.organisationChangesModalSubscription = this._eventEmeitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );

    this.addTrainingCategoryEvent = this._eventEmeitterService.trainingCategory.subscribe(element => {
      this.closeTrainingCategoryModal();
    })

    this.addCompetencyEvent = this._eventEmeitterService.competencyControl.subscribe(element => {
      this.closecompetencyModal();
    })

    this.addCompetencyGroupEvent = this._eventEmeitterService.competencyGroupControl.subscribe(element => {
      this.closecompetencyGroupModal();
    })

  }


  trainingCategoryAdd(){
    this._renderer2.addClass(this.addTrainingCategory.nativeElement,'show');
    this._renderer2.setStyle(this.addTrainingCategory.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.addTrainingCategory.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeTrainingCategoryModal(){
    this._renderer2.removeClass(this.addTrainingCategory.nativeElement,'show');
    this._renderer2.setStyle(this.addTrainingCategory.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.addTrainingCategory.nativeElement,'display','none');
    if (TrainingCategoryMasterStore.lastInsertedId) {
      this.searchTrainingCategory({term: TrainingCategoryMasterStore.lastInsertedId},true);
    }
    TrainingCategoryMasterStore.lastInsertedId = null;
  
  }


  CompetencyGroupAdd(){
    this._renderer2.addClass(this.addCompetencyGroup.nativeElement,'show');
    this._renderer2.setStyle(this.addCompetencyGroup.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.addCompetencyGroup.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closecompetencyGroupModal(){
    this._renderer2.removeClass(this.addCompetencyGroup.nativeElement,'show');
    this._renderer2.setStyle(this.addCompetencyGroup.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.addCompetencyGroup.nativeElement,'display','none');
    if (CompetencyGroupMasterStore.lastInsertedId) {
      this.searchCompetencyGroup({term: CompetencyGroupMasterStore.lastInsertedId},true);
    }
    CompetencyGroupMasterStore.lastInsertedId = null;
  
  }


  competencyAdd(){
    this.openCompetency = true;
    this._renderer2.addClass(this.addCompetency.nativeElement,'show');
    this._renderer2.setStyle(this.addCompetency.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.addCompetency.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closecompetencyModal(){
    this.openCompetency = false;
    this._renderer2.removeClass(this.addCompetency.nativeElement,'show');
    this._renderer2.setStyle(this.addCompetency.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.addCompetency.nativeElement,'display','none');
    if (CompetencyMasterStore.lastInsertedId) {
      this.searchCompetencies({term: CompetencyMasterStore.lastInsertedId},true);
    }
    CompetencyMasterStore.lastInsertedId = null;
  
  }


  changeVenueWeb(venue) {
    this.venueVisible = venue;
    if (venue) {
      this.trainingForm.patchValue({
        web_url: null
      })
    } else {
      this.trainingForm.patchValue({
        venue: null
      })
    }
  }  

  setInitialOrganizationLevels(){
    this.trainingForm.patchValue({
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
      department_ids:AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      section_ids:AuthStore?.user?.section ? [AuthStore?.user?.section] : [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
      organization_ids: AuthStore.user?.organization ? [AuthStore.user?.organization] : []
    });
    this._utilityService.detectChanges(this._cdr);
     
  }

  setFormValues(id: number) {
      this._trainingService.getItem(id).subscribe(res => {
        this.trainingForm.patchValue({
           
          id: res['id'],
          title: res['title'].toUpperCase(),
          description: res['description'],
          training_category_id: res['training_category'],
          start_date: res['start_date'] ? new Date(res['start_date']) : '' ,
          end_date: res['end_date'] ? new Date(res['end_date']) : '' ,
          trainer: res['trainer'] ? res['trainer'] : null ,
          trainer_description: res['trainer_description'] ? res['trainer_description'] : null ,
          web_url: res['web_url'] ? res['web_url'] : null ,
          venue: res['venue'] ? res['venue'] : null ,
          competency_group_id: res['competency_group'] ,
          competency_ids: this.getData(res['competencies']),
          training_participants: this.getData(res['participants']['participants'], true),
          division_ids: this.getData(res['divisions']),
          department_ids: this.getData(res['departments']),
          section_ids: this.getData(res['sections']),
          sub_section_ids: this.getData(res['sub_sections']),
          organization_ids: this.getData(res['organizations'])
        });
        if (res['venue'] != null) {
          this.changeVenueWeb(true)
        } else if (res['web_url'] != null) {
          this.changeVenueWeb(false)
        }
        this.setParticipantList(res['participants']);
      });
  }

  setParticipantList(participants){
    for(let i of participants.participants){
      this.participant_list.push({data:i});
    }
  }

  getData(value, user: boolean = false) {
    let data = [];
    for(let i of value) {
      if (user)
      data.push(i.user);
      else
      data.push(i);
    }
    return data;
  }

  getId(value, user: boolean = false) { 
    let data = [];
    if (user){
      if(this.participant_list.length>0){
        for(let j of this.participant_list){
          if(j.data.user){
            data.push({user_id: j.data?.user?.id,id: j.data?.id}); 
          }
          // else if(j.is_deleted){
            
          //     data.push({user_id: j.data?.id,
          //       is_deleted: true});
            
          // }
          else{
            data.push({user_id: j.data.id});
          }
        }
       
      }
      else{
        for(let k of value){
          data.push({user_id: k.id});
        }
      }
     
    }
    else{
      for(let i of value) { 
        data.push(i.id);
      }
    }
   
    return data;
  }

  MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader, this._http );
    };
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/gi;
    var result = this.trainingForm.value.description.replace(regex, "");
    return result.length;
  }

  getTodaysDate() {
    return this._helperService.getTodaysDateObject();
  }

  searchTrainingCategory(e,patchValue:boolean=false){
    this._trainingCategoryService.getItems(false, 'q=' + e.term).subscribe((res: TrainingCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.trainingForm.patchValue({ training_category_id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  
  }


  getCategory(){
    this._trainingCategoryService.getItems(false).subscribe(res =>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchCompetencyGroup(e,patchValue:boolean=false){
    this._competencyGroupService.getItems(false, 'q=' + e.term).subscribe((res: CompetencyGroupPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.trainingForm.patchValue({ competency_group_id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCompetencyGroup(){
    this._competencyGroupService.getItems(false).subscribe(res =>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchCompetencies(e,patchValue:boolean=false){
    this._competencyService.getItems(false,'competency_group_ids=' + this.trainingForm.value.competency_group_id?.id + '&q=' + e.term).subscribe(
      (res: CompetencyPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let competency = this.trainingForm.value.competency_ids ? this.trainingForm.value.competency_ids : [];
						competency.push(i);
            this.trainingForm.patchValue({ competency_ids: competency });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCompetencies(){
    if (this.trainingForm.value.competency_group_id)
    this._competencyService.getItems(false, 'competency_group_ids=' + this.trainingForm.value.competency_group_id?.id,false).subscribe(res =>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getUsers() {
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchUers(e) {   
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  clearCompetency(event) {
    this.trainingForm.patchValue({
      competency_ids: [],
      competency_group_id: event
    })
    this.getCompetencies();
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }
  
  cancel() {
    this.closeFormModal();
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  resetForm() {
    this.trainingForm.reset();
    this.trainingForm.markAsPristine();
    this.trainingFormError = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dismissTrainingModal();
  }

  addParticipant(event,type){
    if(this.trainingForm.value.id){
      if (type == 'add')
      this.participant_list.push({data:event});
  else {
      const index = this.participant_list.findIndex(e => e.data?.user?.id == event.value.id);
      if (index != -1){
        this.participant_list.splice(index, 1);
        // this.participant_list.push({data:event.value,is_new:false,is_deleted:true})
      }
      
  }

    }
   

  }


  organisationChanges() {
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if(data){
      this.trainingForm.patchValue({
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


  createSaveData() {
    let saveData = this.trainingForm.value;
    saveData['start_date'] = this.trainingForm.value.start_date ? this._helperService.passSaveFormatDate(this.trainingForm.value.start_date) : '',
    saveData['end_date'] =  this.trainingForm.value.end_date ? this._helperService.passSaveFormatDate(this.trainingForm.value.end_date) : '',
    saveData['competency_group_id'] = this.trainingForm.value.competency_group_id ? this.trainingForm.value.competency_group_id.id : null;
    saveData['competency_ids'] = this.trainingForm.value.competency_ids ? this.getId(this.trainingForm.value.competency_ids) : null;
    saveData['training_category_id'] = this.trainingForm.value.training_category_id ? this.trainingForm.value.training_category_id.id : null;
    saveData['training_participants'] = this.trainingForm.value.training_participants ? this.getId(this.trainingForm.value.training_participants, true) : [];
    saveData['organization_ids'] = this.trainingForm.value.organization_ids ? this.getId(this.trainingForm.value.organization_ids) : [AuthStore.user?.organization.id];
    saveData['division_ids'] =  this.trainingForm.value.division_ids ? this.getId(this.trainingForm.value.division_ids) : [AuthStore.user?.division.id];
    saveData['department_ids'] = this.trainingForm.value.department_ids ? this.getId(this.trainingForm.value.department_ids) : [AuthStore.user?.department.id];
    saveData['section_ids'] = this.trainingForm.value.section_ids ? this.getId(this.trainingForm.value.section_ids) : [AuthStore.user?.section.id];
    saveData['sub_section_ids'] = this.trainingForm.value.sub_section_ids ? this.getId(this.trainingForm.value.sub_section_ids) : [AuthStore.user?.sub_section.id];
    return saveData;
  }

  saveTraining(close: boolean = false) {
    this.trainingFormError = null;
    AppStore.enableLoading();
    this._utilityService.detectChanges(this._cdr);
      let save;
      if (this.trainingForm.value.id) {
        save = this._trainingService.updateItem(
          this.TrainingsStore.training_id,
          this.createSaveData()
        );
      } else {
        delete this.trainingForm.value.id;
        save = this._trainingService.saveItem(
          this.createSaveData()
        );
      }
      save.subscribe(
        (res: any) => {
          TrainingsStore.training_id = res.id;
          this._router.navigateByUrl(
            "/trainings/training/" + TrainingsStore.training_id
          );
          this.closeFormModal();
          AppStore.disableLoading();

          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
            this.trainingForm.reset();
            if (close){
              this.closeFormModal();
              this.trainingForm.reset();
            } 
          }, 300);
        },
        (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.trainingFormError = err.error.errors;
          } else if (err.status == 500 || err.status == 403 || err.status == 404) {
            AppStore.disableLoading();
            this.trainingForm.reset();
            this.closeFormModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      );
    
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

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof TrainingModalComponent
   */
  ngOnDestroy() {
    this.organisationChangesModalSubscription.unsubscribe();
    this.addTrainingCategoryEvent.unsubscribe();
    this.addCompetencyGroupEvent.unsubscribe();
    this.addCompetencyEvent.unsubscribe();
  }
}
