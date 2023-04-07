import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';
import { ChangeRequestService } from 'src/app/core/services/knowledge-hub/change-request/change-request.service';

import { Subscription } from 'rxjs';
import { AuthStore } from 'src/app/stores/auth.store';
import { DomSanitizer } from '@angular/platform-browser';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { TemplateStore } from 'src/app/stores/knowledge-hub/templates/templates.store'
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store'
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { KhSettingsService } from 'src/app/core/services/settings/organization_settings/kh-settings/kh-settings.service';
import { ChangeRequestNoteService } from 'src/app/core/services/knowledge-hub/change-request/change-request-note.service';
import { ChangeRequestContentService } from 'src/app/core/services/knowledge-hub/change-request/change-request-content.service';
import { ChangeRequestWorkflowService } from 'src/app/core/services/knowledge-hub/change-request/change-request-workflow.service';
declare var $: any;

@Component({
  selector: 'app-external-change-request',
  templateUrl: './external-change-request.component.html',
  styleUrls: ['./external-change-request.component.scss']
})
export class ExternalChangeRequestComponent implements OnInit {

  @ViewChild('sideBarRound', { static: true }) sideBarRound: ElementRef;
  @ViewChildren('templateSideBar') templateSideBar: QueryList<ElementRef>;
  @ViewChild('templateRightDetails') templateRightDetails: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('workflow') workflow: ElementRef;
  @ViewChild('notesForm') notesForm: ElementRef;
  @ViewChild('commentForm') commentForm: ElementRef;  
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('checkListForm') checkListForm: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('clauseFormModal', { static: true }) clauseFormModal: ElementRef;

  sideCollapsed: boolean = false;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  AuthStore = AuthStore
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  changeRequestStore = changeRequestStore;

  documentId: number
  title: string;
  dataArray = []
  extension = null;
  displayData = null;
  previewUrl = null;
  TemplateDetails = []

  NotesParam: any;
  sourceParams: any;
  documentParams: any;
  scrollPostiion: any;
  CheckListParams: any;

  ContentStore = ContentStore;
  DocumentsStore = DocumentsStore
  KHSettingStore = KHSettingStore  

