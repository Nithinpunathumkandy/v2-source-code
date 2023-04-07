import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { TemplateStore } from 'src/app/stores/knowledge-hub/templates/templates.store'
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store'
import { documentWorkFlowStore } from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ChangeRequestService } from 'src/app/core/services/knowledge-hub/change-request/change-request.service';
import { ChangeRequestNoteService } from 'src/app/core/services/knowledge-hub/change-request/change-request-note.service';
import { ChangeRequestContentService } from 'src/app/core/services/knowledge-hub/change-request/change-request-content.service';
import { ChangeRequestWorkflowService } from 'src/app/core/services/knowledge-hub/change-request/change-request-workflow.service';
declare var $: any;

@Component({
  selector: 'app-internal-change-request',
  templateUrl: './internal-change-request.component.html',
  styleUrls: ['./internal-change-request.component.scss']
})
export class InternalChangeRequestComponent implements OnInit, OnDestroy {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('workflow') workflow: ElementRef;
  @ViewChild('notesForm') notesForm: ElementRef;
  @ViewChild('commentForm') commentForm: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('checkListForm') checkListForm: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('templateRightDetails') templateRightDetails: ElementRef;
  @ViewChild('clauseFormModal', { static: true }) clauseFormModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore
  ContentStore = ContentStore;
  DocumentsStore = DocumentsStore
  KHSettingStore = KHSettingStore
  SubMenuItemStore = SubMenuItemStore;
  changeRequestStore = changeRequestStore;
  documentWorkFlowStore = documentWorkFlowStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;

  title: string;
  dataArray = []
  previewUrl = null;
  displayData = null;

  NotesParam: any;
  sourceParams: any;
  scrollPostiion: any;
  CheckListParams: any;

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

