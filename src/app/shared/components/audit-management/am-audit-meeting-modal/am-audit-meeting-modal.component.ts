import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmAuditMeetingService } from 'src/app/core/services/audit-management/am-audit/am-audit-meeting/am-audit-meeting.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MeetingTypeService } from 'src/app/core/services/masters/mrm/meeting-type/meeting-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditMeetingStore } from 'src/app/stores/audit-management/am-audit/am-audit-meeting.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MeetingTypeMasterStore } from 'src/app/stores/masters/mrm/meeting-type-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-am-audit-meeting-modal',
  templateUrl: './am-audit-meeting-modal.component.html',
  styleUrls: ['./am-audit-meeting-modal.component.scss']
})
export class AmAuditMeetingModalComponent implements OnInit {
  @Input('source')meetingObject:any
	@ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
	@ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
	@ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  form:FormGroup
  fileUploadPopupSubscriptionEvent:any;
  todayDate: any = new Date();
  AmAuditMeetingStore = AmAuditMeetingStore;
  formErrors = null;
  UsersStore = UsersStore;
  AppStore = AppStore;

  OrganizationLevelObject = {
		component: 'Audit',
		values: null,
		type: null
	};
  organisationChangesModalSubscription:any;
  cancelEventSubscription:any
  openModelPopup: boolean;
  fileUploadPopupStore = fileUploadPopupStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MeetingTypeMasterStore = MeetingTypeMasterStore;
  constructor(private _formBuilder:FormBuilder,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _documentFileService:DocumentFileService,
    private _helperService:HelperServiceService,
    private _humanCapitalService:HumanCapitalService,
    private _usersService:UsersService,
    private _fileUploadPopupService:FileUploadPopupService,
    private _renderer2:Renderer2,
    private _auditManagementService:AuditManagementService,
    private _meetingTypeService:MeetingTypeService,
    private _meetingService:AmAuditMeetingService,
    private _imageService:ImageServiceService) { }

  ngOnInit(): void {
    
    this.form = this._formBuilder.group({
      id:[null],
      to:['',[Validators.required]],
      from:['',[Validators.required]],
      title:['',[Validators.required]],
      duration:[''],
      organizer_id:[null,[Validators.required]],
      meeting_participants:[[]],
      user_ids:[[]],
      meeting_type_ids:[[]],
    });

    
    this.getMeetingType(); 

    this.form.get('from').valueChanges.subscribe(val => { //one houre extra set end_date/time
      if(val){
        let milliseconds = val.getTime() + (1 * 60 * 60 * 1000);
        let date = new Date(milliseconds);
        this.form.controls['to'].setValue(date);
      }
    });

    this.form.get('to').valueChanges.subscribe(val=>{ //end date click duration time set automatic
      this.form.controls['duration'].setValue(''); 
      this.form.controls['duration'].setValue(this.setDuration(this.form.value.from,val)); 
    });


    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})



      if(this.meetingObject.type=='Add'){
        // this.setInitialOrganizationLevels();
      }
      else{
        this.setFormValues();
      }
    

  }

  