  userDetailObject = {
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

  clauseEmptyList = "No Clauses Available"

  checklistObject = {
    component: 'Master',
    values: null,
    type: null
  };

  submitObject = {
    buttonType: null,
    subtitle: '',
    type: 'Change Request'
  }

  deleteObject = {
    title: '',
    id: null,
    subtitle: '',
    type: '',
    contentId: null,
    modalType: '',
    itemType: '',
    data: null,
    fnType: ''
  };

  workflowObject = {
    type: ''
  }

  workflowHistoryObject = {
    type: ''
  }

  workflowFormObject = {
    type: '',
    title: '',
  }

  showPDF: boolean;
  showContent: boolean;
  showNewDesign: boolean;
  showPDFButton: boolean;
  userMatch: boolean = false;
  checklist: boolean = false;
  showContentButton: boolean;
  dataChecked: boolean = false;
  is_checklist: boolean = false;
  disableSearch: boolean = true;
  details_loaded: boolean = false;

  addCheckListEvent: Subscription;
  modalTypeSubscription: Subscription;  
  checkinFormSubscription: Subscription;
  deleteEventSubscription: Subscription;
  workflowPopupSubscription: Subscription;
  closeCommentsSubscription: Subscription;
  workflowHistorySubscription: Subscription;
  updatePCDAEventSubscription: Subscription;
  childNotesEventSubscription: Subscription;
  modalStyleEventSubscription: Subscription;
  commonModalEventSubscription: Subscription;
  deleteRequestChildSubscripton: Subscription;
  editRequestChildSubscription: Subscription;
  editChildNoteEventSubscription: Subscription;
  templateChildSubscriptionEvent: Subscription;
  deleteChildNoteEventSubscription: Subscription;
  addChildCheckListEventSubscription: Subscription;
  deleteChildCheckListEventSubscription: Subscription;

  constructor(
    private _renderer2: Renderer2,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _route: Router,
    private _changeRequestService: ChangeRequestService,

    private _sanitizer: DomSanitizer,
    private _KhSettingsService: KhSettingsService,
    private _eventEmitterService: EventEmitterService,
    private _changeRequestNoteService: ChangeRequestNoteService,
    private _changeRequestContentService: ChangeRequestContentService,
    private _changeRequestWorkflowService: ChangeRequestWorkflowService,
  ) { }

  ngOnInit(): void {
    //this.enableCommentBox()
    this.getRequestDetails(changeRequestStore.getChangeRequestId);


    this.details_loaded = true;
    this.checkDocumentTypePermission()
    DocumentsStore.showNewDesign = true;
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any Clauses added here!", subtitle: 'Add Clause if there is any. To add, simply tap the button below. ', buttonText: 'Add New Clause' });
    this.reactionDisposer = autorun(() => {
      this.getSubmenu()
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editRequest()
            break;

          case "submit":
            this.openSubmitPopup();
            break;

          case "workflow":
            this.openWorkflow()
            break;

          case "history":
            this.openWorkflowHistory()
            break;

          case "approve":
            this.openCommentsForm('approve')
            break;

          case "revert":
            this.openCommentsForm('revert')
            break;

          case "reject":
            this.openCommentsForm('reject')
            break;

          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.openForm('Parent')
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    SubMenuItemStore.setNoUserTab(true);

    this.templateChildSubscriptionEvent = this._eventEmitterService.templateChildComponent.subscribe(res => {
      this.openForm(res.type, res.data)
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      //this.deleteRequestContent(item);
      this.commonDeleteFn(item)
    })

    this.deleteRequestChildSubscripton = this._eventEmitterService.deleteTemplate.subscribe(res => {
      this.delete(res.modalType, res.contentId, res.type)
    })

    this.editRequestChildSubscription = this._eventEmitterService.editTemplate.subscribe(res => {
      this.editContent(res.modalType, res.id)
    })

    this.checkinFormSubscription = this._eventEmitterService.checkinModal.subscribe(res => {
      // * This is to reload the newly Checked in Document!.
      this.dataChecked = false;
    })

    this.workflowPopupSubscription = this._eventEmitterService.changeRequestWorkflow.subscribe(res => {
      this.closeWorkflowPopup()
    })

    this.workflowHistorySubscription = this._eventEmitterService.changeRequestWorkflowHistory.subscribe(res => {
      this.closeWorkflowHistoryPopup()
    })

    this.closeCommentsSubscription = this._eventEmitterService.commentModal.subscribe(res => {
      // if(res){
      //   this.getRequestDetails(changeRequestStore.getChangeRequestId);
      // }
      this.closeCommentsForm()
    })

    this.commonModalEventSubscription = this._eventEmitterService.commonModal.subscribe(
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

    this.modalTypeSubscription = this._eventEmitterService.ModalType.subscribe(res => {
      this.templateContents(res.modalType, ContentStore.ParentId)
      this.closeRequestClause()
    })

    this.childNotesEventSubscription = this._eventEmitterService.childNote.subscribe(res => {
      this.openNotesForm(res.modalType, res.contentId)
    })

    this.editChildNoteEventSubscription = this._eventEmitterService.editChildNote.subscribe(res => {
      this.editNotes(res.modalType, res.noteData, res.id)
    })

    this.deleteChildNoteEventSubscription = this._eventEmitterService.deleteChildNote.subscribe(data => {
      this.delete(data.modalType, data.noteId, data.type)
    })

    this.modalStyleEventSubscription = this._eventEmitterService.ModalStyle.subscribe(res => {
      this._renderer2.setStyle(this.checkListForm.nativeElement, 'z-index', '999999');
      this._renderer2.setStyle(this.checkListForm.nativeElement, 'overflow', 'auto');
    })

    this.addChildCheckListEventSubscription = this._eventEmitterService.addchildCheckList.subscribe(data => {
      this.openCheckListForm(data.modalType, data.contentId, data.checklistData)
    })

    this.deleteChildCheckListEventSubscription = this._eventEmitterService.deleteChildCheckList.subscribe(data => {
      this.delete(data.modalType, data.checkListId, data.type, data.contentId, data.checklistData)
    })

    this.updatePCDAEventSubscription = this._eventEmitterService.passPCDA.subscribe(data => {
      this.updatePCDA(data.modalType, data.status, data.type, data.contentId)
    })

    this.addCheckListEvent = this._eventEmitterService.addCheckListModal.subscribe(res => {
      this.closeChecklistModal();
    })
    
  }

  getRequestDetails(id) {
    this._changeRequestService.getItemById(id).subscribe(res => {      
      if (res?.versions)
        changeRequestStore.changedFileID = res?.versions['id'];
      this.getChangeRequest()
      this.enableCommentBox()
      this._utilityService.detectChanges(this._cdr)
    })
  }

  downloadFile() {
    this._documentFileService.downloadFile('change-request-file', changeRequestStore.documentId, changeRequestStore?.requestDetails?.file?.id, null, changeRequestStore.requestDetails.title, changeRequestStore?.requestDetails?.file)
  }

  tabListUlClick(ev) {
    if ((ev.target.tagName == 'A') && (ev.target.classList.contains('full-screen-click')))
      this.collapseSide();
    else if ((ev.target.tagName == 'A') && (ev.target.classList.contains('nav-link-show')))
      this.unCollapseSide();
  }

  collapseSide() {
    if (!this.sideCollapsed && this.templateSideBar.first) {
      this._renderer2.removeClass(this.templateSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.addClass(this.templateSideBar.first.nativeElement, 'user-side-bar-hd');
      setTimeout(() => {
        this._renderer2.addClass(this.templateSideBar.first.nativeElement, 'user-side-bar-hd');
        this._renderer2.addClass(this.templateRightDetails.nativeElement, 'flex-98-width');
      }, 150);
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'block');
      this._renderer2.addClass(this.sideBarRound.nativeElement, 'tActive');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'position', 'fixed');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index', '99999');
      this.sideCollapsed = true;
    }
  }

  unCollapseSide() {
    if (this.sideCollapsed && this.templateSideBar.first) {
      this._renderer2.removeClass(this.templateSideBar.first.nativeElement, 'user-side-bar-hd');
      this._renderer2.addClass(this.templateSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.removeClass(this.templateRightDetails.nativeElement, 'flex-98-width');
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

  getArrayFormatedString(items) {
    return this._helperService.getArraySeperatedString(',', 'title', items);
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  getPopupDetails(details?) {
    this.userDetailObject.id = details?.id;
    this.userDetailObject.first_name = details?.created_by?.first_name;
    this.userDetailObject.last_name = details?.created_by?.last_name;
    this.userDetailObject.designation = details?.created_by?.designation;
    this.userDetailObject.image_token = details?.created_by?.image?.token;
    this.userDetailObject.email = details?.created_by?.email;
    this.userDetailObject.mobile = details?.created_by?.mobile;
    this.userDetailObject.department = details?.department ? details?.created_by_department : null;
    this.userDetailObject.created_at = this.getTimezoneFormatted(details?.created_at);

    return this.userDetailObject;
  }

  checkDocumentTypePermission() {
    this._KhSettingsService.getItems().subscribe(res => {
      if (res)
        this.checkSettingsPermission()
    })
  }

  checkSettingsPermission() {
    if (KHSettingStore.khSettingsItems?.knowledge_hub_setting_type?.type == 'external') {
      this.selectedTab('picture')
      return this.showContentButton = true, this.showPDFButton = true;
    } else {
      this.selectedTab('content')
      return this.showContentButton = false, this.showPDFButton = false;
    }
  }

  scrollAfterAdd() {
    window.scrollTo({
      top: this.scrollPostiion,
      behavior: 'smooth'
    })
  }

  onWindowScroll() {
    var status = false;
    if (!status) {
      this.scrollPostiion = window.pageYOffset
    }
    if ($(this.notesForm.nativeElement).hasClass('show') || $(this.clauseFormModal.nativeElement).hasClass('show')) {
      status = true;
    }
  }

  // Sorting Clause Number to Show in Proper Format
  sortClauseNumber(number) {
    return number
  }

  // Setting Accordion and Individual Request Content List
  setRequestContentAccordion(type, index: number, id, initial: boolean = false) {
    ContentStore.ParentId = id
    ContentStore.clearIndividualList();
    this._changeRequestContentService.getItemById(id).subscribe()
    this.ContentStore.setContentAccordion(index);
    this._utilityService.detectChanges(this._cdr);
  }

  //Getting change request details
  getChangeRequestDetails() {
    this._changeRequestService.getItemById(changeRequestStore.documentId).subscribe(res => {
      this.getSubmenu();
      res['type'] = 'Request'
      this.dataArray = [res]
      this._utilityService.detectChanges(this._cdr);
    })

  }

  //adding submenu based on the conditions
  getSubmenu(){
    if(changeRequestStore.requestdetailsLoaded && changeRequestStore.requestDetails){
      this.currentUserCheck()

      let subMenuItems = [
        { activityName: 'DOWNLOAD_DOCUMENT_CHANGE_REQUEST_FILES', submenuItem: { type: 'download' } },
        //{ activityName: null, submenuItem: { type: 'review' } },
        // { activityName: null, submenuItem: { type: 'history' } },
        // { activityName: null, submenuItem: { type: 'workflow' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
    

    if (this.userMatch && changeRequestStore.requestDetails?.document_change_request_status?.type == 'in-review') {
      subMenuItems.push(
        { activityName: null, submenuItem: { type: 'history' } },
        { activityName: null, submenuItem: { type: 'workflow' } },
        { activityName: null, submenuItem: { type: 'approve' } },
        { activityName: null, submenuItem: { type: 'revert' } },
        { activityName: null, submenuItem: { type: 'reject' } },
      )
    }

    if (changeRequestStore.requestDetails?.document_change_request_status?.type == 'approved') {
      if(changeRequestStore.requestDetails?.is_workflow &&  changeRequestStore.requestDetails?.workflow_items.length > 0){
        subMenuItems.push(
          { activityName: null, submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'workflow' } },
  
        )
      }
   
    }

    if (changeRequestStore.requestDetails?.document_change_request_status?.type == 'draft' || changeRequestStore.requestDetails?.document_change_request_status?.type == 'reverted') {

      if(changeRequestStore.requestDetails?.is_workflow &&  changeRequestStore.requestDetails?.workflow_items.length > 0){

        if(changeRequestStore.requestDetails.created_by.id==AuthStore?.user?.id){
          subMenuItems.push(
            { activityName: null, submenuItem: { type: 'history' } },
            { activityName: null, submenuItem: { type: 'workflow' } },
            { activityName: 'SUBMIT_DOCUMENT', submenuItem: { type: 'submit' } },
          )
        }
        else
        {
          subMenuItems.push(
            { activityName: null, submenuItem: { type: 'history' } },
            { activityName: null, submenuItem: { type: 'workflow' } },
          )
        }
  
      //   if(changeRequestStore.requestDetails?.created_by?.id == AuthStore?.user?.id)
      //   subMenuItems.splice(0, 0, { activityName: 'SUBMIT_DOCUMENT', submenuItem: { type: 'submit' } },)
      // }
        }
    }
    this._helperService.checkSubMenuItemPermissions(700, subMenuItems);
    this._utilityService.detectChanges(this._cdr);
  }


  }


  //checking loggedin user and workflow level user is same or not
  currentUserCheck() {
    if (changeRequestStore.requestDetails) {
      if (changeRequestStore.requestDetails.workflow_items && changeRequestStore.requestDetails.workflow_items.length > 0)
        changeRequestStore.requestDetails.workflow_items.forEach(items => {
          if (items.level == changeRequestStore.requestDetails.next_review_user_level) {
            this.userMatch = items.users.some((user) =>
              user.id == AuthStore?.user?.id)
          }
        })
    }
  }

  editRequest() {
    changeRequestStore.editCheck = true;
    changeRequestStore.unsetChangeRequestDetails();
    this._changeRequestService.getItemById(changeRequestStore.documentId).subscribe(res => {
      this._route.navigateByUrl('knowledge-hub/change-requests/edit-request');
      this._utilityService.detectChanges(this._cdr)
    });
  }

  //opening form for submitting documment for review
  openSubmitPopup() {        
    this.deleteObject.fnType = 'change_request'
    this.deleteObject.type = 'submit'
    this.deleteObject.subtitle = "It will send document for the review"        
    this._utilityService.detectChanges(this._cdr)
    $(this.deletePopup.nativeElement).modal('show');
  }

  //getting preview of the document and contents
  getChangeRequest() {
    if (changeRequestStore.changedFileID) {
      this._documentFileService.getFilePreview('change-request-document', changeRequestStore.documentId, changeRequestStore.changedFileID).subscribe((res) => {
        var resp: any = this._utilityService.getDownLoadLink(
          res,
          "this.TemplateDetails.values.title"
        );
        this.setFilePreview(resp);
      })
    }

    this._changeRequestContentService.getAllItems(ContentStore.ParentId).subscribe(res => {
      this.calculateClauseNumber(res, 'Parent')
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //switching tabs between content and documents
  selectedTab(type) {
    if (type == 'picture') {
      this.showPDF = true;
      this.showContent = false
      this.disableSearch = true;
    }
    else {
      this.showContent = true;
      this.showPDF = false;
      this.disableSearch = false;
    }
  }

  //getting contents of the change request
  templateContents(type, contentId?) {
    this._changeRequestContentService.getAllItems(contentId).subscribe(res => {
      this.calculateClauseNumber(res, 'Parent')
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //setting preview of the documment
  setFilePreview(filePreview, title?) {
    let previewItem = null;
    previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewUrl = previewItem
    this.title = title
    this._utilityService.detectChanges(this._cdr)
  }

  //updating pcda
  updatePCDA(modalType, status, type, contentId) {
    if (status == true) {
      this._changeRequestContentService.deactivatePCDA(contentId, type).subscribe(res => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      });
    } else {
      this._changeRequestContentService.activatePCDA(contentId, type).subscribe(res => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      });
    }
  }

  // Delete notes/content/checklist
  delete(modalType, id: number, type, contentId?, data?) {
    let updatedValue = "change request"
    this.deleteObject.fnType = 'request'
    switch (type) {
      case "notes":
        this.deleteObject.title = 'Delete Note?';
        this.deleteObject.itemType = 'Note';
        this.deleteObject.subtitle = `It will delete the note from ${updatedValue}`;
        break;

      case "Content":
        this.deleteObject.title = 'Delete Content?';
        this.deleteObject.itemType = 'Content';
        this.deleteObject.subtitle = `It will delete the clause from ${updatedValue}`;
        break;

      case "CheckList":
        this.deleteObject.title = 'Delete CheckList?';
        this.deleteObject.itemType = 'CheckList';
        this.deleteObject.subtitle = `It will delete the checklist from ${updatedValue}`;
        this.deleteObject.contentId = contentId;
        this.deleteObject.data = data;
        break;
      default:
        break;
    }
    this.deleteObject.id = id;
    //this.deleteObject.subtitle = 'This action cannot be undone';
    $(this.deletePopup.nativeElement).modal('show');
  }

  //delete content/notes
  deleteRequestContent(status) {
    switch (this.deleteObject.itemType) {
      case 'Content':
        if (status && this.deleteObject.id) {
          this._changeRequestContentService.delete(this.deleteObject.id).subscribe(resp => {
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
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

      case 'Note':
        if (status && this.deleteObject.id) {
          this._changeRequestNoteService.delete(this.deleteObject.id).subscribe(resp => {
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
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

  //need to clear the object on every popup event occurd
  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.title = '';
    this.deleteObject.subtitle = '';
    this.deleteObject.type = '';
    this.deleteObject.contentId = null
  }

  //edititing clause
  editContent(modalType, id) {
    ContentStore.editCheck = true;
    this._changeRequestContentService.getItemById(id).subscribe(res => {
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
        changeRequestContentId: editData['parent_content'] ? editData['parent_content'].id : null,
        modalType: modalType
      }
      this.openFormModal();
    })
  }

  //editing notes of the change request
  editNotes(modalType, noteData, contentId) {
    // modalType to handle btw Documents and Template types.
    this.NotesParam = {
      id: noteData.id,
      notes: noteData.title,
      content_id: contentId
    }
    if (modalType == 'Template')
      this.NotesParam = {
        ...this.NotesParam,
        document_template_id: TemplateStore.templateId
      }
    else
      this.NotesParam = {
        ...this.NotesParam,
        document_version_id: DocumentsStore.documentVersionId
      }
    this._utilityService.detectChanges(this._cdr);
    this.openNotesForm(modalType, contentId)
  }

  // Form Handling For Requests/Document.
  openForm(type, data?, kkn?) {
    this.openRequestClause(type, data)
  }

  //opening notes form
  openNotesForm(type, contentId) {
    this.NotesParam = {
      contentId: contentId,
      type: type
    }
    this._utilityService.detectChanges(this._cdr)
    $(this.notesForm.nativeElement).modal('show');
  }

  //closing notes form
  closeNotesForm() {
    this.NotesParam = null;
    ContentStore.clearNotes();
    $(this.notesForm.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
    this.scrollAfterAdd();
  }

  openCheckListForm(type, contentId, data?) {
    this.CheckListParams = {
      content_id: contentId,
      type: type,
      data: data
    }
    this._utilityService.detectChanges(this._cdr)
    $(this.checkListForm.nativeElement).modal('show');
  }

  closeCheckListForm() {
    this.CheckListParams = null;
    $(this.checkListForm.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
    this.scrollAfterAdd();
  }

  closeChecklistModal() {
    this.CheckListParams = null;
    $(this.checkListForm.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
    this.scrollAfterAdd();
  }

  // Form Modal for Edit/Add
  openFormModal() {
    this._utilityService.detectChanges(this._cdr)
    $(this.clauseFormModal.nativeElement).modal('show');
  }

  //calculating clause numbers with decimal points
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
          nextClauseNumber = 1 + '.' + totalLength
        else
          nextClauseNumber = data.clause_number + '.' + totalLength
        ContentStore.clause_number = nextClauseNumber

      }
      else if (data.children_content) {
        let childData = data.children_content
        let totalLength = childData.length + 1

        let nextClauseNumber
        if (data.clause_number == 0)
          nextClauseNumber = 1 + '.' + totalLength
        else
          nextClauseNumber = data.clause_number + '.' + totalLength
        ContentStore.clause_number = nextClauseNumber
      }
    }
  }

  openRequestClause(type, data?) {
    let modalType = "Request"
    if (type == 'Child')
      this.calculateClauseNumber(data, 'Child')
    if (type == 'Parent') {
      this.sourceParams = {
        changeRequestContentId: null,
        modalType: modalType
      }
    }
    if (type == 'Child') {
      // Case Where Children Inside Document_template_content
      if (data.children && data.children.length > 0) {
        this.sourceParams = {
          changeRequestContentId: data.id,
          order: data.children.length + 1,
          children: true,
          modalType: modalType
        }
      }
      else {
        // Case Where only Document_template_content
        this.sourceParams = {
          changeRequestContentId: data.id,
          children: false,
          modalType: modalType
        }
      }
    }
    this.openFormModal();
  }

  //closing template clause
  closeRequestClause() {
    this.sourceParams = null;
    $(this.clauseFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
    this.scrollAfterAdd();
  }
  openComment(id) {

  }

  getFirstLevelDetails(details) {
    this.userDetailObject.id = details?.id;
    this.userDetailObject.first_name = details?.name;
    this.userDetailObject.last_name = details?.last_name;
    this.userDetailObject.designation = details?.designation?.title;
    this.userDetailObject.image_token = details?.created_by_image_token;
    this.userDetailObject.email = details?.email;
    this.userDetailObject.mobile = details?.created_by?.mobile;
    this.userDetailObject.department = details?.department?.title
    //this.userDetailObject.created_at=details?.created_at;
    //this.userDetailObject.status_id = details?.status_id ? details?.status?.id : 1;

    return this.userDetailObject;
  }

  setStatusColor() {

    var className = 'status-tag-new-two'

    switch (changeRequestStore.requestDetails?.document_change_request_status?.type) {
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


  setClass(id) {

  }

  enableCommentBox() {
    if (changeRequestStore.requestDetails?.document_change_request_status?.type == 'in-review') {
      this._changeRequestWorkflowService.getWorkflow(changeRequestStore.getChangeRequestId).subscribe(res => {
        if (res)
          changeRequestStore.enableWorkflow = this.isUser()
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      changeRequestStore.enableWorkflow = false;
      this._utilityService.detectChanges(this._cdr);
    }
    this._utilityService.detectChanges(this._cdr);
  }

  isUser() {
    if (changeRequestStore?.change_request_workflow_loaded) {
      for (let i of changeRequestStore?.changeRequestWorkflow) {
        if (i.level == changeRequestStore.requestDetails?.next_review_user_level) {
          var pos = i.workflow_item_users.findIndex(e => e.id == AuthStore.user.id)
          var status = i.workflow_item_users.findIndex(e => e.status.id == 1)
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

  //submitting change request for approving to level users
  submitChangeRequest(status) {
    AppStore.enableLoading();
    if (status) {
      this._changeRequestWorkflowService.submittDocument().subscribe(res => {
        setTimeout(() => {
          this.clearDeleteObject();
          this.getRequestDetails(changeRequestStore.getChangeRequestId);
          $(this.deletePopup.nativeElement).modal('hide');
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      })
    } else {
      this.clearDeleteObject();
      $(this.deletePopup.nativeElement).modal('hide');
    }
  }

  commonDeleteFn(status) {
    switch (this.deleteObject.fnType) {
      case 'change_request': this.submitChangeRequest(status);
        break;
      case 'request': this.deleteRequestContent(status);;
        break;
    }
  }

  //opening workflow popup
  openWorkflow() {
    this.workflowObject.type = "new"
    this._utilityService.detectChanges(this._cdr)
    $(this.workflow.nativeElement).modal('show');
  }

  closeWorkflowPopup() {
    this.workflowObject.type = ''
    $(this.workflow.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }

  //opening workflow history popup
  openWorkflowHistory() {
    this.workflowHistoryObject.type = "new"
    this._utilityService.detectChanges(this._cdr)
    $(this.workflowHistory.nativeElement).modal('show');
  }

  closeWorkflowHistoryPopup() {
    this.workflowHistoryObject.type = ''
    $(this.workflowHistory.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }

  openCommentsForm(value) {
    this.workflowFormObject.title = value
    this.workflowFormObject.type = "open"
    $(this.commentForm.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentForm.nativeElement, 'display', 'block');
  }

  closeCommentsForm() {
    setTimeout(() => {
      this.getRequestDetails(changeRequestStore.getChangeRequestId)
    }, 500);
    $(this.commentForm.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
    this._renderer2.setStyle(this.commentForm.nativeElement, 'display', 'none');
    this.objectClear()
  }

  objectClear() {
    this.workflowFormObject.title = null
    this.workflowFormObject.type = ''
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    changeRequestStore.unsetChangeRequestDetails();
    ContentStore.clearIndividualList()
    ContentStore.clearContentList()
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCheckListEvent.unsubscribe()
    this.modalTypeSubscription.unsubscribe()
    this.checkinFormSubscription.unsubscribe()
    this.deleteEventSubscription.unsubscribe()
    this.workflowPopupSubscription.unsubscribe()
    this.closeCommentsSubscription.unsubscribe()
    this.workflowHistorySubscription.unsubscribe()
    this.updatePCDAEventSubscription.unsubscribe()
    this.childNotesEventSubscription.unsubscribe()
    this.modalStyleEventSubscription.unsubscribe()
    this.commonModalEventSubscription.unsubscribe()
    this.deleteRequestChildSubscripton.unsubscribe()
    this.editRequestChildSubscription.unsubscribe()
    this.editChildNoteEventSubscription.unsubscribe()
    this.templateChildSubscriptionEvent.unsubscribe()
    this.deleteChildNoteEventSubscription.unsubscribe()
    this.addChildCheckListEventSubscription.unsubscribe()
    this.deleteChildCheckListEventSubscription.unsubscribe()
  }

}
