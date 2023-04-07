import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { EventLessonLearnedService } from 'src/app/core/services/event-monitoring/event-lesson-learned/event-lesson-learned.service';
import { EventLessonLearntCaService } from 'src/app/core/services/event-monitoring/event-lesson-learnt-ca/event-lesson-learnt-ca.service';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventLessonLearnedStore } from 'src/app/stores/event-monitoring/events/event-lesson-learned-store';
import { LessonLearntCaStore } from 'src/app/stores/event-monitoring/events/event-lesson-learnt-ca-store';
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-add-lesson-learnt-ca',
  templateUrl: './add-lesson-learnt-ca.component.html',
  styleUrls: ['./add-lesson-learnt-ca.component.scss']
})
export class AddLessonLearntCaComponent implements OnInit {
  @Input('source') LessonLearntCaSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  form: FormGroup;
  formErrors :any;
  AppStore = AppStore;
  LessonLearntCaStore = LessonLearntCaStore;
  reactionDisposer: IReactionDisposer;
  UsersStore = UsersStore;
  EventLessonLearnedStore = EventLessonLearnedStore;
  fileUploadPopupSubscriptionEvent: any = null;
  fileUploadPopupStore = fileUploadPopupStore;
  EventsStore = EventsStore;
  selectedId: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  showEventDetails: boolean = false;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _lessonLearntCaService: EventLessonLearntCaService,
    private _eventEmitterService: EventEmitterService,
    private _lessonLearnedService: EventLessonLearnedService,
    private _documentFileService: DocumentFileService,
    public _msTypeService: MstypesService,
    private _renderer2: Renderer2,
    private _eventsService : EventsService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [""],
      title: ['',[Validators.required]],
      responsible_user_id: [null,[Validators.required]],
      description: [''],
      start_date: ['',[Validators.required]],
      target_date: ['',[Validators.required]],
      event_lesson_learned_id: [null,[Validators.required]],
      event_id : null,
      documents:[]
      
    })

    if (this.LessonLearntCaSource.type=='Edit') {
      this.editData();
    }

    if (this._router.url.indexOf('lesson-learned-corrective-actions') == -1) {
      LessonLearntCaStore.hideSubMenu=true;
        this.form.patchValue({
          event_id: EventsStore.selectedEventId ? EventsStore.selectedEventId : ''
        })
        this.changeEvent(EventsStore.selectedEventId)
        this._utilityService.detectChanges(this._cdr);

    }
    this.getResponsibleUsers()
    this.getLessonLearnt()
    this.getEventList()


    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    if (this.LessonLearntCaSource.page == true) {
      LessonLearntCaStore.hideSubMenu=true;
        this.form.patchValue({
          event_lesson_learned_id: EventLessonLearnedStore.LessonLearntId? EventLessonLearnedStore.LessonLearntId : ''
        })
        this._utilityService.detectChanges(this._cdr);

    }

  }

  getEventList(){
    this._eventsService.getItems('&is_monitor=1').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchEvent(e){
    this._eventsService.getItems('&q=' + e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }


  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
    if (languageSupport) {
      for (let i of items) {
        for (let j of i.language) {
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }
  
  editData(){
    this.changeEvent(this.LessonLearntCaSource.value.lesson_learned?.event_id)
    this.searchEvent({term:this.LessonLearntCaSource.value.lesson_learned?.event_id})
    this.form.patchValue({
      id: this.LessonLearntCaSource.value.id ? this.LessonLearntCaSource.value.id : null,
      title: this.LessonLearntCaSource.value.title ? this.LessonLearntCaSource.value.title : null,
      description: this.LessonLearntCaSource.value.description ? this.LessonLearntCaSource.value.description : null,
      responsible_user_id: this.LessonLearntCaSource.value.responsible_user ? this.LessonLearntCaSource.value.responsible_user : null,
      start_date: this.LessonLearntCaSource.value.start_date ? this._helperService.processDate(this.LessonLearntCaSource.value.start_date, 'split') : null,
      target_date: this.LessonLearntCaSource.value.target_date ? this._helperService.processDate(this.LessonLearntCaSource.value.target_date, 'split') : null,
      event_lesson_learned_id : this.LessonLearntCaSource.value.lesson_learned ? this.LessonLearntCaSource.value.lesson_learned?.id : null,
      event_id : this.LessonLearntCaSource.value.lesson_learned ? this.LessonLearntCaSource.value.lesson_learned?.event_id : null
    })
  }

  processSaveData() {
    let saveData = this.form.value;
    saveData['start_date'] = this._helperService.processDate(this.form.value.start_date ? this.form.value.start_date : null, 'join'),
    saveData['target_date'] = this._helperService.processDate(this.form.value.target_date ? this.form.value.target_date : null, 'join'),
    saveData['responsible_user_id']= this.form.value.responsible_user_id ?this.form.value.responsible_user_id?.id : null
    if(this.form.value.id){
      saveData['documents']= {...this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)}
    }else
     saveData['documents']= {...this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')}
    return saveData;
  }


  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  setDepartment(){
    UsersStore.unsetUserList();
  }

  getLessonLearnt(){
    this._lessonLearnedService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchLessonLearnt(e){
    this._lessonLearnedService.getItems(false,'&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  clearEvent(){
    this.showEventDetails = false;
    this.resetForm();
    this.selectedId = null
  }

  changeEvent(event){
    this.selectedId = event
    if(event){
      EventsStore.setSelectedEventId(this.selectedId)
      this._eventsService.getItem(event).subscribe(res=>{
         this.showEventDetails = true;
        this._utilityService.detectChanges(this._cdr);
      })
    }
  
  }

  // getting Responsible user
  getResponsibleUsers() {
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // serach users
  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term ).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  formatStartDate() {
    // converting start date
    if (this.form.value.start_date) {
      let tempstartdate = this.form.value.start_date;

      this.form.value.start_date = this._helperService.processDate(tempstartdate, 'join');
      return this.form.value.start_date;
    }
  }

  formatTargetDate() {
    if (this.form.value.target_date) {
      let tempTargetdate = this.form.value.target_date;

      this.form.value.target_date = this._helperService.processDate(tempTargetdate, 'join')
      return this.form.value.target_date;
    }
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = false;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  createImageUrl(type, token) {
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    else
    return this._msTypeService.getThumbnailPreview(type,token);
    
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }


  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        save = this._lessonLearntCaService.updateCa(this.processSaveData(), this.LessonLearntCaSource.value.id);
      } else {
        save = this._lessonLearntCaService.saveCa(this.processSaveData());
      }
  
      save.subscribe((res: any) => {
         if(!this.form.value.id){
         this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) {
          this.cancel();
          if(LessonLearntCaStore.hideSubMenu=true){
            this._router.navigateByUrl('/event-monitoring/events/'+EventMonitoringStore.selectedEventId+'/lesson-learned/'+EventLessonLearnedStore.LessonLearntId+'/corrective-action');

          }
        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        
      });
    }
   }

  cancel(){
    this.resetForm();
    this._eventEmitterService.dismissLessonLearntCaModal();
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    LessonLearntCaStore.hideSubMenu=false;
    this.clearFIleUploadPopupData();
    AppStore.disableLoading();
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
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

  removeDocument(doc) {
    if(doc.hasOwnProperty('is_kh_document')){
      if(!doc['is_kh_document']){
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else{
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else{
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    this.enableScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy(){
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    LessonLearntCaStore.hideSubMenu=false;
  }

}
