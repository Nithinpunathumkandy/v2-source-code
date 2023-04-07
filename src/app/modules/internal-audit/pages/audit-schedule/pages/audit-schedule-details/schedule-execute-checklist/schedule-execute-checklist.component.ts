import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { ChecklistAnswersKeysService } from 'src/app/core/services/internal-audit/audit/checklist-answers-keys/checklist-answers-keys.service';
import { ChecklistQuestionsService } from 'src/app/core/services/internal-audit/audit/checklist-questions/checklist-questions.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditSchedulesStore } from 'src/app/stores/internal-audit/audit-schedule/audit-schedule-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { ChecklistAnswersKeyStore } from 'src/app/stores/internal-audit/audit/checklist-answer-keys/cheklist-answer-keys-store';
import { ChecklistQuestionsStore } from 'src/app/stores/internal-audit/audit/checklist-questions/checklist-questions-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-schedule-execute-checklist',
  templateUrl: './schedule-execute-checklist.component.html',
  styleUrls: ['./schedule-execute-checklist.component.scss']
})
export class ScheduleExecuteChecklistComponent implements OnInit , OnDestroy {
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  AppStore = AppStore;
  AuditStore = AuditStore;
  AuditSchedulesStore = AuditSchedulesStore;

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ChecklistAnswersKeyStore = ChecklistAnswersKeyStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };

  selectedQuestion = 0;


  fileUploadsArray = []; // for multiple file uploads
  selectedIndex = null;
  selectedQuestions = 0;
  currentAnswer_id: number = null;
  cancelEventSubscription: any;
  remarks;
  checklist_id: any;

  current_qst_id;

  ChecklistQuestionsStore = ChecklistQuestionsStore;
  auditable_item_id: any;
  formErrors: any;
  index: number = 0;
  answerId: number=null;
  constructor(private _imageService: ImageServiceService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _checklistAnswersKeysService: ChecklistAnswersKeysService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService, private _helperService: HelperServiceService,
    private _auditService: AuditService,
    private _internalAuditFileService: InternalAuditFileService,
    private _checklistQuestionsService: ChecklistQuestionsService) { }

  ngOnInit(): void {

    AppStore.disableLoading();


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
     
      $(this.uploadArea.nativeElement).mCustomScrollbar();

    }, 1000);

    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })

    // scroll event
    window.addEventListener("scroll", this.scrollEvent, true);
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: AppStore.previousUrl }]);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    if(AuditSchedulesStore.auditSchedule_id==undefined){
      this._router.navigateByUrl('internal-audit/audit-schedules');
    } else {
    this.pageChange();
    this.getCurrentChecklist();

    }

  }
  pageChange() {
    this._checklistAnswersKeysService.getAllItems().subscribe(res => {
      this.selectedIndex = res[this.index].id;
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

    var checklist =  ChecklistQuestionsStore.allItems[this.selectedQuestions].answer;
    if (checklist.documents?.length > 0) {
      for (let i of checklist?.documents) {

        let docurl = this._internalAuditFileService.getThumbnailPreview('checklist-answer', i.token);
        let docDetails = {
          created_at: i.created_at,
          created_by: i.created_by,
          updated_at: i.updated_at,
          updated_by: i.updated_by,
          name: i.title,
          ext: i.ext,
          size: i.size,
          url: i.url,
          thumbnail_url: i.url,
          token: i.token,
          preview: docurl,
          id: i.id

        };
        this._auditService.setExecuteChecklistDocDetails(docDetails, docurl);
        setTimeout(() => {
          this.checkForFileUploadsScrollbar();
        }, 200);
      }
    }
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
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

  // scrollbar function
  checkForFileUploadsScrollbar() {

    // if (AuditStore.docDetails.length >= 3 || this.fileUploadsArray.length > 3) {
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

      this._router.navigateByUrl('/internal-audit/audit-schedules/'+AuditSchedulesStore.auditSchedule_id);

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
    this._checklistQuestionsService.getAllItems(AuditSchedulesStore.auditSchedule_id).subscribe(res => {
      this.getCurrentChecklistDetails();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  processSaveData() {
    var items = {
      "audit_schedule_id": AuditSchedulesStore.auditSchedule_id,
      "audit_checklist_answer_key_id": this.currentAnswer_id,
      "auditable_item_id": this.auditable_item_id,
      "checklist_id": this.current_qst_id,
      "remarks": this.remarks,
      "documents": AuditStore.checklistExecuteDocDetails

    }
    return items;

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
      this.answerId = null;
      this.selectedQuestions++;
      if(this.selectedQuestions > ChecklistQuestionsStore.allItems.length-1){
        this._utilityService.showErrorMessage('Error','No More Questions');
        this._router.navigateByUrl('/internal-audit/audit-schedules/'+ AuditSchedulesStore.auditSchedule_id);
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
      this.answerId = null;
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this._router.navigateByUrl('/internal-audit/audit-schedules/'+ AuditSchedulesStore.auditSchedule_id);
      this.resetValues();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });

  }

  resetValues() {
    this.remarks = null;
    this.auditable_item_id = null;
    this.current_qst_id = null;
    this.selectedQuestion = null;
    this.selectedIndex = null;
    AuditStore.clearChecklistExecuteDocumentDetails();
  }



  ngOnDestroy() {

    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    // $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    this.cancelEventSubscription.unsubscribe();
  }


}
