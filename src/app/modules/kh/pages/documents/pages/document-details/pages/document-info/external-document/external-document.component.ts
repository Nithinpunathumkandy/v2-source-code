import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2, ChangeDetectorRef } from '@angular/core';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun, toJS } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { documentWorkFlowStore } from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
import { DocumentContentService } from 'src/app/core/services/knowledge-hub/documents/document-content.service';
import { DocumentNotesService } from 'src/app/core/services/knowledge-hub/documents/document-notes.service';
import { DocumentChecklistService } from 'src/app/core/services/knowledge-hub/documents/document-checklist.service';
import { DocumentWorkflowService } from 'src/app/core/services/knowledge-hub/documents/document-workflow.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { CommentStore } from 'src/app/stores/comment.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;

@Component({
  selector: 'app-external-document',
  templateUrl: './external-document.component.html',
  styleUrls: ['./external-document.component.scss']
})
export class ExternalDocumentComponent implements OnInit {




  // Left Side Details Required Files Starts

  @ViewChild('sideBarRound', { static: true }) sideBarRound: ElementRef;
  @ViewChild('curveToggle') curveToggle: ElementRef;
  @ViewChildren('userSideBar') userSideBar: QueryList<ElementRef>;
  @ViewChild('userRightDetails') userRightDetails: ElementRef;

  // Left Side Details Required Files Ends


  @ViewChild('viewMore', { static: true }) viewMore: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild("supportFileDetailArea", { static: false }) supportFileDetailArea: ElementRef;
  @ViewChild('supportFileViewMorePreviewArea', { static: false }) supportFileViewMorePreviewArea: ElementRef;
  @ViewChild("innerScroll", { static: false }) innerScroll: ElementRef;

  @ViewChild('sectionFormModal', { static: true }) sectionFormModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('notesFormModal') notesFormModal: ElementRef;
  @ViewChild('checkListFormModal') checkListFormModal: ElementRef;
  @ViewChild('commentFormModal') commentFormModal: ElementRef;
  @ViewChild('checkinDocumentPopup') checkinDocumentPopup: ElementRef;
  @ViewChild('activityPopup') activityPopup: ElementRef;
  @ViewChild('reviewHistoryPopup') reviewHistoryPopup: ElementRef;
  @ViewChild('workflowSubmitPopup') workflowSubmitPopup: ElementRef;
  @ViewChild('workflowPopup') workflowPopup: ElementRef;
  @ViewChild('workflowActionPopup') workflowActionPopup: ElementRef;
  @ViewChild('workflowHistoryPopup') workflowHistoryPopup: ElementRef;
  @ViewChild('reviewUpdatePopup') reviewUpdatePopup: ElementRef;
  @ViewChild('documentEditPopup') documentEditPopup: ElementRef;
  @ViewChild('bpmControlListFormModal') bpmControlListFormModal: ElementRef;

  sourceParams: any;
  CheckListParams: any;
  controlModalParam={content_id:null,controls:[]};
  NotesParam: any;
  controlsModalTitle={
    component:'kh_documents'
  }

  // To Handle PDF/Section View

  showPDF: boolean;
  showContent: boolean;
  disableSearch: boolean = true;
  previewUrl: any;

  sideCollapsed: boolean = false;
  viewMoreData: boolean = false;
  view_more_purpose: boolean = false;
  view_more_description: boolean = false;
  showDocumentEditPopup: boolean = false;

  DocumentsStore = DocumentsStore
  SubMenuItemStore = SubMenuItemStore;
  documentWorkFlowStore = documentWorkFlowStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  ContentStore = ContentStore;
  KHSettingStore = KHSettingStore;
  AuthStore = AuthStore
  DocumentWorkflowStore = documentWorkFlowStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  ProcessStore=ProcessStore;
  ControlStore=ControlStore;
  OrganizationLevelSettingsStore=OrganizationLevelSettingsStore;

  modalCloseSubscriptionEvent: any;
  sectionChildAddSubscription: any;
  deleteEventSubscription: any;
  sectionChildDeleteSubscription: any;
  sectionChildEditSubscription: any;
  commonModalEventSubscription: any;
  childNotesEventSubscription: any;
  editChildNoteEventSubscription: any;
  deleteChildNoteEventSubscription: any;
  modalStyleEventSubscription: any;
  addChildCheckListEventSubscription: any;
  deleteChildCheckListEventSubscription: any;
  updatePCDAEventSubscription: any;
  updateCheckListEventSubsciprtion: any;
  addCheckListEvent: any;
  modalTypeSubscription: any;
  checkinFormSubscription: any;
  childCommentBoxSubscription: any;
  commentModalSubscription: any
  workflowSubmitModalSubscription: any;
  workflowUserEditModalSubscription: any;
  workflowHistoryModalSubscription: any;
  commentBoxSubscription: any;
  EditDocumentSubscription: any;
  controlModalEventSubscription:any;
  addChildControlEventSubscription:any;
  deleteChildControlEventSubscription:any;
  activityLogSubscription:any;
  popupControlEventSubscription: any;


  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  submitObject = {
    buttonType: null,
    subtitle: '',
    type: 'Document'
  }

  EditDocumentData = {
    type:'',
    values: null,
  }


  clauseEmptyList = "No Sections Available"



  deleteObject = {
    title: '',
    id: null,
    subtitle: '',
    type: '',
    contentId: null,
    modalType: '',
    itemType: '',
    data: null,
  };

  userDetailObject = {
    title: '',
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null,
    created_at: ''
  }


  constructor(
    private _renderer2: Renderer2,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private documentsService: DocumentsService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _sanitizer: DomSanitizer,
    private _eventEmitterService: EventEmitterService,
    private _documentContentService: DocumentContentService,
    private _documentNoteService: DocumentNotesService,
    private _documentCheckListService: DocumentChecklistService,
    private _documentWorkflowService: DocumentWorkflowService,
    private _documentService: DocumentsService,
    private _route: Router,
    private _controlService: ControlsService,
    private _humanCapitalService: HumanCapitalService,
  ) { }