  userMatch: boolean = false;
  checklist: boolean = false;
  dataChecked: boolean = false;
  is_checklist: boolean = false;
  disableSearch: boolean = true;

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
    private _route: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
    private _changeRequestService: ChangeRequestService,
    private _changeRequestNoteService: ChangeRequestNoteService,
    private _changeRequestContentService: ChangeRequestContentService,
    private _changeRequestWorkflowService: ChangeRequestWorkflowService,
  ) { }

  ngOnInit(): void {
    //this.enableCommentBox()
    this.getRequestDetails(changeRequestStore.getChangeRequestId);

    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any Clauses added here!", subtitle: 'Add Clause if there is any. To add, simply tap the button below. ', buttonText: 'Add New Clause' });
    this.reactionDisposer = autorun(() => {
      this.addSubmenu()
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
      this.commonDeleteFn(item)
      //this.deleteRequestContent(item);
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

    this.workflowPopupSubscription = this._eventEmitterService.changeRequestWorkflow.subscribe(res => {
      this.closeWorkflowPopup()
    })

    this.workflowHistorySubscription = this._eventEmitterService.changeRequestWorkflowHistory.subscribe(res => {
      this.closeWorkflowHistoryPopup()
    })

    this.closeCommentsSubscription = this._eventEmitterService.commentModal.subscribe(res => {
      if(res){
        this.getRequestDetails(changeRequestStore.getChangeRequestId);
      }
      this.closeCommentsForm()
    })

  }

  getRequestDetails(id) {
    this._changeRequestService.getItemById(id).subscribe(res => {
      if (res?.file) 
        changeRequestStore.changedFileID = res?.file['id'];
        this.getChangeRequest()
        this.enableCommentBox()
        this._utilityService.detectChanges(this._cdr)
      
    })
  }

  // downloadFile() {
  //   this._documentFileService.downloadFile('change-request-file', changeRequestStore.documentId, changeRequestStore?.requestDetails?.file?.id, null, changeRequestStore.requestDetails.title, changeRequestStore?.requestDetails?.file)
  // }

  // checkExtension(ext, extType, data?) {
  //   var res = this._imageService.checkFileExtensions(ext, extType);
  //   return res;
  // }

  // //Returns default image, if no image is present
  // getDefaultImage(type) {
  //   return this._imageService.getDefaultImageUrl(type);
  // }

  // createImageUrl(type, token, h?, w?) {
  //   return this._documentFileService.getThumbnailPreview(type, token, h, w);
  // }

  // getArrayFormatedString(items) {
  //   return this._helperService.getArraySeperatedString(',', 'title', items);
  // }

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

  scrollAfterAdd() {
    window.scrollTo({
      top: this.scrollPostiion,
      behavior: 'smooth'
    })
  }

  // onWindowScroll() {
  //   var status = false;
  //   if (!status) {
  //     this.scrollPostiion = window.pageYOffset
  //   }
  //   if ($(this.notesForm.nativeElement).hasClass('show') || $(this.clauseFormModal.nativeElement).hasClass('show')) {
  //     status = true;
  //   }
  // }

  // //Getting change request details
  // getChangeRequestDetails() {
  //   this._changeRequestService.getItemById(changeRequestStore.documentId).subscribe(res => {
  //     this.addSubmenu();
  //     res['type'] = 'Request'
  //     this.dataArray = [res]
  //     this._utilityService.detectChanges(this._cdr);
  //   })

  // }

  //adding submenu based on the conditions
  addSubmenu() {
    if (changeRequestStore.requestdetailsLoaded && changeRequestStore.requestDetails) {
      var subMenuItems = [
        { activityName: 'DOWNLOAD_DOCUMENT_CHANGE_REQUEST_FILES', submenuItem: { type: 'download' } },
        // { activityName: 'DOCUMENT_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
        // { activityName: 'DOCUMENT_FREQUENT_REVIEW_UPDATE_LIST', submenuItem: { type: 'review_update' } },
        //{ activityName: null, submenuItem: { type: 'review' } },
        { activityName: null, submenuItem: { type: 'history' } },
        { activityName: null, submenuItem: { type: 'workflow' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      if (changeRequestStore.requestDetails?.created_by?.id == AuthStore?.user?.id && (changeRequestStore.requestDetails?.document_change_request_status?.type == 'draft' || changeRequestStore.requestDetails?.document_change_request_status?.type == 'reverted')) {
        subMenuItems.splice(0, 0, { activityName: 'SUBMIT_DOCUMENT', submenuItem: { type: 'submit' } },)
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
    documentWorkFlowStore.submitPopup = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.deletePopup.nativeElement).modal('show');
  }

  //getting preview of the document and contents
  getChangeRequest() {
    if (changeRequestStore.changedFileID) {
      console.log("HEY")
      this._documentFileService.getFilePreview('change-request-file', changeRequestStore.documentId, changeRequestStore.changedFileID).subscribe((res) => {
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
    switch (type) {
      case "notes":
        this.deleteObject.title = 'Delete Note?';
        this.deleteObject.itemType = 'Note';
        this.deleteObject.fnType = 'request';
        this.deleteObject.subtitle = `It will delete the note from ${updatedValue}`;
        break;

      case "Content":
        this.deleteObject.title = 'Delete Content?';
        this.deleteObject.itemType = 'Content';
        this.deleteObject.fnType = 'request';
        this.deleteObject.subtitle = `It will delete the clause from ${updatedValue}`;
        break;

      case "CheckList":
        this.deleteObject.title = 'Delete CheckList?';
        this.deleteObject.itemType = 'CheckList';
        this.deleteObject.fnType = 'request';
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
    this.deleteObject.fnType = ''
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

  openCommentsForm(value) {
    this.workflowFormObject.title = value
    this.workflowFormObject.type = "open"
    $(this.commentForm.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentForm.nativeElement, 'display', 'block');
  }

  closeCommentsForm() {
    $(this.commentForm.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
    this._renderer2.setStyle(this.commentForm.nativeElement, 'display', 'none');
    this.objectClear()
  }

  objectClear() {
    this.workflowFormObject.title = null
    this.workflowFormObject.type = ''
  }

  setClass(id) {

  }

  enableCommentBox() {
    if (changeRequestStore.requestDetails?.document_change_request_status?.type == 'in-review') {
      this._changeRequestWorkflowService.getWorkflowNew(changeRequestStore.getChangeRequestId).subscribe(res => {
        if (res)
          changeRequestStore.enableButtons = this.isUser()
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      changeRequestStore.enableButtons = false;
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
    changeRequestStore.changedFileID=null;
  }

}