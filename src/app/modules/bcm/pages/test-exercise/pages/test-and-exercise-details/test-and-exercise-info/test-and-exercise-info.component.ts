import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { autorun, IReactionDisposer } from 'mobx';
import { TestAndExercisesWorkflowService } from 'src/app/core/services/bcm/test-and-exercise-workflow/test-and-exercise-workflow.service';
import { TestAndExerciseService } from 'src/app/core/services/bcm/test-and-exercise/test-and-exercise.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { BcmFileServiceService } from 'src/app/core/services/masters/bcm/bcm-file-service/bcm-file-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { TestAndExerciseStore } from 'src/app/stores/bcm/test-exercise/test-and-exercise.store';
import { TestAndExercisesWorkflowStore } from 'src/app/stores/bcm/test-exercise/test-and-exercises-workflow.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-test-and-exercise-info',
  templateUrl: './test-and-exercise-info.component.html',
  styleUrls: ['./test-and-exercise-info.component.scss']
})
export class TestAndExerciseInfoComponent implements OnInit {
  
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('statusHistoryFormModal', { static: true }) statusHistoryFormModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  TestAndExerciseStore = TestAndExerciseStore
  TestAndExercisesWorkflowStore = TestAndExercisesWorkflowStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore
  testObject = {
    component: 'test_and_exrecise',
    values: null,
    type: null
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };


  workflowModalOpened: boolean=false;
  workflowHistoryOpened=false

  exerciseModalSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  testAndExerciseWorkflowHistorySubscription: any;
  TestAndExercisesWorkflowSubscription: any;
  TestAndExercisesCommentSuvscription: any;
  popupControlEventSubscription: any;

  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _renderer2: Renderer2,
    private _bcmFileService: BcmFileServiceService,
    private _documentFileService: DocumentFileService,
    private _testAndExerciseService: TestAndExerciseService,
    private _eventEmitterService: EventEmitterService,
    private _testAndExercisesWorkflowService: TestAndExercisesWorkflowService
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      if(TestAndExerciseStore.detailsLoaded && TestAndExerciseStore.riskTestEndExercise && TestAndExercisesWorkflowStore?.workflowDetails){
        this.setSubMenu(TestAndExerciseStore.riskTestEndExercise)
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.openFormModal()
            this._utilityService.detectChanges(this._cdr);
            break;
          case "export_to_excel":
            // this.exportRiskContext();
            break;
            case 'submit':
              this.submitTestAndExerciseForReview();
              break
            case 'approve':
              this.approveWorkflow();
              break
            case 'review_submit':
                this.approveWorkflow(true);
                break
            case 'revert':
                this.revertWorkflow();
                break
            case "history": 
            this.openHistoryPopup();
                break;
            case "workflow": 
            this.openWorkflowPopup();
                break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.exerciseModalSubscription = this._eventEmitterService.exerciseAddModal.subscribe(item => {
      this.closeFormModal();
      this.getExercise()
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.testAndExerciseWorkflowHistorySubscription = this._eventEmitterService.TestAndExercisesHistory.subscribe(element=>{
      this.closeHistoryPopup();
    })

    this.TestAndExercisesWorkflowSubscription = this._eventEmitterService.TestAndExercisesWorkflow.subscribe(element=>{
      this.closeWorkflowPopup();
    })

    this.TestAndExercisesCommentSuvscription = this._eventEmitterService.TestAndExercisesWorkflowCommentModal.subscribe(element=>{
      this.closeCommentForm();
    })

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.getExercise()
  }

  changeZIndex(){
    if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
    if($(this.statusHistoryFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.statusHistoryFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.statusHistoryFormModal.nativeElement,'overflow','auto');
    }
  }

  getExercise(){
    TestAndExerciseStore.detailsLoaded = false
    this._testAndExerciseService.getItem(TestAndExerciseStore.selectedId).subscribe(res => {
      this.getTestExerciseWorkflow();
    })
  }

  getTestExerciseWorkflow(){
    this._testAndExercisesWorkflowService.getItems(TestAndExerciseStore.selectedId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setSubMenu(res){
    if(res.test_and_exercise_status.type=='in-review'){
      var subMenuItems = [
        {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW', submenuItem: {type: 'workflow'}},
        {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        {activityName:'APPROVE_TEST_AND_EXERCISE',submenuItem:{type:'approve'}},
          {activityName:'REVERT_TEST_AND_EXERCISE',submenuItem:{type:'revert'}},
        {activityName: null, submenuItem: {type: 'close', path: "../"}},
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);   
      this._utilityService.detectChanges(this._cdr);
    }
    else if(res.test_and_exercise_status.type=='completed'){
      var subMenuItems = [
        {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW', submenuItem: {type: 'workflow'}},
        {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        {activityName: null, submenuItem: {type: 'close', path: "../"}},
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);   
      this._utilityService.detectChanges(this._cdr);
    }
    else if(res.next_review_user_level==1&&res.submitted_by==null){
      var subMenuItems = [
        {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW', submenuItem: {type: 'workflow'}},
        {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        {activityName:'SUBMIT_TEST_AND_EXERCISE',submenuItem:{type:'submit'}},
        { activityName: 'UPDATE_TEST_AND_EXERCISE', submenuItem: { type: 'edit_modal' } },
        {activityName: null, submenuItem: {type: 'close', path: "../"}},
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);   
      this._utilityService.detectChanges(this._cdr);
    }   
    else if(res.submitted_by!=null && res.next_review_user_level && this.isUser()){
      if (res?.next_review_user_level == TestAndExercisesWorkflowStore?.workflowDetails[TestAndExercisesWorkflowStore?.workflowDetails?.length - 1]?.level){
        var subMenuItems = [
          {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW', submenuItem: {type: 'workflow'}},
          {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
          {activityName:'APPROVE_TEST_AND_EXERCISE',submenuItem:{type:'approve'}},
          {activityName:'REVERT_TEST_AND_EXERCISE',submenuItem:{type:'revert'}},
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      else if (res.next_review_user_level != TestAndExercisesWorkflowStore?.workflowDetails[TestAndExercisesWorkflowStore?.workflowDetails?.length - 1]?.level){
        var subMenuItems = [
          {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW', submenuItem: {type: 'workflow'}},
          {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
          {activityName:'SUBMIT_TEST_AND_EXERCISE',submenuItem:{type:'review_submit'}},
          {activityName:'REVERT_TEST_AND_EXERCISE',submenuItem:{type:'revert'}},
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
    }else{
      if (res.outcome) {
        var subMenuItems = [
          {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW', submenuItem: {type: 'workflow'}},
          {activityName:'LIST_TEST_AND_EXERCISE_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
          {activityName:'UPDATE_TEST_AND_EXERCISE', submenuItem: {type: 'edit_modal'}},
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      } else {
        var subMenuItems = [
          {activityName: 'UPDATE_TEST_AND_EXERCISE', submenuItem: {type: 'edit_modal'}},
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      }
    }
  }

  isUser() {
    if(TestAndExerciseStore?.detailsLoaded){
      for (let i of TestAndExerciseStore?.riskTestEndExercise.workflow_items) {
        if (i.level == TestAndExerciseStore?.riskTestEndExercise?.next_review_user_level) {
          var pos = i.users?.findIndex(e => e.id == AuthStore.user.id)
            if (pos != -1){
              return true;
            }
            else{
              return false
            }
        }
      }
    }
    else{
      return false;
    }
    
  }

  submitTestAndExerciseForReview(){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'submit_test_and_exercise';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  submitAccepted(status){
    if(status){
      this._testAndExercisesWorkflowService.submitTestAndExercise(TestAndExerciseStore.selectedId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getExercise()
        this._utilityService.detectChanges(this._cdr);
      })
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
   }

   modalControl(status: boolean) {
    
    switch (this.popupObject.type) {
      case 'Confirm': this.submitAccepted(status)
        break;
    }
    
  }

  openWorkflowPopup() {
    this._testAndExercisesWorkflowService.getItems(TestAndExerciseStore.selectedId).subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    })
  }

  closeWorkflowPopup() {
    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }

  openHistoryPopup() {
    TestAndExercisesWorkflowStore.setCurrentPage(1);
    this._testAndExercisesWorkflowService.getHistory(TestAndExerciseStore.selectedId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  approveWorkflow(type?) {
    if (type) {
      TestAndExercisesWorkflowStore.type = 'submit';
    }
    else
    TestAndExercisesWorkflowStore.type = 'approve';
    TestAndExercisesWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }
  
  closeCommentForm() {
    this.getExercise();
    TestAndExercisesWorkflowStore.type = '';
    TestAndExercisesWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  
    this._utilityService.detectChanges(this._cdr)
  }
  
  revertWorkflow() {
    TestAndExercisesWorkflowStore.type = 'revert';
    TestAndExercisesWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  getCreatedByPopupDetails(users, created?: string,type:any='') {
    let userDetails: any = {};
    if(type=='user'){
      userDetails['first_name'] = users?.first_name;
      userDetails['last_name'] = users?.last_name;
      userDetails['designation'] = users?.designation;
      userDetails['image_token'] = users?.image?.token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status?.id;
      userDetails['created_at'] = null;
    }
    if(type=='default'){
      userDetails['first_name'] = users?.created_by.first_name;
      userDetails['last_name'] = users?.created_by.last_name;
      userDetails['designation'] = users?.created_by.designation;
      userDetails['image_token'] = users?.created_by.image.token;
      userDetails['email'] = users?.created_by.email;
      userDetails['mobile'] = users?.created_by.mobile;
      userDetails['id'] = users?.created_by.id;
      userDetails['department'] = users?.created_by.department;
      userDetails['status_id'] = users?.created_by.status.id ? users?.created_by.status.id : users?.created_by?.status?.id;
      userDetails['created_at'] = created ? created : null;
    }
    return userDetails;

  }

  openFormModal() {
    this.testObject.type = 'Edit';
    this.testObject.values = TestAndExerciseStore.riskTestEndExercise
    setTimeout(() => {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.formModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.formModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  closeFormModal() {
    this.testObject.type = null;
    this.testObject.values = null;
    setTimeout(() => {
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.formModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.formModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  downloadAuditableItemDocument(type, auditableItem, auditableItemDocument) {

    event.stopPropagation();
    switch (type) {
      case "downloadAuditableItemDocument":
        this._bcmFileService.downloadFile(
          "test-and-exercise",
          auditableItem.id,
          auditableItemDocument.id,
          null,
          auditableItemDocument.name,
          auditableItemDocument
        );
        break;

    }

  }

  viewAuditDocument(type, auditableItem, auditableItemDocument) {
    switch (type) {
      case "viewDocument":
        this._bcmFileService
          .getFilePreview("test-and-exercise", auditableItem.id, auditableItemDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              auditableItem.name
            );
            this.openPreviewModal(type, resp, auditableItemDocument, auditableItem);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;
    }
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  
// Common File Upload Details Page Function Starts Here

openPreviewModal(type, filePreview, documentFiles, document) {
  this.previewObject.component=type


  let previewItem = null;
  if (filePreview) {
    previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.preview_url = previewItem;
    this.previewObject.file_details = documentFiles;
    this.previewObject.componentId = document.id;
    

    this.previewObject.uploaded_user =
    document.updated_by ? document.updated_by : document.created_by;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }
}

*// Closes from preview
  closePreviewModal(event) {
  $(this.filePreviewModal.nativeElement).modal("hide");
  this.previewObject.preview_url = "";
  this.previewObject.uploaded_user = null;
  this.previewObject.created_at = "";
  this.previewObject.file_details = null;
  this.previewObject.componentId = null;
}

downloadDocumentFile(type, document, docs?) {
  event.stopPropagation();
  switch (type) {
    case "test-and-exercise":
      this._bcmFileService.downloadFile(
        type,
        document.test_and_exercise_id,
        document.id,
        null,
        document.title,
        document
      );
      break;
    case "document-version":
      this._documentFileService.downloadFile(
        type,
        document.document_id,
        docs.id,
        null,
        document.title,
        docs
      );
      break;
  }
}

viewDocument(type, documents, documentFile) {
  switch (type) {
    case "test-and-exercise":
      this._bcmFileService
        .getFilePreview(type, documents.test_and_exercise_id, documentFile.id)
        .subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(
            res,
            documents.title
          );
          this.openPreviewModal(type, resp, documentFile, documents);
        }),
        (error) => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage(
              "Error",
              "Permission Denied"
            );
          } else {
            this._utilityService.showErrorMessage(
              "Error",
              "Unable to generate Preview"
            );
          }
        };
      break;

      case "document-version":
        this._documentFileService
          .getFilePreview(type, documents.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;


  }
}


// Returns default image
getDefaultImage(type) {
  return this._imageService.getDefaultImageUrl(type);
}

createPreviewUrl(type, token) {
  return this._imageService.getThumbnailPreview(type, token)
}


// Returns image url according to type and token
createImageUrl(type, token) {
  if(type=='test-and-exercise')
  return this._bcmFileService.getThumbnailPreview(type, token);
  else
  return this._documentFileService.getThumbnailPreview(type, token);

}

// extension check function
checkExtension(ext, extType) {

  return this._imageService.checkFileExtensions(ext, extType)
 
}



createImagePreview(type, token) {
  return this._imageService.getThumbnailPreview(type, token)
}

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
   // BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.exerciseModalSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    TestAndExerciseStore.unsetIndividualTestEndExercise()
    this.testAndExerciseWorkflowHistorySubscription.unsubscribe();
    this.TestAndExercisesWorkflowSubscription.unsubscribe();
    this.TestAndExercisesCommentSuvscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe()
  }

}