  ngOnInit(): void {


    this.route.params.subscribe(params => {
      let id: number;
      id = +params['id']; // (+) converts string 'id' to a number
      DocumentsStore.documentId = id;
      setTimeout(() => {
        this.getDocumentDetails();
      }, 300);

    });

    this.reactionDisposer = autorun(() => {
      if(DocumentsStore?.documentDetails?.document_status?.type!='published')
      NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any Sections added here!", subtitle: 'Add Section if there is any. To add, simply tap the button below. ', buttonText: 'Add New Section' });
      if (NoDataItemStore.clikedNoDataItem) {
        this.openSectionForm('Parent')
        NoDataItemStore.unSetClickedNoDataItem();
      }

      if (DocumentsStore.documentDetails && DocumentsStore.documentDetailsLoaded) {
        this.setSubMenuItems();
      }



      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "edit_modal":
          //   this.edit()
          //   break;
          case "close_doc":
            this.getDocumentData()
            break;
          case "download":
            this.downloadDocumentFile('document-version', DocumentsStore.documentDetails, this.findLatestDocument())

            break;

          case "submit":
            this.openSubmitPopup('Submit');
            break;

          case "checkout":
            this.openSubmitPopup('Checkout');
            break;

          case "checkin":
            this.openCheckinForm();
            break;

          case "activity_log":
            this.showActivityPopup()
            break;

          case "review_modal":
            this.showReviewUpdatePopup()
            break;

          case "review_update":
            this.showReviewHistoryPopup()
            break;

          case "edit_mode":
            DocumentsStore.enableButtons = true;
            break;

          case "view_mode":
            DocumentsStore.enableButtons = false;
            break;

          case "workflow":
            this.showWorkflowPopup()
            break

          case "approve":
            this.openWorkflowAction(SubMenuItemStore.clikedSubMenuItem.type)
            break;

          case "revert":
            this.openWorkflowAction(SubMenuItemStore.clikedSubMenuItem.type)
            break;

          case "reject":
            this.openWorkflowAction(SubMenuItemStore.clikedSubMenuItem.type)
            break;

          case "history":
            this.showWorkflowHistory()
            break;

          case "publish_modal":
            this.openPublishPopup();
            break;

          case "edit_modal":
            this.editDocument()
            break;

            case "import":
              ImportItemStore.setTitle('import_document_content');
              ImportItemStore.setImportFlag(true);
              break;

          case "export_to_excel":
              this.documentsService.exportVersionContent(DocumentsStore.documentVersionId)
              break;

          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._documentService.importVersionContent(ImportItemStore.getFileDetails,DocumentsStore.documentVersionId).subscribe(res=>{
          this.getDocumentContentDetails()
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }

    })


    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;



    this.workflowUserEditModalSubscription = this._eventEmitterService.workflowUserAddModal.subscribe(res => {
      this.getDocumentDetails();
    })
    this.workflowHistoryModalSubscription = this._eventEmitterService.historyPopup.subscribe(res => {
      this.closeWorkflowHistory();
    })
    this.sectionChildAddSubscription = this._eventEmitterService.addChildSection.subscribe(res => {
      this.openSectionForm(res.type, res.data)
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup_temp.subscribe(item => {
      this.deleteSectionItems(item);
    })
    this.controlModalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {

      this.closeBPMControlListModal();
      this._utilityService.detectChanges(this._cdr);
    })

    this.sectionChildDeleteSubscription = this._eventEmitterService.deleteChildSection.subscribe(res => {
      this.delete(res.contentId, res.type)
    })

    this.sectionChildEditSubscription = this._eventEmitterService.editTemplate_temp.subscribe(res => {
      this.editSection(res.id)
    })
    this.commentBoxSubscription = this._eventEmitterService.CommentBox.subscribe(res => {
      this.getDocumentDetails();
    })

    this.addChildControlEventSubscription = this._eventEmitterService.addchildControl_temp.subscribe(data => {
      this.openBpmControlForm(data.contentId,data.checklistData)
    })

    this.deleteChildControlEventSubscription = this._eventEmitterService.deleteChildControl_temp.subscribe(data => {
      this.delete(data.controlId, data.type, data.contentId,data.controlData)
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.checkinFormSubscription = this._eventEmitterService.checkinModal.subscribe(res => {
    this.closeCheckinForm()
    // * This is to reload the newly Checked in Document!.
    })

    this.commonModalEventSubscription = this._eventEmitterService.commonModal_temp.subscribe(
      (type: string) => {
        switch (type) {
          case "notes":
            this.closeNotesForm();
            break;
          case "checklist":
            this.closeCheckListForm();
            break;
        }
      }
    );

    this.modalTypeSubscription = this._eventEmitterService.ModalType_temp.subscribe(res => {

      if (res.type == 'save') {
        this.getDocumentContentDetails()
        this.closeSectionForm()
      }
      else if (res.type == 'cancel')
        this.closeSectionForm()
    })

    this.workflowSubmitModalSubscription = this._eventEmitterService.submitPopup.subscribe(res => {
      this.closeSubmitPopup(res)
    })

    this.childNotesEventSubscription = this._eventEmitterService.childNote_temp.subscribe(res => {
      this.openNotesForm(res.contentId)
    })

    this.editChildNoteEventSubscription = this._eventEmitterService.editChildNote_temp.subscribe(res => {
      this.editNotes(res.noteData, res.id)
    })

    this.deleteChildNoteEventSubscription = this._eventEmitterService.deleteChildNote_temp.subscribe(data => {
      this.delete(data.noteId, data.type)
    })

    this.modalStyleEventSubscription = this._eventEmitterService.ModalStyle.subscribe(res => {

      this._renderer2.setStyle(this.checkListFormModal.nativeElement, 'z-index', '999999');
      this._renderer2.setStyle(this.checkListFormModal.nativeElement, 'overflow', 'auto');
    })

    this.addChildCheckListEventSubscription = this._eventEmitterService.addchildCheckList_temp.subscribe(data => {
      this.openCheckListForm(data.contentId, data.checklistData)
    })

    this.deleteChildCheckListEventSubscription = this._eventEmitterService.deleteChildCheckList_temp.subscribe(data => {
      this.delete(data.checkListId, data.type, data.contentId, data.checklistData)
    })
    this.updatePCDAEventSubscription = this._eventEmitterService.passPCDA_temp.subscribe(data => {
      this.updatePCDA(data.status, data.type, data.contentId)
    })
    this.updateCheckListEventSubsciprtion = this._eventEmitterService.passCheckList_temp.subscribe(data => {
      this.updateCheckList(data.contentId, data.checkListStatus)
    })

    this.addCheckListEvent = this._eventEmitterService.addCheckListModal_temp.subscribe(res => {
      this.closeCheckListForm();
    })

    this.childCommentBoxSubscription = this._eventEmitterService.openKHCommentBox.subscribe(res => {
      this.openComment(res)
    })

    this.commentModalSubscription = this._eventEmitterService.commentModal.subscribe(res => {
      this.closeWorkflowAction();
      this.getHistory()
    })

    this.EditDocumentSubscription = this._eventEmitterService.editDocumentModal.subscribe(documentId => {

      setTimeout(() => {
        this.getDocumentDetails();
      }, 150);
      this.closeDocumentEditPopup()
    })

    this.activityLogSubscription=this._eventEmitterService.workflowActivityLog.subscribe(res=>{
      this.closeActivityPopup()
    })

    this.getHistory()

    this.selectedTab('picture')

  }

  // Required  Data Fetching Starts Here

  // Getting Document Details and Setting Submenu Items and Enabling/Disabling Buttons



  getDocumentDetails() {

    this._documentService.getItemById(DocumentsStore.documentId).subscribe(res => {
      if (res) {
        res.versions.forEach(version => {
          if (version.is_latest) {
            DocumentsStore.documentVersionId = version.id
            DocumentsStore.versionNumber = version.version
            this.getDocumentContentDetails()
            this.getDocumentPreview(version.title)
          } else
            DocumentsStore.documentVersionId = version.id
        })
        this.checkButtonPermissions();


      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDocumentContentDetails() {
    this._documentContentService.getAllItems().subscribe(res => {
      this.calculateClauseNumber(res, 'Parent')
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getHistory() {
    this._documentWorkflowService.getWorkflowHistory().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  // Required  Data Fetching Ends Here


  // Button Permission Check Starts

  checkButtonPermissions() {
    if (DocumentsStore.documentDetails?.document_status?.type == 'in-review') {
      this._documentWorkflowService.getWorkflow(DocumentsStore.documentId).subscribe(res => {
        if (res) {
          this.setSubMenuItems();
          DocumentsStore.enableButtons = this.isUser()
          DocumentsStore.enableChecklistPopup= this.isUser();
          DocumentsStore.enableWorkflow = this.isUser()
          this._utilityService.detectChanges(this._cdr);
        }

      })
    } else if (DocumentsStore.documentDetails?.document_status?.type == 'draft') {
      this._documentWorkflowService.getWorkflow(DocumentsStore.documentId).subscribe(res => {
        if (res)
          this.setSubMenuItems();
        {
          DocumentsStore.enableButtons = this.draftUserCheck()
          DocumentsStore.enableChecklistPopup=this.draftUserCheck();
          DocumentsStore.enableWorkflow = false
          this._utilityService.detectChanges(this._cdr);
        }

      })
    }
    else {
      this.setSubMenuItems();
      DocumentsStore.enableButtons = false;
      DocumentsStore.enableChecklistPopup=this.draftUserCheck();
      DocumentsStore.enableWorkflow = false
      this._utilityService.detectChanges(this._cdr);
    }
    this._utilityService.detectChanges(this._cdr);
  }

  draftUserCheck() {
    if (DocumentsStore.documentDetails?.created_by?.id == AuthStore.user.id) {
      return true
    } else {
      return false
    }
  }

  isUser() {
    if (documentWorkFlowStore?.documentWorkflow_loaded) {
      for (let i of documentWorkFlowStore?.documentWorkflow) {
        if (i.level == DocumentsStore?.documentDetails?.next_review_user_level) {
          var pos = i.document_workflow_item_users.findIndex(e => e.id == AuthStore?.user?.id)
          var status = i.document_workflow_item_users.findIndex(e => e.status?.id == 1)
          if (pos != -1 && status != -1)
            return true;
          else
            return false
        }
      }
    }
    else {
      return false;
    }

  }


  // Button Permisson Check Ends

  setSubMenuItems(){

    if(DocumentsStore.documentDetailsLoaded && DocumentsStore.documentDetails){

      // Setting Default Submenu Items

      let subMenuItems = [
        { activityName: 'DOCUMENT_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
        { activityName: 'EXPORT_DOCUMENT', submenuItem: { type: "export_to_excel" } },
        {activityName: null, submenuItem: {type: 'import'}},
        // { activityName: 'DOCUMENT_FREQUENT_REVIEW_UPDATE_LIST', submenuItem: { type: 'review_update' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]


      // When Submitted by field is null i.e , document is in draft stage  enabling edit modal for createdbu user


      if(DocumentsStore.documentDetails.created_by.id==AuthStore?.user?.id && !DocumentsStore.documentDetails.submitted_by)
        subMenuItems.push(
                 { activityName: null, submenuItem: { type: 'edit_modal' } },

        )

          // When Workflow Items field is null i.e , document is in draft stage  enabling publish button

        if(DocumentsStore.documentDetails.workflow_items?.length == 0 && !DocumentsStore.documentDetails.submitted_by && DocumentsStore.documentDetails?.document_status?.type != 'published')
        subMenuItems.push(
                 { activityName: null, submenuItem: { type: 'publish_modal' } },
        )


      // When the status is Draft | Reverted.

      if(DocumentsStore.documentDetails?.document_status?.type=='draft' ||DocumentsStore.documentDetails?.document_status?.type=='reverted'){
        if (DocumentsStore.documentDetails?.is_workflow &&  DocumentsStore.documentDetails?.workflow_items.length > 0) {


          // Checking if createdby User and loggined user are same.

          if(DocumentsStore.documentDetails.created_by.id==AuthStore?.user?.id){



            if(DocumentsStore.documentDetails?.is_locked)
            {
              subMenuItems.push(
                { activityName: null, submenuItem: { type: 'history' } },
                { activityName: null, submenuItem: { type: 'workflow' } },
                 { activityName: null, submenuItem: { type: 'checkin' } },
                 { activityName: 'PREVIEW_DOCUMENT_VERSION_DOCUMENT_FILE', submenuItem: { type: 'download' } },
               )
            }
            else
            {
              subMenuItems.push(
                { activityName: null, submenuItem: { type: 'history' } },
                { activityName: null, submenuItem: { type: 'workflow' } },
                 { activityName: null, submenuItem: { type: 'checkout' } },
                 { activityName: 'SUBMIT_DOCUMENT', submenuItem: { type: 'submit' } },
                //  { activityName: null, submenuItem: { type: 'edit_modal' } },
                 { activityName: 'PREVIEW_DOCUMENT_VERSION_DOCUMENT_FILE', submenuItem: { type: 'download' } },
               )
            }


          }

    
           }         

          //  else if(DocumentsStore.documentDetails?.workflow_items?.length == 0){
          //   let subMenuItems = [
          //     { activityName: null, submenuItem: { type: 'publish_modal' } },
          //     { activityName: null, submenuItem: { type: 'close', path: '../' } },
          //   ]
      
          //   this._helperService.checkSubMenuItemPermissions(700, subMenuItems);
          // }
          
      }


      // When the status is In-Review

      if (this.isUser() && DocumentsStore.documentDetails?.document_status?.type == "in-review") {
        subMenuItems.push(
          // { activityName: null, submenuItem: { type: 'review' } },
          { activityName: null, submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'workflow' } },
          // { activityName: null, submenuItem: { type: 'edit_modal' } },
          { activityName: 'PREVIEW_DOCUMENT_VERSION_DOCUMENT_FILE', submenuItem: { type: 'download' } },
        )
        if(DocumentsStore?.documentDetails?.locked_by?.id == AuthStore?.user?.id)
        {
          subMenuItems.push(
            { activityName: null, submenuItem: { type: 'checkin' } },
          )
        }
      else{
        subMenuItems.push(
          { activityName: null, submenuItem: { type: 'checkout' } },
          { activityName: null, submenuItem: { type: 'approve' } },
          { activityName: null, submenuItem: { type: 'revert' } },
          { activityName: null, submenuItem: { type: 'reject' } },
          { activityName: 'PREVIEW_DOCUMENT_VERSION_DOCUMENT_FILE', submenuItem: { type: 'download' } },
        )
      }
        
      }


      
      // When the status is Published

      if (DocumentsStore.documentDetails?.document_status?.type == 'published') {
      
        if(DocumentsStore.documentDetails?.is_workflow &&  DocumentsStore.documentDetails?.workflow_items.length > 0){
          subMenuItems.push(
            { activityName: null, submenuItem: { type: 'history' } },
            { activityName: null, submenuItem: { type: 'workflow' } },
            { activityName: 'PREVIEW_DOCUMENT_VERSION_DOCUMENT_FILE', submenuItem: { type: 'download' } },
          )
        }

      }


      this._helperService.checkSubMenuItemPermissions(700, subMenuItems);

      
      // When the status is Approved

      if (DocumentsStore.documentDetails?.document_status?.type == 'approved') {
      
        if(DocumentsStore.documentDetails?.is_workflow &&  DocumentsStore.documentDetails?.workflow_items.length > 0){
          subMenuItems.push(
            { activityName: null, submenuItem: { type: 'publish_modal' } },
            { activityName: null, submenuItem: { type: 'history' } },
            { activityName: null, submenuItem: { type: 'workflow' } },
            { activityName: 'PREVIEW_DOCUMENT_VERSION_DOCUMENT_FILE', submenuItem: { type: 'download' } },
          )
        }

      }


      this._helperService.checkSubMenuItemPermissions(700, subMenuItems);

    }
   

  }

 


  // Setting Breadcrumb Status on exiting from Document Details Page

  getDocumentData() {
    DocumentsStore.breadCrumbStatus = false;
    this._route.navigateByUrl("/knowledge-hub/documents");
  }




  // Required Forms and Modals Starts

  // Section Form Starts Here

  // Accepted Params ( type - Child/Parent , data - Data which is used to calculate/automate Section/Clause Number.)


  openComment(contentId: number) {

    AppStore.openCommentBox();
    CommentStore.module = "KH"
    CommentStore.commentGetApi = '/document-versions/' + `${DocumentsStore.documentVersionId}` + `/contents/` + contentId
    CommentStore.commentApi = `/document-version-contents/${contentId}`;
    CommentStore.commentObjectVariable = 'document_version_content_comment_id';
    this._utilityService.detectChanges(this._cdr);
  }

  openSectionForm(type, data?) {

    if (type == 'Parent') {
      this.sourceParams = {
        documentVersionContentId: null,
      }
    }
    else {

      // To Calculate/Automate section/clause number
      this.calculateClauseNumber(data, type)
      // Case Where Children Inside Document Content
      if (data.children && data.children.length > 0) {
        this.sourceParams = {
          documentVersionContentId: data.id,
          order: data.children.length + 1,
          children: true,
        }
      }
      else {
        // Case Where only Document Content
        this.sourceParams = {
          documentVersionContentId: data.id,
          children: false,
        }
      }

    }

    this.openFormModal();

  }



  // Section Form Ends Here
  // Notes Form
  openNotesForm(contentId) {
    this.NotesParam = {
      content_id: contentId,
    }
    this._utilityService.detectChanges(this._cdr)
    $(this.notesFormModal.nativeElement).modal('show');
  }

  closeNotesForm() {
    this.NotesParam = null;
    ContentStore.clearNotes();
    $(this.notesFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }

  // Checlist Form
  openCheckListForm(contentId, data?) {
    this.CheckListParams = {
      content_id: contentId,
      data: data
    }
    this._utilityService.detectChanges(this._cdr)
    $(this.checkListFormModal.nativeElement).modal('show');

  }

  closeCheckListForm() {
    this.CheckListParams = null;
    $(this.checkListFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }

  openBpmControlForm(id,controls)
  { 
    ControlStore.unSelectControls();
    this.controlModalParam.content_id=id;
    this.controlModalParam.controls=controls;
    if(controls?.length)
    {
      this._controlService.selectRequiredControls(controls);
    }
    ProcessStore.add_control_form_modal = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.bpmControlListFormModal.nativeElement).modal('show');
    
  }

  closeBPMControlListModal() {
    ProcessStore.add_control_form_modal = false;
    $(this.bpmControlListFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
    if(ControlStore.selectedControlsList.length && this.controlModalParam.content_id)
    {
      if(JSON.stringify(this.controlModalParam.controls) != JSON.stringify(ControlStore.selectedControlsList))
      this.saveDocumentControls();
    }
    
  }

  saveDocumentControls()
  {
    this._documentService.saveDocumentControl(this.getSaveData()).subscribe(res => {
      this.controlModalParam.content_id=null;
      this.getDocumentDetails();
      this._utilityService.detectChanges(this._cdr);
    })
    this.controlModalParam.content_id=null;
  }

  getSaveData()
  {
    const payload={
      document_version_id:DocumentsStore.documentVersionId,
      content_id:this.controlModalParam.content_id,
      control_ids:this.getItemById(ControlStore.selectedControlsList)
    }
    return payload;

  }

  getItemById(data)
  {
    let item=[];
    for(let i of data)
    {
      item.push(i.id);
    }
    return item;
  }



  // Form Modal for Edit/Add
  openFormModal() {
    this._utilityService.detectChanges(this._cdr)
    $(this.sectionFormModal.nativeElement).modal('show');
  }

  closeSectionForm() {
    this.sourceParams = null;
    $(this.sectionFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)

  }

  openSubmitPopup(type) {
    if (type == 'Submit') {
      this.submitObject.buttonType = type;
      this.submitObject.subtitle = "It will send document for the review"
    }
    else {
      this.submitObject.buttonType = type;
      this.submitObject.subtitle = "Are you sure you want to Checkout?"
    }

    documentWorkFlowStore.submitPopup = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.workflowSubmitPopup.nativeElement).modal('show');
  }
  closeSubmitPopup(res) {
    setTimeout(() => {
      if(res=='save' && this.submitObject.buttonType =='Checkout')
      this.downloadDocumentFile('document-version', DocumentsStore.documentDetails, this.findLatestDocument())
      this.getDocumentDetails();
    }, 500);
    documentWorkFlowStore.submitPopup = false;
    AppStore.loading = false;
    $(this.workflowSubmitPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }


  openCheckinForm() {
    documentWorkFlowStore.checkinForm = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.checkinDocumentPopup.nativeElement).modal('show');
  }

  closeCheckinForm() {
    setTimeout(() => {
      this.getDocumentDetails();
    }, 150);
    documentWorkFlowStore.checkinForm = false;
    $(this.checkinDocumentPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }

  showActivityPopup() {
    documentWorkFlowStore.showActivity = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.activityPopup.nativeElement).modal('show');
  }

  closeActivityPopup() {
    documentWorkFlowStore.showActivity = false;
    $(this.activityPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }

  showReviewUpdatePopup() {
    documentWorkFlowStore.showReviewUpdatePopup = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.reviewUpdatePopup.nativeElement).modal('show');
  }

  closeReviewUpdatePopup() {
    documentWorkFlowStore.showReviewUpdatePopup = false;
    $(this.reviewUpdatePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }
  showWorkflowHistory() {
    documentWorkFlowStore.showHistory = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.workflowHistoryPopup.nativeElement).modal('show');

  }
  closeWorkflowHistory() {
    documentWorkFlowStore.showHistory = false;
    $(this.workflowHistoryPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }

  showReviewHistoryPopup() {
    documentWorkFlowStore.showHistoryPopup = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.reviewHistoryPopup.nativeElement).modal('show');
  }

  closeReviewHistoryPopup() {
    documentWorkFlowStore.showHistoryPopup = false;
    $(this.reviewHistoryPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }


  showWorkflowPopup() {
    documentWorkFlowStore.showWorkflowPopup = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.workflowPopup.nativeElement).modal('show');
  }

  closeWorkflowPopup() {
    setTimeout(() => {

    }, 500);
    documentWorkFlowStore.showWorkflowPopup = false;
    $(this.workflowPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }

  openWorkflowAction(type) {
    documentWorkFlowStore.type = type
    documentWorkFlowStore.workflowActionPopup = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.workflowActionPopup.nativeElement).modal('show');
  }

  closeWorkflowAction() {
    setTimeout(() => {
      this.getDocumentDetails();
    }, 500);
    documentWorkFlowStore.workflowActionPopup = false;
    $(this.workflowActionPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }


  // Required Forms and Modals Ends

  // Required Functions Starts Here



  delete(id: number, type, contentId?, data?) {

    switch (type) {
      case "notes":
        this.deleteObject.title = 'Delete Note?';
        this.deleteObject.itemType = 'Note';
        this.deleteObject.subtitle = 'It will delete the note from documents';
        break;

      case "Content":
        this.deleteObject.title = 'Delete Content?';
        this.deleteObject.itemType = 'Content';
        this.deleteObject.subtitle = 'It will delete the content from documents';
        break;
      case "CheckList":
        this.deleteObject.title = 'Delete CheckList?';
        this.deleteObject.itemType = 'CheckList';
        this.deleteObject.subtitle = 'It will delete the checklist from documents';
        this.deleteObject.contentId = contentId;
        this.deleteObject.data = data;
        break;
      case "Controls":
        this.deleteObject.title = 'Delete Control?';
        this.deleteObject.itemType = 'Controls';
        this.deleteObject.subtitle = 'It will delete the control from documents';
        this.deleteObject.contentId = contentId;
        this.deleteObject.data = data;
        break;
      default:
        break;
    }

    this.deleteObject.id = id;


    $(this.deletePopup.nativeElement).modal('show');

  }

  deleteSectionItems(status) {
console.log(status);
    switch (this.deleteObject.itemType) {
      case 'Content':
        if (status && this.deleteObject.id) {
          this._documentContentService.delete(this.deleteObject.id).subscribe(resp => {
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            this.clearDeleteObject();
          });

        }
        else {
          this.clearDeleteObject();
        }
        setTimeout(() => {
          $(this.deletePopup.nativeElement).modal('hide');
          this._utilityService.detectChanges(this._cdr);
        }, 250);
        break;

      case 'Note':
        if (status && this.deleteObject.id) {
          this._documentNoteService.delete(this.deleteObject.id).subscribe(resp => {
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            this.clearDeleteObject();
          });
        }
        else {
          this.clearDeleteObject();
        }
        setTimeout(() => {
          $(this.deletePopup.nativeElement).modal('hide');
        }, 250);

        break;

      case 'CheckList':
        if (status && this.deleteObject.id) {
          // Removing from the checklist Array in store.
          var index = ContentStore.checklistToDisplay.indexOf(this.deleteObject.data);
          ContentStore.checklistToDisplay.splice(index, 1);
          this._documentCheckListService.delete(this.deleteObject.contentId, this.deleteObject.id).subscribe(resp => {
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            this.clearDeleteObject();
          });


        }
        else {
          this.clearDeleteObject();
        }
        setTimeout(() => {
          $(this.deletePopup.nativeElement).modal('hide');
        }, 250);

        break;
        case 'Controls':
          if (status && this.deleteObject.id) {
              this._documentService.deleteDocumentControl(this.deleteObject.contentId, this.deleteObject.id).subscribe(resp => {
                setTimeout(() => {
                  this.getDocumentDetails();
                  this._utilityService.detectChanges(this._cdr);
                }, 100);
                this.clearDeleteObject();
              });
            
       
          }
          else {
            this.clearDeleteObject();
          }
          setTimeout(() => {
            $(this.deletePopup.nativeElement).modal('hide');
          }, 250);
      break;

      default:
        break;
    }



  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.title = '';
    this.deleteObject.subtitle = '';
    this.deleteObject.type = '';
    this.deleteObject.contentId = null

  }

  calculateClauseNumber(data, type) {

    ContentStore.editCheck = false;

    if (type == 'Parent') {
      let clauseNumber = data.length
      ContentStore.clause_number = clauseNumber
    }
    else {

      if (data.children) {

        let childData = data.children
        let totalLength = childData.length + 1
        let nextClauseNumber
        if (data.clause_number == 0)
          nextClauseNumber = 0 + '.' + totalLength
        else
          nextClauseNumber = data.clause_number + '.' + totalLength
        ContentStore.clause_number = nextClauseNumber

      }
      else if (data.children_content) {
        let childData = data.children_content
        let totalLength = childData.length + 1

        let nextClauseNumber
        if (data.clause_number == 0)
          nextClauseNumber = 0 + '.' + totalLength
        else
          nextClauseNumber = data.clause_number + '.' + totalLength
        ContentStore.clause_number = nextClauseNumber
      }
    }

  }

  findLatestDocument() {
    let data = DocumentsStore.documentDetails.versions
    for (let i = 0; i < data.length; i++) {
      if (data[i].is_latest == 1)
        return data[i]
      break;
    }
  }


  updateCheckList(contentId, checkListStatus) {

    if (checkListStatus) {
      this._documentCheckListService.deactivateCheckList(contentId).subscribe(res =>
        this._utilityService.detectChanges(this._cdr))
    } else {
      this._documentCheckListService.activateCheckList(contentId).subscribe(res =>
        this._utilityService.detectChanges(this._cdr))
    }


  }

  editSection(sectionId) {
    ContentStore.editCheck = true;
    this._documentContentService.getItemById(sectionId).subscribe(res => {
      let editData = res;
      this.sourceParams = {
        id: editData['id'],
        clause_number: editData['clause_number'],
        title: editData["title"],
        description: editData['description'],
        is_act: editData['is_act'],
        is_check: editData['is_check'],
        is_checklist_applicable: editData['is_checklist_applicable'],
        is_do: editData['is_do'],
        is_plan: editData['is_plan'],
        order: editData['order'],
        checklist: editData['checklists'],
        notes: editData['notes'],
        documentVersionContentId: editData['parent_content'] ? editData['parent_content'].id : null,
      }
      this.openFormModal();
    })

  }



  editNotes(noteData, contentId) {


    this.NotesParam = {
      id: noteData.id,
      notes: noteData.title,
      content_id: contentId,
      document_version_id: DocumentsStore.documentVersionId
    }


    this._utilityService.detectChanges(this._cdr)
    $(this.notesFormModal.nativeElement).modal('show');
    // this.openNotesForm(contentId)
  }

  updatePCDA(status, type, contentId) {
    if (status == true) {
      this._documentContentService.deactivatePCDA(contentId, type).subscribe(res => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      });
    } else {
      this._documentContentService.activatePCDA(contentId, type).subscribe(res => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      });
    }
  }

  setClass(dataId) {

    this.scrollbyIndex(dataId)

    if (DocumentsStore.dataId == dataId) {
      DocumentsStore.dataId == null
    }
    else
      DocumentsStore.dataId = dataId
    this._utilityService.detectChanges(this._cdr)

  }

  scrollbyIndex(index) {

    document.getElementById(index).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  setStatusColor() {

    var className = 'status-tag-new-two'

    switch (DocumentsStore.documentDetails?.document_status?.type) {
      case 'draft':
        className = className + ' ' + 'bg-grey'
        break;
      case 'in-review':
        className = className + ' ' + 'bg-light-blue'
        break;
      case 'published':
        className = className + ' ' + 'bg-green'
        break;
      case 'reverted':
        className = className + ' ' + 'bg-orange'
        break;
      case 'rejected':
        className = className + ' ' + 'bg-red'
        break;
      case 'archived':
        className = className + ' ' + 'bg-yellow'
        break;

      default:
        break;
    }

    return className

  }

  // Required Functions Ends Here



  getDocumentPreview(documentTitle) {
    this._documentFileService.getFilePreview('document-version', DocumentsStore.documentId, DocumentsStore.documentVersionId).subscribe((res) => {
      var resp: any = this._utilityService.getDownLoadLink(
        res,
        documentTitle
      );
      this.setFilePreview(resp);
    })
  }

  setFilePreview(filePreview) {
    let previewItem = null;
    previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewUrl = previewItem
    this._utilityService.detectChanges(this._cdr)
  }


  selectedTab(type) {
    
    if (type == 'picture') {
      this.showPDF = true;
      this.showContent = false
      this.disableSearch = true;
      this.unCollapseSide();
    }

    else {
      this.collapseSide(true)
      this.showContent = true;
      this.showPDF = false;
      this.disableSearch = false;

        setTimeout(() => {
          $(this.innerScroll?.nativeElement).mCustomScrollbar();
        }, 300);
    }

  }


  generateToPDF(){
      this._documentService.generateToPDF().subscribe(res=>{
        this.getDocumentDetails()
      })
  }

  tabListUlClick(ev) {
    if ((ev.target.tagName == 'A') && (ev.target.classList.contains('full-screen-click')))
      this.collapseSide();
    else if ((ev.target.tagName == 'A') && (ev.target.classList.contains('nav-link-show')))
      this.unCollapseSide();
  }

  collapseSide(disableSideBarRound?: boolean) {
    if (!this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      setTimeout(() => {
        this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
        this._renderer2.addClass(this.userRightDetails.nativeElement, 'flex-98-width');
      }, 150);
      if (!disableSideBarRound) {
        this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'block');
        this._renderer2.addClass(this.sideBarRound.nativeElement, 'tActive');
        this._renderer2.setStyle(this.sideBarRound.nativeElement, 'position', 'fixed');
        this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index', '99999');
      }

      this.sideCollapsed = true;
    } else if (this.sideCollapsed && disableSideBarRound) {
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'none');
      this._renderer2.removeClass(this.sideBarRound.nativeElement, 'tActive');
    }
  }

  unCollapseSide() {
    if (this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.removeClass(this.userRightDetails.nativeElement, 'flex-98-width');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'none');
      this._renderer2.removeClass(this.sideBarRound.nativeElement, 'tActive');

      this.sideCollapsed = false;
    }
  }


  checkExtension(ext, extType, data?) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  //Returns default image, if no image is present
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(type, token, h?, w?) {
    return this._documentFileService.getThumbnailPreview(type, token, h, w);

  }

  getProfilePicture(token){
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }
  openViewMore() {

    $(this.viewMore.nativeElement).modal('show');
    setTimeout(() => {
      // this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);

  }



  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component = type


    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;


      this.previewObject.uploaded_user = DocumentsStore.documentDetails.created_by;
      this.previewObject.created_at = document.created_at;

      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Closes from preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

  downloadDocumentFile(type, document, docs?) {
    switch (type) {
      case "document-file":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          document.id,
          null,
          document.title,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          docs.document_id,
          docs.id,
          null,
          document.title,
          document
        );
        break;
    }
  }

  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "document-file":
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

      case "document-version":
        this._documentFileService
          .getFilePreview(type, documents.related_document_id, documentFile.id)
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


  edit() {
    this.documentsService.getItemById(DocumentsStore.documentId).subscribe(res => {
      this._route.navigateByUrl('/knowledge-hub/documents/edit-document');
    })
  }


  // To Download All Documents
  downloadAll(type, docId?, docFileId?) {
    switch (type) {
      case "document-version-all":
        this._documentFileService.downloadFile(
          type,
          docId,
          null,
        );
        break;
      case "document-file-all":
        this._documentFileService.downloadFile(
          type,
          docId,
          null,
        );
        break;
    }
  }





  getArrayFormatedString(items) {
    return this._helperService.getArraySeperatedString(',', 'title', items);
  }

  getStringData(p) {
    var stringContent = p.substring(0, 350);
    return stringContent;
  }

  viewData(operation, type) {

    switch (type) {
      case 'description':
        this.view_more_purpose = false;
        if (operation == 'more')
          this.view_more_description = true;
        else
          this.view_more_description = false;

        break;
      case 'purpose':
        this.view_more_description = false;
        if (operation == 'more')
          this.view_more_purpose = true;
        else
          this.view_more_purpose = false;

        break;
      case 'view_more':
        this.view_more_description = false;
        this.view_more_purpose = false;
        if (operation == 'more') {
          this.openViewMore();
        }
        break;

      default:
        break;
    }



    this._utilityService.detectChanges(this._cdr);
  }
  //*  Set User Preview Data
  assignUserValues(user) {
    this.userDetailObject.first_name = user?.first_name;
    this.userDetailObject.last_name = user?.last_name;
    this.userDetailObject.designation = user?.designation ? user?.designation : '';
    this.userDetailObject.image_token = user.image ? user.image?.token : null;
    this.userDetailObject.email = user?.email;
    this.userDetailObject.mobile = user?.mobile;
    this.userDetailObject.id = user?.id;
    this.userDetailObject.status_id = user?.status?.id
    this.userDetailObject.department = user?.department ? user?.department : null

    return this.userDetailObject;

  }

  getPopupDetails(type, details?) {
    if (type == "workflow") {
      this.userDetailObject.id = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length - 1]?.created_by;
      this.userDetailObject.first_name = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length - 1]?.reviewed_user_first_name;
      this.userDetailObject.last_name = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length - 1]?.reviewed_user_last_name;
      this.userDetailObject.designation = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length - 1]?.reviewed_user_designation;
      this.userDetailObject.image_token = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length - 1]?.reviewed_user_image_token;
      this.userDetailObject.email = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length - 1]?.reviewed_user_email;
      this.userDetailObject.mobile = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length - 1]?.reviewed_user_mobile;
      this.userDetailObject.department = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length - 1]?.reviewed_user_department;
    } else {
      this.userDetailObject.id = details?.id;
      this.userDetailObject.first_name = details?.created_by?.first_name;
      this.userDetailObject.last_name = details?.created_by?.last_name;
      this.userDetailObject.designation = details?.created_by?.designation;
      this.userDetailObject.image_token = details?.created_by?.image?.token;
      this.userDetailObject.email = details?.created_by?.email;
      this.userDetailObject.mobile = details?.created_by?.mobile;
      this.userDetailObject.department = details?.department ? details?.created_by_department : null;
      this.userDetailObject.created_at = details?.created_at;
    }

    return this.userDetailObject;
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }



  checkForSupportFileDetailsArea() {
    if (DocumentsStore?.documentDetails?.files.length >= 2) {
      $(this.supportFileDetailArea?.nativeElement).mCustomScrollbar();
    }
    else {
      if (DocumentsStore?.documentDetails?.files.length > 0)
        $(this.supportFileDetailArea?.nativeElement).mCustomScrollbar("destroy");
    }
    this._utilityService.detectChanges(this._cdr)
  }

  // *Common  File Upload/Attach Modal Functions Starts Here

  enableScrollbar() {
    if (DocumentsStore?.documentDetails?.files?.length >= 3) {
      $(this.supportFileViewMorePreviewArea.nativeElement).mCustomScrollbar();
    }
    else {
      if (DocumentsStore?.documentDetails?.files?.length > 0)
        $(this.supportFileViewMorePreviewArea.nativeElement).mCustomScrollbar("destroy");
    }
  }


  // Edit Document with Limited Data

  editDocument() {
    this._route.navigateByUrl("/knowledge-hub/documents/edit-document");
    // this.EditDocumentData.type='Edit'
    // var MasterDocumentDetails = DocumentsStore.documentDetails
    // this.EditDocumentData.values = {
    //   id: MasterDocumentDetails.id,
    //   description: MasterDocumentDetails.description ? MasterDocumentDetails.description : '',
    //   purpose: MasterDocumentDetails.purpose ? MasterDocumentDetails.purpose : '',
    //   title: MasterDocumentDetails.title ? MasterDocumentDetails.title : '',
    //   document_review_frequency_id: MasterDocumentDetails.document_review_frequency ? MasterDocumentDetails.document_review_frequency : '',
    //   review_user_id: MasterDocumentDetails?.review_user ? MasterDocumentDetails.review_user.id : '',
    //   issue_date: MasterDocumentDetails?.issue_date ? MasterDocumentDetails?.issue_date : '',
    //   owner:MasterDocumentDetails?.owner?MasterDocumentDetails.owner:AuthStore.user,
    //   document_division_ids:MasterDocumentDetails?.document_divisions?MasterDocumentDetails.document_divisions:[],
    //   document_organization_ids:MasterDocumentDetails?.document_organizations?MasterDocumentDetails.document_organizations:[],
    //   document_section_ids:MasterDocumentDetails?.document_sections?MasterDocumentDetails.document_sections:[],
    //   document_sub_section_ids:MasterDocumentDetails?.document_sub_sections?MasterDocumentDetails.document_sub_sections:[],
    //   document_department_ids:MasterDocumentDetails?.document_departments?MasterDocumentDetails.document_departments:[]
    // }

    // if (MasterDocumentDetails.versions.length > 0) {
    //   for (let documents of MasterDocumentDetails.versions) {
    //     if (documents.is_latest) {
    //       let purl = this._documentFileService.getThumbnailPreview('document-version', documents.token)
    //       let documentVersionFileDetails = {
    //         name: documents.title,
    //         ext: documents.ext,
    //         size: documents.size,
    //         url: documents.url,
    //         thumbnail_url: documents.url,
    //         token: documents.token,
    //         preview: purl,
    //         id: documents.id
    //       };
    //       this._documentService.setVersionFile(documentVersionFileDetails, purl);
    //     }
    //   }
    // }
    // this.openDocumentEditPopup();
    // this._utilityService.detectChanges(this._cdr);

  }

  openDocumentEditPopup() {
    this.showDocumentEditPopup = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.documentEditPopup.nativeElement).modal('show');
  }

  closeDocumentEditPopup() {
    this.showDocumentEditPopup = false;
    $(this.documentEditPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }
  

  getEmployeePopupDetails(users, created?: string) { //user popup

    let userDetails: any = {};
    if (users) {
      userDetails['first_name'] = users?.first_name ? users?.first_name : users?.name;
      userDetails['last_name'] = users?.last_name;
      userDetails['image_token'] = users?.image?.token ? users?.image.token : users?.image_token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status_id ? users?.status_id : users?.status.id;
      userDetails['created_at'] = created ? created : null;
      userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    }
    return userDetails;
  }
  // Edit Document Ends Here

  changeDocumentVersion(documentVersionDetails){

    if(AuthStore?.user?.designation?.is_super_admin)
{
  this.documentsService.changeDocumentVersion(documentVersionDetails.document_id,documentVersionDetails.id).subscribe(res=>{
    this.getDocumentDetails()
  })
}


  }

  openPublishPopup()
  {
    this.deleteObject.id = DocumentsStore.documentId
    this.deleteObject.type = 'Publish';
    this.deleteObject.title='Publish';
    this.deleteObject.subtitle = 'it_will_publish_the_document';

    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  modalControl(status: boolean) {

    switch (this.deleteObject.title) {
    
      case 'Publish': this.publish(status);
        break;
    }
  }

  publish(status){

    if (status && this.deleteObject.id) {
      DocumentsStore.documentDetailsLoaded=false;
      // SubMenuItemStore.cancelClicked = true;
      this._documentService.publishDocument(this.deleteObject.id).subscribe(res=>{
        this.getDocumentDetails();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        
        }, 500);
        this.clearPopupObject();
        });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  
  }

  clearPopupObject() {
    this.deleteObject.id = null;
  }

  ngOnDestroy() {

    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;

    this.sectionChildAddSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.sectionChildDeleteSubscription.unsubscribe();
    this.sectionChildEditSubscription.unsubscribe();
    this.commonModalEventSubscription.unsubscribe();
    this.childNotesEventSubscription.unsubscribe();
    this.editChildNoteEventSubscription.unsubscribe();
    this.deleteChildNoteEventSubscription.unsubscribe();
    this.modalStyleEventSubscription.unsubscribe();
    this.addChildCheckListEventSubscription.unsubscribe();
    this.deleteChildCheckListEventSubscription.unsubscribe();
    this.childCommentBoxSubscription.unsubscribe();
    this.commentModalSubscription.unsubscribe()
    this.commentBoxSubscription.unsubscribe();
    this.updatePCDAEventSubscription.unsubscribe();
    this.updateCheckListEventSubsciprtion.unsubscribe();
    this.addCheckListEvent.unsubscribe();
    this.modalTypeSubscription.unsubscribe();
    this.checkinFormSubscription.unsubscribe();
    this.workflowSubmitModalSubscription.unsubscribe();
    this.workflowUserEditModalSubscription.unsubscribe();
    this.workflowHistoryModalSubscription.unsubscribe();
    this.EditDocumentSubscription.unsubscribe();

    this.ContentStore.clearContentList();
    DocumentsStore.clearParentAccessData();
    DocumentsStore.unsetDocumentDetails();
    ContentStore.clearContentList();
    ContentStore.clearIndividualList();
    ContentStore.clearCheckList();
    ContentStore.clearNotes();
    documentWorkFlowStore.unsetDocumentWorkflow();
    documentWorkFlowStore.unsetWorkflowHistory();
    ControlStore.unSelectControls();
    DocumentsStore.documentVersionId = null;
    // DocumentsStore.documentId = null;
    this.popupControlEventSubscription.unsubscribe();

  }

}