/**** START EDIT ****/
setFormValues() {


   var meetingItem =JSON.parse(JSON.stringify(AmAuditMeetingStore.individualMeetingDetails));
    this.clearCommonFilePopupDocuments();
    if (meetingItem.documents.length > 0) {
            
      this.setDocuments(meetingItem.documents);
    }


    this.form.patchValue({
      id: AmAuditMeetingStore.individualMeetingDetails.id? AmAuditMeetingStore.individualMeetingDetails.id: null,
      organizer_id: AmAuditMeetingStore.individualMeetingDetails?.organizer.id ? AmAuditMeetingStore.individualMeetingDetails.organizer : null,
     from:AmAuditMeetingStore.individualMeetingDetails.start ?  new Date (AmAuditMeetingStore.individualMeetingDetails.start) : '',
      to:AmAuditMeetingStore.individualMeetingDetails.end ?  new Date (AmAuditMeetingStore.individualMeetingDetails.end) : '',
      title:AmAuditMeetingStore.individualMeetingDetails.title ?  AmAuditMeetingStore.individualMeetingDetails.title : '',
      meeting_type_ids: AmAuditMeetingStore.individualMeetingDetails.meeting_types ? this._helperService.getArrayProcessed(AmAuditMeetingStore.individualMeetingDetails.meeting_types,null) : [],
      duration: AmAuditMeetingStore.individualMeetingDetails.duration?this.formatHour(AmAuditMeetingStore.individualMeetingDetails.duration):this.setDuration(AmAuditMeetingStore.individualMeetingDetails.start,AmAuditMeetingStore.individualMeetingDetails.end),
      meeting_participants:AmAuditMeetingStore.individualMeetingDetails.meeting_participants ?this.getParticipantData(AmAuditMeetingStore.individualMeetingDetails.meeting_participants) : [],
    });
    // this.checkFormObject()
    this._utilityService.detectChanges(this._cdr);  
  }


  formatHour(hour){
    let h = hour.split('.')[0];
    let m = hour.split('.')[1];
    return h+":"+m;
  }

  
  getParticipantData(data){
    let participants = [];
    for(let i of data){
      participants.push(i.user);
    }
    return participants;
  }


   // Returns Values as Array for multiple select case
   getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i);
    }
    return returnValue;

  }

  onCheckboxChange(e,data) { //checkbox online,offline
    if(this.form.value.meeting_type_ids){
      const meeting_type_ids:any = this.form.get('meeting_type_ids').value;
      if (e.target.checked) {
        meeting_type_ids?.push(data);
      } else {
          const index = meeting_type_ids?.findIndex(x => x.id === data.id);
          meeting_type_ids?.splice(index,1);
      }
      this.form.patchValue({
        meeting_type_ids: meeting_type_ids
      });
    }
  
  }

  getMeetingTypeStatus(id: number){ //checkbox online,offline
    if(this.form.value.meeting_type_ids){
      const meeting_type_ids = this.form.get('meeting_type_ids').value;
      const index = meeting_type_ids?.findIndex(x => x.id === id);
      if(index != -1) return true;
      else return false;
    }
    else
    return false;
   
  }

  getMeetingType(){ //checkbox online,offline
    this._meetingTypeService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // setDuration(startDateTime:any,endDateTime:any){ //DurationTime
  //   let startTime = new Date(startDateTime); 
  //   let endTime = new Date(endDateTime);
  //   let millisec = endTime.getTime() - startTime.getTime(); // in milliseconds
  //    let hour = (millisec / (1000 * 60 * 60)).toFixed(2);
    
  //   let hh:any=hour.split(".")[0];
  //   let mm:any=hour.split(".")[1];
  
  //   if(hh<10){
  //     return "0"+hh+"."+mm;
  //   }else{
  //     if(hh<24){ 
  //       return hour;}
  //     else{ 
  //       return "00.00";}  
  //   } 
  // }

  setDuration(startDateTime:any,endDateTime:any){ //DurationTime
    let hour=0;
    let minutes=0;
    if(startDateTime){
      let startTime = new Date(startDateTime); 
      let endTime = new Date(endDateTime);
      let millisec = endTime.getTime() - startTime.getTime(); // in milliseconds
      // var resultInMinutes = millisec / 60000; 
      // var housers=Math.round(resultInMinutes/60);
      hour = Math.floor((millisec / (1000 * 60 * 60))%24);
      // let seconds = (int) (milliseconds / 1000) % 60 ;
      minutes = ((millisec / (1000*60)) % 60);
      
    }
  
   
    let hh:any=hour;
    // .split(".")[0];
    let mm:any=minutes;
    // console.log('hh'+hh+)
  
    // if(hh<10){
    //   return "0"+hh+"."+mm;
    // }else{
    //   if(hh<24){ 
    //     return hour;}
    //   else{ 
    //     return "00.00";}  
    // } 
    return hh+':'+mm;
  }

  createDateTimeValidator() {

    return this.form.value.from?this.form.value.from:this.todayDate;
  }

  
  createImageUrl(type,token) {// user-defined
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getButtonText(text){// user-defined
    return this._helperService.translateToUserLanguage(text);
  }

  
	// *Common  File Upload/Attach Modal Functions Ends Here

  getSaveData(){//user defined
    let saveData = {
      am_audit_id:AmAuditsStore.auditId,
       organizer_id: this.form.value.organizer_id? this.form.value.organizer_id.id : '',
       start: this.form.value.from ? this._helperService.passSaveFormatDate(this.form.value.from) : '',
      end: this.form.value.to ? this._helperService.passSaveFormatDate(this.form.value.to) : '',
      duration:this.form.value.duration ? this.form.value.duration : '',
      title: this.form.value.title ? this.form.value.title : '',
      meeting_type_ids:this._helperService.getArrayProcessed(this.form.value.meeting_type_ids,'id'),
     meeting_participants: this.form.value.meeting_participants ?  this.getParticipantsArray(this.form.value.meeting_participants): [],
      
    }; 
    if (this.form.value.id) {
		saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
    } else{
			saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
		}

    return saveData;

  }

  formatDuration(duration){
    let hour=0;
    if(this.form.value.from){
      let startTime = new Date(this.form.value.from); 
      let endTime = new Date(this.form.value.to);
      let millisec = endTime.getTime() - startTime.getTime(); // in milliseconds
      // var resultInMinutes = millisec / 60000; 
      // var housers=Math.round(resultInMinutes/60);
      hour = millisec / (1000 * 60 * 60);
    }
    

    //  let d = duration.split(':');
    //  let hh = d[0];
    //  let mm = Math.round(d[1]);
    //  millisec / (1000 * 60 * 60))%24
      // if(hh<10){
      //   return "0"+hh+"."+mm;
      // }else{
      //   if(hh<24){ 
      //     return hour;}
      //   else{ 
      //     return "00.00";}  
      // } 
      // if(mm==0){
      //   return hh+'.0'+mm;
      // }
    //  if(mm<10){
    //   return hh+'.'+mm+'0';
    //  }
    //  else{
       return hour;
    //  }
     
   }
  getParticipantsArray(data){
    let participants=[];
    for(let i of data){
      participants.push({user_id:i.id});
    }
    return participants;
  }
  
  getUsers(allData: boolean = false) {
    var params = '';
 
    this._usersService.searchUsers(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  searchUsers(e, allUsers: boolean = false) {
      this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
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
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  enableScrollbar() {
		if (fileUploadPopupStore.displayFiles.length >= 3) {
			$(this.uploadArea?.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
		}
	}

  
  openFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = true;
			$('.modal-backdrop').add();
			document.body.classList.add('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
			this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
			setTimeout(() => {
				$(this.fileUploadModal.nativeElement).modal('show');
				this._utilityService.detectChanges(this._cdr)
			}, 100);
		}, 250);
	}
	closeFileUploadModal() {
		// setTimeout(() => {
			fileUploadPopupStore.openPopup = false;
			document.body.classList.remove('modal-open')
			$(this.fileUploadModal.nativeElement).modal('hide');
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
			this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
			$('.modal-backdrop').remove();
						this._utilityService.detectChanges(this._cdr)
		}

  
  clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}

  clearEditFiles(){
    fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }
	removeBrochure(type,token) {
		fileUploadPopupStore.unsetFileDetails(type, token);
		this._utilityService.detectChanges(this._cdr);
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

    setDocuments(documents) {

      let khDocuments = [];
      documents.forEach(element => {
        if (element.document_id) {
          element?.kh_document?.versions?.forEach(innerElement => {
  
            if (innerElement.is_latest) {
              khDocuments.push({
                ...innerElement,
                title:element?.kh_document.title,
                'is_kh_document': true
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
            var purl = this._auditManagementService.getThumbnailPreview('information-request', element.token)
            var lDetails = {
              created_at: element.created_at,
              created_by: element.created_by,
              updated_at: element.updated_at,
              updated_by: element.updated_by,
              name: element.title,
              ext: element.ext,
              size: element.size,
              url: element.url,
              token: element.token,
              thumbnail_url: element.thumbnail_url,
              preview: purl,
              id: element.id,
              asset_id: element.asset_id,
              'is_kh_document': false,
            }
          }
          this._fileUploadPopupService.setSystemFile(lDetails, purl);
  
        }
  
      });
      fileUploadPopupStore.setKHFile(khDocuments)
      let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
      fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  
    }

    closeFormModal() {
      this.clearItems();
      this._eventEmitterService.dismissAmAuditMeetingModal();
    }

    clearItems(){
      this.form.reset();
      this.formErrors = null;
      this.clearFIleUploadPopupData();
    }
    
    clearFIleUploadPopupData() {
      fileUploadPopupStore.clearFilesToDisplay();
      fileUploadPopupStore.clearKHFiles();
      fileUploadPopupStore.clearSystemFiles();
      fileUploadPopupStore.clearSystemFiles();
    }


  saveMeeting(close: boolean = false) {
    this.formErrors=null;
	  let save;
	  AppStore.enableLoading();

	if (this.meetingObject?.type=='Add')
	save = this._meetingService.saveItem(this.getSaveData());
  else
	save = this._meetingService.updateItem(this.form.value.id, this.getSaveData());


  save.subscribe((res: any) => {
	AppStore.disableLoading();
  if(!this.form.value.id){
    this.clearItems();
  }
  else{
    this.clearEditFiles();
  }
	this._utilityService.detectChanges(this._cdr)
	if (close) this.closeFormModal();
  }, (err: HttpErrorResponse) => {
	if (err.status == 422) {
	  this.formErrors = err.error.errors;
	}
	else if (err.status == 500 || err.status == 403) {
	  this.closeFormModal();
	}
	AppStore.disableLoading();
	this._utilityService.detectChanges(this._cdr);

  });

  }

  
	checkExtension(ext, extType) {
		return this._imageService.checkFileExtensions(ext, extType);
	}

	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}
  
}
