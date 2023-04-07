import { ElementRef, Injectable, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { ActionPlansStore } from 'src/app/stores/mrm/action-plans/action-plans-store';
import { ActionPlansService } from 'src/app/core/services/mrm/action-plans/action-plans.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';

declare var $: any;


@Component({
  selector: 'app-action-plans-add',
  templateUrl: './action-plans-add.component.html',
  styleUrls: ['./action-plans-add.component.scss'],
})
export class ActionPlansAddComponent implements OnInit, OnDestroy {

  @Input('source') actionPlansObject: any;
  @Input('selectedMeeting') selectedMeetingData: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  name = '';
  fileUploadPopupSubscriptionEvent: any;
  MOMId:any=null;
  actionPlanId:any=null;
  selectedAgenda:any=null;
  selectedMOM:any=null;
  AgendaMOMs:any=[]

  fileUploadPopupStore = fileUploadPopupStore;
  AppStore = AppStore;
  UsersStore = UsersStore;
  MeetingsStore = MeetingsStore;
  ActionPlansStore = ActionPlansStore;
  reactionDisposer: IReactionDisposer;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  todayDate: any = new Date();

  options: string[] = [];

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _meetingsService: MeetingsService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _meetingPlanFileService: MeetingPlanFileService,
    private _actionPlansService: ActionPlansService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    AppStore.disableLoading();

    this.form = this._formBuilder.group({

      id: [null],
      title: ["", [Validators.required]],
      description: [''],
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],
      budget: [null],
      completion: [''],
      meeting_id: [null, [Validators.required]],
      responsible_user_id: [null, [Validators.required]],
      watcher_ids: [[]],
      documents: []
    });

    this.resetForm();
    // this.form.controls['completion'].setValue(this.default, {onlySelf: true});

    if (ActionPlansStore.individualLoaded) {
      this.setEditDetails();
    }

    if (!ActionPlansStore.editFlag && this.selectedMeetingData) {
      this.form.patchValue({
        'meeting_id': this.selectedMeetingData,
        'title': this.selectedMeetingData.title
      })
      this.getMeetingData({id:this.selectedMeetingData.id})
    }

    if (!ActionPlansStore.editFlag) {
      this.form.get('meeting_id').valueChanges.subscribe(val => {// prv meeting_title set title

        if (val?.title) {
          // this.form.controls['title'].setValue(`${val?.title}`);
        } else {
          if (!ActionPlansStore.editFlag) {
            this.form.controls['title'].setValue("");
          }
        }
      });
    }

    for (let i = 5; i <= 100; i++) {
      this.options.push(i + '%');
      i = i + 4;
    }

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

  }

  setEditDetails() {

    this.searchMeeting({ term: ActionPlansStore.individualActionPlansDetails.meeting.id });
    this._meetingsService.getItem(ActionPlansStore.individualActionPlansDetails.meeting.id).subscribe(res => {
      this.AgendaMOMs=[...res.meeting_minutes.filter(e=>e.meeting_plan_meeting_agenda_id==ActionPlansStore?.individualActionPlansDetails?.meeting_minutes.meeting_plan_meeting_agenda_id)]
      this._utilityService.detectChanges(this._cdr);
      })
    setTimeout(() => {
      if (ActionPlansStore.individualActionPlansDetails.documents.length > 0) {
        this.setDocuments(ActionPlansStore.individualActionPlansDetails.documents)
      }
    }, 200);
    this.form.patchValue({

      id: ActionPlansStore.individualActionPlansDetails.id,
      title: ActionPlansStore.individualActionPlansDetails.title ? ActionPlansStore.individualActionPlansDetails.title : '',
      budget: ActionPlansStore.individualActionPlansDetails.budget ? ActionPlansStore.individualActionPlansDetails.budget : null,
      completion: ActionPlansStore.individualActionPlansDetails.completion ? ActionPlansStore.individualActionPlansDetails.completion + '%' : 0,
      meeting_id: ActionPlansStore.individualActionPlansDetails.meeting ? ActionPlansStore.individualActionPlansDetails.meeting : null,
      start_date: ActionPlansStore.individualActionPlansDetails.start_date ? this._helperService.processDate(ActionPlansStore.individualActionPlansDetails.start_date, 'split') : '',
      target_date: ActionPlansStore.individualActionPlansDetails.target_date ? this._helperService.processDate(ActionPlansStore.individualActionPlansDetails.target_date, 'split') : '',
      description: ActionPlansStore.individualActionPlansDetails.description ? ActionPlansStore.individualActionPlansDetails.description : '',
      responsible_user_id: ActionPlansStore.individualActionPlansDetails.responsible_user ? ActionPlansStore.individualActionPlansDetails.responsible_user : [],
      watcher_ids: ActionPlansStore.individualActionPlansDetails.meeting_action_plan_watchers ? this._helperService.getArrayProcessed(ActionPlansStore.individualActionPlansDetails.meeting_action_plan_watchers, false) : []
    })

    this.selectedAgenda=ActionPlansStore?.individualActionPlansDetails?.meeting_minutes?.title?ActionPlansStore.individualActionPlansDetails.meeting_minutes.agenda.title:null;
    this.selectedMOM=ActionPlansStore?.individualActionPlansDetails?.meeting_minutes?ActionPlansStore.individualActionPlansDetails.meeting_minutes.title:null
  }
  
  setDocuments(documents) {
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element.kh_document.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement,
            })
          }
        });
      }
      else {
        if (element && element.token) {
          var purl = this._meetingPlanFileService.getThumbnailPreview('action-plan', element.token);
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
    // this.enableScrollbar();
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
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
  // searchUers(e) {
  //   let params = '';
  //   this._usersService.searchUsers('?q=' + e.term + (params ? params : '')).subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   })

  // }
  getMeeting() {
    this._meetingsService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMeeting(event) {
    this._meetingsService.getSearchItems('q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchListclickValueClear(event) {
    return event.searchTerm = '';
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
        // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }



  createAddImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
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

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }


  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }


  createDateTimeValidator() {
    if (ActionPlansStore.editFlag)
      return this.todayDate;
    else
      return this.form.value.start_date ? this.form.value.start_date : this.todayDate;
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
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

  cancel() {
    this.closeFormModal('cancel');
  }

  closeFormModal(type, resId?) {
    AppStore.disableLoading();
    this.resetForm();

    if ((MeetingsStore.meetingsId == null && resId && this.actionPlansObject.redirect) || (this.actionPlansObject.redirect && resId)) {
      this._router.navigateByUrl('mrm/meeting-action-plans/' + resId);
    }
    this._eventEmitterService.dismissCommonModal(type);
    // this._eventEmitterService.dismissActionModal()
  }

  resetForm() {
    this.clearFIleUploadPopupData();
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.form.patchValue({
      'meeting_id': this.selectedMeetingData?this.selectedMeetingData:null,
    });
  }

  // getTypesUsers(users){
  //   let user = [];

  //     for (let i of users) {
  //       user.push(i.id);
  //     }

  //   return user;
  // }

  // getSaveData() {
  //   this.saveData = {
  //     title: this.form.value.title ? this.form.value.title : '',
  //     budget: this.form.value.budget ? this.form.value.budget : null,
  //     completion: this.form.value.completion ? this.form.value.completion : '',
  //     description: this.form.value.description ? this.form.value.description : '',
  //     meeting_id: this.form.value?.meeting_id ? this.form.value.meeting_id.id : null,
  //     // this._helperService.processDate(this.form.value.end_date, 'join')
  //     start_date: this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date, 'join') : '',
  //     target_date: this.form.value.target_date ? this._helperService.processDate(this.form.value.target_date, 'join') : '',
  //     responsible_user_id: this.form.value.responsible_user_id ? this.form.value.responsible_user_id.id : null,
  //     watcher_ids: this.form.value.watcher_ids ? this._helperService.getArrayProcessed(this.form.value.watcher_ids, 'id') : null,
  //     documents:  this.form.value.documents ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile): '',
  //   }
  // }

  processSaveData() {


    let saveData = this.form.value;
    saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
    saveData['start_date'] = this._helperService.processDate(this.form.value.start_date, 'join');
    saveData['target_date'] = this._helperService.processDate(this.form.value.target_date, 'join');
    saveData['watcher_ids'] = this._helperService.getArrayProcessed(this.form.value.watcher_ids, 'id');
    saveData['responsible_user_id'] = this.form.value.responsible_user_id.id;
    saveData['meeting_id'] = this.form.value.meeting_id.id;
    if(this.MOMId)
    { saveData['meeting_minute_id'] = this.MOMId;}
    else
    {
      saveData['meeting_minute_id'] = null;
    }
   
    return saveData;
  }

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();
     // console.log(this.form.value.id)
      if (this.form.value.id) {

        save = this._actionPlansService.updateItem(this.form.value.id, this.processSaveData());
      } else {
        save = this._actionPlansService.saveItem(this.processSaveData());
      }
      save.subscribe(
        (res: any) => {
          AppStore.disableLoading();
          if(this.actionPlansObject.type=='Add')
          {
            this.resetForm();
            this.selectedMOM=null;
            this.selectedAgenda=null;
          }
          this._utilityService.detectChanges(this._cdr);
          if (close) 
          {
            this.closeFormModal('save', res.id);
            
          }
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }


  // MRM Action Plan Changes Starts Here

  getMeetingData(event){

  if(event) {
    this._meetingsService.getItem(event.id).subscribe(res => {
      this.selectedAgenda=null;
      this.selectedMOM=null;
      this.form.patchValue({
        title:'',
        description:''
      })
      this._utilityService.detectChanges(this._cdr);
      })
  }
    

  }

  setMOM(event){
    if(event){
      this.MOMId=event.id
      if(event.action_plan.length > 0 &&  this.actionPlansObject.type=='Edit')
      {
        this.form.patchValue({
          description:event.title,
          responsible_user_id:event?.action_plan[0]?.responsible_user?event.action_plan[0].responsible_user:null,
          start_date: event?.action_plan[0]?.start_date?this._helperService.processDate(event.action_plan[0].start_date, 'split') : '',
          target_date: event?.action_plan[0]?.target_date?this._helperService.processDate(event.action_plan[0].target_date, 'split') : '',
          id: event?.action_plan[0]?.id?event.action_plan[0].id:null,
        })
        this.actionPlanId=event?.action_plan[0]?.id?event.action_plan[0].id:null
      }
      else{
        this.form.patchValue({
          description:event.title,
        })
      }

      
      this._utilityService.detectChanges(this._cdr)
  
    }
   
    
  }

  setAgenda(event){
    if(event){
      this.form.patchValue({
        title:event.title,
        description:'',
      })
      this.selectedMOM=null;
      this._utilityService.detectChanges(this._cdr)
      this.AgendaMOMs=[...event.meeting_minutes]
    }
   
    
  }
 
  

  // MRM Action Plan Changes Ends Here

  ngOnDestroy() {
    this.AgendaMOMs=[],
    //MeetingsStore.unsetIndividualMeetingsDetails();
    MeetingsStore.unSetMeetings();//meeting list
  }

}
