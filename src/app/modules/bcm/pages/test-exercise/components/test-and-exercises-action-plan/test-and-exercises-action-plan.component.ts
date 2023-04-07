import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestAndExerciseService } from 'src/app/core/services/bcm/test-and-exercise/test-and-exercise.service';
import { BaActionPlanService } from 'src/app/core/services/business-assessments/action-plans/ba-action-plan.service';
import { ComplianceActionPlanService } from 'src/app/core/services/compliance-management/compliance-action-plans/compliance-action-plan.service';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { BcmFileServiceService } from 'src/app/core/services/masters/bcm/bcm-file-service/bcm-file-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { TestAndExerciseStore } from 'src/app/stores/bcm/test-exercise/test-and-exercise.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
// import { BAActionPlanStore } from 'src/app/stores/business-assessments/assessments/assessment-action-plan.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-test-and-exercises-action-plan',
  templateUrl: './test-and-exercises-action-plan.component.html',
  styleUrls: ['./test-and-exercises-action-plan.component.scss']
})
export class TestAndExercisesActionPlanComponent implements OnInit {
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @Input ('source')sourceData:any;
  form: FormGroup;
  formErrors: any;
  AppStore=AppStore;
  UsersStore=UsersStore;
  // BAActionPlanStore=BAActionPlanStore;
  todayDate: any = new Date();
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  fileUploadPopupSubscriptionEvent: any;
  popupControlSubscription: any = null;
  constructor(private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    // private _BAactionPlanService:BaActionPlanService
    private _testActionPlanService:TestAndExerciseService,
    private _renderer2: Renderer2,
    private _fileUploadPopupService: FileUploadPopupService,
    private _eventFileService: EventFileServiceService,
    private _bcmFileServiceService: BcmFileServiceService,
    private _documentFileService: DocumentFileService,) { 
    
  }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    AppStore.disableLoading();
    this.form = this._formBuilder.group({
      id: [null],
      test_and_exercise_id: [null],
      title: ["", [Validators.required]],
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],
      responsible_user_id: [null, [Validators.required]],
      description:['']
    });
    
    this.resetForm()

    if(this.sourceData && this.sourceData.values){
      this.getUsers()
      this.setEditData()
    }
    
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})
  }
  setEditData(){
    this.clearCommonFilePopupDocuments()
    this.setDocuments(this.sourceData?.values?.documents);
    let patchData=this.sourceData.values
    
    this.form.patchValue({
      id:patchData.id?patchData.id:'',
      title:patchData.title?patchData.title:'',
      start_date:this._helperService.processDate(patchData.start_date, 'split'),
      target_date:this._helperService.processDate(patchData.target_date, 'split'),
      responsible_user_id:patchData.responsible_user?patchData.responsible_user: null,
      description:patchData.description?patchData.description:''
    })
  }
  // createImageUrl(type,token) {// user-defined
  //   return this._imageService.getThumbnailPreview(type, token)
  // }
  createImageUrl(type, token) {
    if(type=='action-plan-details')
    return this._bcmFileServiceService.getThumbnailPreview(type, token);
    else
    return this._documentFileService.getThumbnailPreview(type, token);

  }
  
  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }
  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
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

  save(close: boolean = false) {
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
        if(this.form.value.id)
        save = this._testActionPlanService.updateActionPlan(this.form.value.id, this.processData('update'));
        else
        save=this._testActionPlanService.addActionPlan(this.processData('save'))
          save.subscribe(
            (res: any) => {
              this.resetForm();
              AppStore.disableLoading();
              this._utilityService.detectChanges(this._cdr);
              if (close) this.closeFormModal();
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
          )
    }
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  clearCommonFilePopupDocuments() {

    fileUploadPopupStore.clearFilesToDisplay();
  
    fileUploadPopupStore.clearKHFiles();
  
    fileUploadPopupStore.clearSystemFiles();
  
    fileUploadPopupStore.clearUpdateFiles();
  
  }
  cancel() {
    this.closeFormModal();
  }
  
  processData(type){
    let data=this.form.value
    let saveData={};
    saveData['title'] = data.title
    saveData['start_date'] = this._helperService.processDate( data.start_date, 'join')
    saveData['target_date'] = this._helperService.processDate( data.target_date, 'join')
    saveData['responsible_user_id'] = data.responsible_user_id.id
    saveData['test_and_exercise_id'] = TestAndExerciseStore.selectedId
    saveData['description'] = data.description
    if (type == 'update') {
     // saveData['id'] = data.id
			saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
		} else{
			saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
		}
    return saveData;
    // let data=this.form.value
    // data={
    //       test_and_exercise_id: TestAndExerciseStore.selectedId,
    //       title:data.title,
    //       start_date:this._helperService.processDate( data.start_date, 'join'),
    //       target_date:this._helperService.processDate( data.target_date, 'join'),
    //       responsible_user_id:data.responsible_user_id.id,
    //       // document_id:this.sourceData.values.checklistId,
    //       description:data.description
    // }
    // if(type=='save')
    // delete data.id
    // return data
    // if(this.sourceData.type=='checklist-edit'){
    //   if(type=='save'){
    //     delete data.id
        
    //     data={
    //       title:data.title,
    //       start_date:data.start_date,
    //       target_date:data.target_date,
    //       is_new:true,
    //       responsible_users:data.responsible_user_ids,
    //       display_user:data.responsible_user_ids,
    //       description:data.description
    //     }
    //     BAActionPlanStore.formType='add'
    //     BAActionPlanStore.setDisplayData(data)
    //   }
      
    //   else{
        
    //     data={
    //       id:data.id,
    //       title:data.title,
    //       start_date:data.start_date,
    //       target_date:data.target_date,
    //       is_edit:true,
    //       responsible_users:data.responsible_user_ids,
    //       display_user:data.responsible_user_ids,
    //       description:data.description
    //     }
  
    //     BAActionPlanStore.formType='edit'
    //     BAActionPlanStore.setDisplayData(data)
  
    //   }
  
    // }
    // else{

      // if(type=='update'){
      //   data={
      //     id:data.id,
      //     title:data.title,
      //     start_date:this._helperService.processDate( data.start_date, 'join'),
      //     target_date:this._helperService.processDate( data.target_date, 'join'),
      //     responsible_user_ids:[data.responsible_user_ids.id],
      //     business_assessment_document_content_checklist_id:this.sourceData.values.checklistId,
      //     description:data.description
      //   }
      //   return data
      // }
    // }
  }
  closeFormModal() {
    this._eventEmitterService.dismissExerciseActionPlanModal();
    this. resetForm()
  }
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.clearCommonFilePopupDocuments()
  }
  openFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = true;
			$('.modal-backdrop').add();
			document.body.classList.add('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
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
  removeDocument(token) {
    console.log("kjbiu")
    TestAndExerciseStore.unsetProductImageDetails('support-file', token);
    this._utilityService.detectChanges(this._cdr);
  }
  removeBrochure(doc) {
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
    // PolicyStore.unsetFileDetails('brochure', token);
    this.enableScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }   
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }
  enableScrollbar() {
		if (fileUploadPopupStore.displayFiles.length >= 3) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
			// $(this.previewUploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
			// $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
		}
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
 
}
