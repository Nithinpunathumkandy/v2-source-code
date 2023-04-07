import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { ChecklistAnswersKeysService } from 'src/app/core/services/internal-audit/audit/checklist-answers-keys/checklist-answers-keys.service';
import { ChecklistQuestionsService } from 'src/app/core/services/internal-audit/audit/checklist-questions/checklist-questions.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { AuditFindingCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-finding-categories/audit-finding-categories.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { ChecklistAnswersKeyStore } from 'src/app/stores/internal-audit/audit/checklist-answer-keys/cheklist-answer-keys-store';
import { ChecklistQuestionsStore } from 'src/app/stores/internal-audit/audit/checklist-questions/checklist-questions-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';
import { AuditFindingCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-finding-categories-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RiskRatingService } from 'src/app/core/services/masters/external-audit/risk-rating/risk-rating.service';
declare var $: any;
@Component({
  selector: 'app-execute-checklist',
  templateUrl: './execute-checklist.component.html',
  styleUrls: ['./execute-checklist.component.scss']
})
export class ExecuteChecklistComponent implements OnInit, OnDestroy {
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  AppStore = AppStore;
  AuditStore = AuditStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ChecklistAnswersKeyStore = ChecklistAnswersKeyStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  AuditFindingCategoryMasterStore = AuditFindingCategoryMasterStore;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'Are you sure you want to cancel?',
    type: 'Cancel'
  };

  selectedQuestion = 0;

  is_answered: boolean = false;


  fileUploadsArray = []; // for multiple file uploads
  selectedIndex = null;
  selectedQuestions = 0;
  currentAnswer_id: number = null;
  cancelEventSubscription: any;
  fileUploadPopupSubscriptionEvent: any = null;
  is_finding:boolean=false;
  finding_id:number;
  finding_category_id:number;
  risk_rating_id:number;
  remarks;
  checklist_id: any;

  current_qst_id;
  answerId:number;

  ChecklistQuestionsStore = ChecklistQuestionsStore;
  auditable_item_id: any;
  formErrors: any;
  index: number = 0;
  setReadOnly: boolean;
  constructor(private _imageService: ImageServiceService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _checklistAnswersKeysService: ChecklistAnswersKeysService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService, private _helperService: HelperServiceService,
    private _auditService: AuditService,
    private _internalAuditFileService: InternalAuditFileService,
    private _checklistQuestionsService: ChecklistQuestionsService,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _auditFindingCategoryService: AuditFindingCategoriesService,
    private _riskRatingService: RiskRatingService,
    ) { }

  ngOnInit(): void {

    AppStore.disableLoading();
    this.getFindingCategory();
    this.getRiskRating();
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    });
    setTimeout(() => {

      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');

    }, 1000);

    setTimeout(() => {
     
      $(this.uploadArea?.nativeElement).mCustomScrollbar();

    }, 1000);

    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    // scroll event
    window.addEventListener("scroll", this.scrollEvent, true);
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: AppStore.previousUrl }]);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(AuditStore.schedule_id==undefined){
      this._router.navigateByUrl('internal-audit/audits');
    } else {
    this.pageChange();
    this.getCurrentChecklist();

    }

  }
  pageChange() {
    this._checklistAnswersKeysService.getAllItems().subscribe(res => {

      // this.selectedIndex = res[this.index].id;
      // this.currentAnswer_id = res[this.index].id;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAnswerID(id: number) {
    if (this.selectedIndex == id) {
      this.selectedIndex = null;
      this.currentAnswer_id = null// clrearing value upon unselect
    } else {
      this.selectedIndex = id;
      this.currentAnswer_id = id;
    }
  }



  getCurrentChecklistDetails() {
    this.current_qst_id = ChecklistQuestionsStore.allItems[this.selectedQuestions].checklist_id;
    this.auditable_item_id = ChecklistQuestionsStore.allItems[this.selectedQuestions].auditable_item_id;
    this.answerId = ChecklistQuestionsStore.allItems[this.selectedQuestions].answer.id;
    this.remarks = ChecklistQuestionsStore.allItems[this.selectedQuestions].answer.remarks;
    this.currentAnswer_id = ChecklistQuestionsStore.allItems[this.selectedQuestions].answer.audit_checklist_answer_key_id;
    this.selectedIndex = ChecklistQuestionsStore.allItems[this.selectedQuestions].answer.audit_checklist_answer_key_id;
    this.finding_id=ChecklistQuestionsStore.allItems[this.selectedQuestions].answer.finding_id;
    if(this.finding_id!=null){
      this.setReadOnly=true;
      this.is_finding=true;
      this.finding_category_id=ChecklistQuestionsStore.allItems[this.selectedQuestions].answer.finding.finding_category_id;
      this.risk_rating_id=ChecklistQuestionsStore.allItems[this.selectedQuestions].answer.finding.risk_rating_id;
    }
    else{
      this.is_finding=false
      this.setReadOnly=false;
    }


    var checklist =  ChecklistQuestionsStore.allItems[this.selectedQuestions].answer;
    if (checklist.documents?.length > 0) {
      this.setDocuments(checklist.documents)
      // for (let i of checklist?.documents) {

      //   let docurl = this._internalAuditFileService.getThumbnailPreview('checklist-answer', i.token);
      //   let docDetails = {
      //     created_at: i.created_at,
      //     created_by: i.created_by,
      //     updated_at: i.updated_at,
      //     updated_by: i.updated_by,
      //     name: i.title,
      //     ext: i.ext,
      //     size: i.size,
      //     url: i.url,
      //     thumbnail_url: i.url,
      //     token: i.token,
      //     preview: docurl,
      //     id: i.id

      //   };
      //   this._auditService.setExecuteChecklistDocDetails(docDetails, docurl);
        setTimeout(() => {
          this.enableScrollbar();
        }, 300);
      // }
    }

  }

  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  setDocuments(documents){
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

      if(element.document_id){
        element.kh_document.versions.forEach(innerElement => {

          if(innerElement.is_latest){
            khDocuments.push({
              ...innerElement,
              'is_kh_document':true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId':element.id,
              ...innerElement
              
            })
          }

        });
      }
      else
      {
        if (element && element.token) {
          var purl = this._internalAuditFileService.getThumbnailPreview('audit-plan', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document':false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments=[...fileUploadPopupStore.getKHFiles,...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  checkLogoIsUploading(){// doc-add  Check if logo is being uploaded
    return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
  }

  // file change function

  onFileChange(event, type: string) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams) // Upload file to temporary storage
            .subscribe((res: HttpEvent<any>) => {
              let uploadEvent: any = res;
              switch (uploadEvent.type) {
                case HttpEventType.UploadProgress:
                  // Compute and show the % done;
                  if (uploadEvent.loaded) {
                    let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                    this.assignFileUploadProgress(upProgress, file);
                  }
                  this._utilityService.detectChanges(this._cdr);
                  break;
                case HttpEventType.Response:
                  //return event;
                  let temp: any = uploadEvent['body'];
                  temp['is_new'] = true;
                  this.assignFileUploadProgress(null, file, true);
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
                    this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                  }, (error) => {
                    this.assignFileUploadProgress(null, file, true);
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
              this.assignFileUploadProgress(null, file, true);
              this._utilityService.detectChanges(this._cdr);
            })
        }
        else {
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }
  }

  // imageblob function
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._auditService.setExecuteChecklistDocDetails(imageDetails, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  /**
 * 
 * @param progress File Upload Progress
 * @param file Selected File
 * @param success Boolean value whether file upload success 
 */
  assignFileUploadProgress(progress, file, success = false) {

    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }



  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }

  // checkAcceptFileTypes(type){
  //   return this._imageService.getAcceptFileTypes(type); 
  // }


  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    AuditStore.unsetChecklistExecuteDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  removeDocumentFromKH(token) {
    //AuditStore.unsetChecklistExecuteDocumentDetails(token);
    fileUploadPopupStore.unsetFileDetails('document-file',token)
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  // scrollbar function
  checkForFileUploadsScrollbar() {

    // if (AuditStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
    //   $(this.uploadArea.nativeElement).mCustomScrollbar();
    // }
    // else {
    //   $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    // }
  }

  // scroll event
  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  };


  cancelByUser(status) {
    if (status) {

      this._router.navigateByUrl('internal-audit/audits/'+AuditStore.audit_id+'/schedules');

    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }


  confirmCancel() {
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('show');
    }, 100);

  }

  getCurrentChecklist() {
    this.resetValues();
    this._checklistQuestionsService.getAllItems(AuditStore.schedule_id).subscribe(res => {
      this.getCurrentChecklistDetails();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  processSaveData() {

    var items = {
      "audit_schedule_id": AuditStore.schedule_id,
      "audit_checklist_answer_key_id": this.currentAnswer_id,
      "auditable_item_id": this.auditable_item_id,
      "checklist_id": this.current_qst_id,
      "remarks": this.remarks,
  
    }

    // To only pass finding related parameters when each answer doesnt have finding already mapped to it.

    if(this.finding_id){
      items['finding_category_id']=this.finding_category_id,
      items['risk_rating_id']=this.risk_rating_id,
      items['finding_id']=this.finding_id
    }

    
    if(this.is_finding && !this.finding_id){
      items['finding_category_id']=this.finding_category_id,
      items['risk_rating_id']=this.risk_rating_id,
      items['is_finding']=this.is_finding
    }
    
    if(this.answerId){
      items['documents']=this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray,fileUploadPopupStore.getKHFiles,fileUploadPopupStore.getSystemFile)
    }else
    items['documents']=this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
    return items;

  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  previous(){    
    this.selectedQuestions--    
    this.getCurrentChecklist();
  }

  clearFindingSelectionData(){
    this.finding_category_id=null;
    this.risk_rating_id=null;
    this.is_finding=null;
    this.finding_id=null;
  }
  
  singleSave() {

    // this.getCurrentChecklistDetails();

    this.formErrors = null;
    let save;
    AppStore.enableLoading();
      if(this.answerId){
        save = this._auditService.updateChecklistAnswers(this.answerId,this.processSaveData());
      } else {
        save = this._auditService.saveChecklistAnswers(this.processSaveData());
      }
  
    save.subscribe((res: any) => {
      this.clearCommonFilePopupDocuments();
      this.clearFindingSelectionData();
      this.answerId = null;
      this.selectedQuestions++;
      if(this.selectedQuestions > ChecklistQuestionsStore.allItems.length-1){
        this._utilityService.showErrorMessage('Error','No More Questions');
        this._router.navigateByUrl('internal-audit/audits/'+AuditStore.current_audit_id+'/schedules');
      } else {
        this.getCurrentChecklist();
        this.pageChange();
        this.index + 1;        
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }
  save() {

    // this.getCurrentChecklistDetails();
    this.formErrors = null;
    let save;
    AppStore.enableLoading();
    if(this.answerId){
      save = this._auditService.updateChecklistAnswers(this.answerId,this.processSaveData());
    } else {
      save = this._auditService.saveChecklistAnswers(this.processSaveData());
    }
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this._router.navigateByUrl('internal-audit/audits/'+AuditStore.current_audit_id+'/schedules');
      this.resetValues();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });

  }

    // get risk ratings
    getRiskRating() {
      this._riskRatingService.getAllItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  

    // getting finding category
    getFindingCategory() {
      this._auditFindingCategoryService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  
    // searching in finding category
  
    searchFindingCategory(e) {
      this._auditFindingCategoryService.getItems(false, '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }

  setFinding(event) {

    if (event.target.checked) {
    this.is_finding=event.target.checked
    }
    else {
      this.is_finding=event.target.checked

    }
    this._utilityService.detectChanges(this._cdr);
  }

  resetValues() {
    this.remarks = null;
    this.auditable_item_id = null;
    this.current_qst_id = null;
    this.selectedQuestion = null;
    this.selectedIndex = null;
    AuditStore.clearChecklistExecuteDocumentDetails();
    AuditStore.unsetChecklistExecuteDocumentDetails();
  }

// *Common  File Upload/Attach Modal Functions Starts Here

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
      // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }, 100);
}

createImageUrl(type, token) {
  if(type=='document-version')
  return this._documentFileService.getThumbnailPreview(type, token);
  // else
  // return this._organizationFileService.getThumbnailPreview(type,token);
  
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

  // *Common  File Upload/Attach Modal Functions Ends Here

  ngOnDestroy() {

    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    // $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    this.cancelEventSubscription.unsubscribe();
  }


}
