import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventTaskService } from 'src/app/core/services/event-monitoring/events/event-task/event-task.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { TaskPhaseMasterStore } from 'src/app/stores/masters/event-monitoring/task-phase-store';
import { TaskPhaseService } from 'src/app/core/services/masters/event-monitoring/task-phase/task-phase.service';
import { EventTaskStore } from 'src/app/stores/event-monitoring/events/event-task.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-add-event-task',
  templateUrl: './add-event-task.component.html',
  styleUrls: ['./add-event-task.component.scss']
})
export class AddEventTaskComponent implements OnInit , OnDestroy {

  @Input('source') source: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  form: FormGroup;
  formErrors: any;  
  AppStore = AppStore
  UsersStore = UsersStore
  EventsStore=EventsStore;
  TaskPhaseMasterStore=TaskPhaseMasterStore;
  fileUploadPopupStore = fileUploadPopupStore;
  EventTaskStore = EventTaskStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  fileUploadsArray = [];  
  fileUploadPopupSubscriptionEvent: any = null;

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _helperService: HelperServiceService,
    private _eventTaskService: EventTaskService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _eventFileService: EventFileServiceService,
    private _eventService: EventsService,
    private _taskPhaseService:TaskPhaseService,
    private _fileUploadPopupService: FileUploadPopupService,
  ) { }

  ngOnInit(): void {
    
    this.form = this._formBuilder.group({
      id: [''],
      event_task_id: [],
      task_phase_id: [],
      event_id: [],
      title: ['', [Validators.required]],
      description: [''],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      duration: [],
      percentage: [],
      responsible_user_ids: [null,[Validators.required]],
    });
    if (this.source.type=='Edit' || this.source.type=='edit_submenu') {
      this.setFormValues()
    }
    this.form.get('start_date').valueChanges.subscribe(val => {
      this.form.get('end_date').valueChanges.subscribe(res => {
        const d_m_y1=`${val?.year}-${val?.month}-${val?.day}`;
        const d_m_y2=`${res?.year}-${res?.month}-${res?.day}`;
        let date1 = new Date(d_m_y1);  
        let date2 = new Date(d_m_y2);  
        var time_difference = date2.getTime() - date1.getTime();  
        var days_difference = time_difference / (1000 * 60 * 60 * 24); 
        this.form.controls['duration'].setValue(days_difference || 0);        
      });
    });

    this.form.get('end_date').valueChanges.subscribe(res => {                   
        let val = this.form.value.start_date                
        const d_m_y1=`${val?.year}-${val?.month}-${val?.day}`;
        const d_m_y2=`${res?.year}-${res?.month}-${res?.day}`;
        let date1 = new Date(d_m_y1);  
        let date2 = new Date(d_m_y2);  
        var time_difference = date2.getTime() - date1.getTime();           
        var days_difference = time_difference / (1000 * 60 * 60 * 24); 
        this.form.controls['duration'].setValue(days_difference);              
    });
    this.addValidation();

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    
  }

  addValidation(){    //Add FromSubmenu

    if(this.source.type=="add_submenu" || this.source.type=="edit_submenu"){      
      this.form.controls["event_id"].setValidators(Validators.required);
      this.form.controls["task_phase_id"].setValidators(Validators.required);
      this.form.controls["event_id"].updateValueAndValidity();
      this.form.controls["task_phase_id"].updateValueAndValidity();}
    }

  setFormValues() {
    this.setDocuments(this.source?.values?.documents);
    this.getEventList()
    this.getTaskPhase()
    if(this.source.type=='edit_submenu'){
      this.form.controls['event_id'].setValue(EventTaskStore.IndividualEventTaskDetails.event)
      this.form.controls['task_phase_id'].setValue(this.responseChange(EventTaskStore.IndividualEventTaskDetails.task_phase))
    }
    this.getUsers()
    this.form.patchValue({
      title: this.source?.values?.title,
      event_task_id: this.source?.values?.id ? this.source?.values?.id : '',
      description: this.source?.values?.description,
      start_date: this.source?.values?.start_date ? this._helperService.processDate(this.source?.values?.start_date, 'split') : null,
      end_date: this.source?.values?.end_date ? this._helperService.processDate(this.source?.values?.end_date, 'split') : null,
      duration: this.source?.values?.duration,
      responsible_user_ids: this.source?.values?.responsible_users ? this._helperService.getArrayProcessed(this.source?.values?.responsible_users, null) : [],
      //event_id:this.source?.values?.event_id,
    })
  }

  

  getSaveData() {
    let saveData = {
      event_task_id: this.source.event_task_id ? this.source.event_task_id : '',
      title: this.form.value?.title ? this.form.value?.title : '',
      description: this.form.value?.description ? this.form.value?.description : '',
      responsible_user_ids: this._helperService.getArrayProcessed(this.form.value.responsible_user_ids, 'id'),
      start_date: this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date, 'join') : '',
      end_date: this.form.value.end_date ? this._helperService.processDate(this.form.value.end_date, 'join') : '',
      duration: this.form.value?.duration ? this.form.value?.duration : '',
    }

    if(this.source.type=='edit_submenu' || this.source.type=='add_submenu'){
      saveData['event_id']= this.form.value?.event_id?.id ? this.form.value?.event_id?.id : null
      saveData['task_phase_id']=this.form.value?.task_phase_id?.id ? this.form.value?.task_phase_id?.id : ''      
    }else{
      saveData['task_phase_id']= this.source?.id
      saveData['event_id']= EventsStore.selectedEventId
    }

    if (this.source.type=='Edit' || this.source.type=='edit_submenu') {
			saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
		} else{
			saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
      
		}
    
    return saveData
  }

  responseChange(data) {
    var returnValue = { id: data?.id, task_phase_language_title: data?.languages[0]?.pivot?.title }
    return returnValue
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    let id
    if(this.source.type=='edit_submenu' || this.source.type=='add_submenu'){
      id=this.form.value?.event_id?.id
    }else{
      id=EventsStore.selectedEventId
    }

    let save;
    // if (this.source.event_task_id) {
    //   save = this._eventTaskService.updateItem(this.source.event_task_id, this.getSubTaskSaveData());
    // }
    if (this.form.value.event_task_id || this.source.type=='edit_submenu') {
      save = this._eventTaskService.updateItem(this.form.value.event_task_id, this.getSaveData(),this.source.type , this.source.value);
    }
    else {
      save = this._eventTaskService.saveItem(this.getSaveData(),this.source.type,id , this.source.value);
    }
    save.subscribe(res => {
      AppStore.disableLoading();
      this.clearFIleUploadPopupData()
      this.resetForm();
      if (close) this.cancel();
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

  setDocuments(documents) {
    this.clearFIleUploadPopupData()
		let khDocuments = [];
		documents.forEach(element => {
			if (element.document_id) {
				element.kh_document.versions.forEach(innerElement => {
					if (innerElement.is_latest) {
						khDocuments.push({
							...innerElement,
              title:element?.kh_document.title,
							'is_kh_document': true,              
						})
						fileUploadPopupStore.setUpdateFileArray({
							'updateId': element.id,              
							...innerElement
						})
					}
				});
			}
			else {
				if (element && element.token) {
					var purl = this._eventFileService.getThumbnailPreview('event-file', element.token)
					var lDetails = {
						name: element.title,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: element.id,
						'is_kh_document': false,            
					}
				}
				this._fileUploadPopupService.setSystemFile(lDetails, purl)
			}
		});
		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
	}

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  //File Upload/Attach Modal
  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;      
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
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
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._eventTaskService.getThumbnailPreview(type, token);

  }

  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  removeDocument(doc) {
    if (doc.hasOwnProperty('is_kh_document')) {
      if (!doc['is_kh_document']) {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else {
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else {
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    AppStore.disableLoading();
    this._eventEmitterService.dismissEventTaskModal();
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  getUsers() {
    var params = '';
    params = params ? '&access_all=true' : '?access_all=true';
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUsers(e) {
    var params = '';
    params = params ? '&access_all=true' : '?access_all=true';
    this._usersService.searchUsers((params ? params : '') + '&q=' + e.term).subscribe(res => {
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
      if (search) isWordThere.push(search.indexOf(arr_term) != -1);
    });
    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }
  
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  changeEvent(e)
  {
    if(e)
    {
      EventsStore.selectedEventId=e;
      this._eventService.getItem(e).subscribe(res=>{
        this.form.patchValue({
          planned_event_completion:EventsStore.eventDetails?.start_date,
        })
      })
    }
  }

  getEventList()
  {
    this._eventService.getItemsAll().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchTaskPhase(event) {
    this._taskPhaseService.getItems(false,'q='+event.term).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getTaskPhase() {
    this._taskPhaseService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  ngOnDestroy(): void {
    this.fileUploadPopupSubscriptionEvent.unsubscribe()
    this.clearFIleUploadPopupData()
  }

}
