import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef, Renderer2} from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store'
import { AppStore } from 'src/app/stores/app.store';
import { DocumentContentService } from 'src/app/core/services/knowledge-hub/documents/document-content.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { DocumentNotesService } from 'src/app/core/services/knowledge-hub/documents/document-notes.service';
import { DocumentChecklistService } from 'src/app/core/services/knowledge-hub/documents/document-checklist.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { IReactionDisposer, autorun } from "mobx";
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
import { CommentStore } from 'src/app/stores/comment.store';
import { DocumentWorkflowService } from 'src/app/core/services/knowledge-hub/documents/document-workflow.service';
import { documentWorkFlowStore } from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';

declare var $: any;

@Component({
  selector: 'app-internal-document',
  templateUrl: './internal-document.component.html',
  styleUrls: ['./internal-document.component.scss']
})
export class InternalDocumentComponent implements OnInit {

 
  @ViewChild('sectionFormModal', { static: true }) sectionFormModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('notesFormModal') notesFormModal: ElementRef;
  @ViewChild('checkListFormModal') checkListFormModal: ElementRef;
  @ViewChild('bpmControlListFormModal') bpmControlListFormModal: ElementRef;
  @ViewChild('commentFormModal') commentFormModal: ElementRef;
  @ViewChild('checkinDocumentPopup') checkinDocumentPopup: ElementRef;
  @ViewChild('activityPopup') activityPopup: ElementRef;
  @ViewChild('reviewHistoryPopup')reviewHistoryPopup:ElementRef;
  @ViewChild('workflowSubmitPopup') workflowSubmitPopup: ElementRef;
  @ViewChild('workflowPopup') workflowPopup: ElementRef;
  @ViewChild('workflowActionPopup')workflowActionPopup:ElementRef;
  @ViewChild('workflowHistoryPopup')workflowHistoryPopup:ElementRef;
  @ViewChild('reviewUpdatePopup')reviewUpdatePopup:ElementRef;
  @ViewChild("innerScroll", { static: false }) innerScroll: ElementRef;


  sourceParams: any;
  CheckListParams: any;
  NotesParam: any;
  controlModalParam={content_id:null,controls:[]};
  controlsModalTitle={
    component:'kh_documents'
  }

  submitObject = {
    buttonType: null,
    subtitle: '',
    type:'Document'
  }


  ContentStore = ContentStore;
  AppStore = AppStore
  reactionDisposer: IReactionDisposer;
  KHSettingStore=KHSettingStore;
  AuthStore = AuthStore
  DocumentsStore=DocumentsStore;
  SubMenuItemStore = SubMenuItemStore;
  DocumentWorkflowStore = documentWorkFlowStore;
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  ProcessStore=ProcessStore;
  ControlStore=ControlStore


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
  childCommentBoxSubscription:any;
  commentModalSubscription:any
  workflowSubmitModalSubscription:any;
  workflowUserEditModalSubscription:any;
  workflowHistoryModalSubscription:any;
  commentBoxSubscription:any;
  controlModalEventSubscription:any;
  addChildControlEventSubscription:any;
  deleteChildControlEventSubscription:any;

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
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null,
    created_at:''    
  }

  clauseEmptyList = "No Sections Available"





  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _documentContentService: DocumentContentService,
    private _documentNoteService: DocumentNotesService,
    private _documentCheckListService:DocumentChecklistService,
    private _documentWorkflowService:DocumentWorkflowService,
    private _documentService: DocumentsService,
    private _helperService: HelperServiceService,
    private route: ActivatedRoute,
    private _route: Router,
    private _documentFileService: DocumentFileService,
    private _controlService: ControlsService,
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
      NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any Sections added here!", subtitle: 'Add Section if there is any. To add, simply tap the button below. ', buttonText: 'Add New Section' });
      if (NoDataItemStore.clikedNoDataItem) {
        this.openSectionForm('Parent')
        NoDataItemStore.unSetClickedNoDataItem();
      }

      if(DocumentsStore.documentDetails && DocumentsStore.documentDetailsLoaded){
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
            this.downloadDocumentFile('document-version',DocumentsStore.documentDetails,this.findLatestDocument())

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
            DocumentsStore.enableButtons=true;        
            break;   

          case "view_mode":
            DocumentsStore.enableButtons=false;           
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

          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;


this.workflowUserEditModalSubscription=this._eventEmitterService.workflowUserAddModal.subscribe(res=>{
  this.getDocumentDetails();
})
this.workflowHistoryModalSubscription=this._eventEmitterService.historyPopup.subscribe(res=>{
  this.closeWorkflowHistory();
})
    this.sectionChildAddSubscription = this._eventEmitterService.addChildSection.subscribe(res => {
      this.openSectionForm(res.type, res.data)
    })

    this.controlModalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {

      this.closeBPMControlListModal();
      this._utilityService.detectChanges(this._cdr);
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup_temp.subscribe(item => {
      this.deleteSectionItems(item);
    })

    this.sectionChildDeleteSubscription = this._eventEmitterService.deleteChildSection.subscribe(res => {
      this.delete(res.contentId, res.type)
    })

    this.sectionChildEditSubscription = this._eventEmitterService.editTemplate_temp.subscribe(res => {
      this.editSection(res.id)
    })
    this.commentBoxSubscription=this._eventEmitterService.CommentBox.subscribe(res=>{
      this.getDocumentDetails();
    })
    // this.checkinFormSubscription = this._eventEmitterService.checkinModal.subscribe(res => {
      // * This is to reload the newly Checked in Document!.
      // this.dataChecked = false;
    // })

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

      if (res.type == 'save')
      {
        this.getDocumentContentDetails()
        this.closeSectionForm()
      }
      else if (res.type == 'cancel')
        this.closeSectionForm()
    })

    this.workflowSubmitModalSubscription = this._eventEmitterService.submitPopup.subscribe(res => { 
      this.closeSubmitPopup()
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
      this.openCheckListForm(data.contentId,data.checklistData)
    })

    this.addChildControlEventSubscription = this._eventEmitterService.addchildControl_temp.subscribe(data => {
      this.openBpmControlForm(data.contentId,data.checklistData)
    })

    this.deleteChildCheckListEventSubscription = this._eventEmitterService.deleteChildCheckList_temp.subscribe(data => {
      this.delete(data.checkListId, data.type, data.contentId,data.checklistData)
    })

    this.deleteChildControlEventSubscription = this._eventEmitterService.deleteChildControl_temp.subscribe(data => {
      this.delete(data.controlId, data.type, data.contentId,data.controlData)
    })
    this.updatePCDAEventSubscription = this._eventEmitterService.passPCDA_temp.subscribe(data => {
      this.updatePCDA(data.status,data.type,data.contentId)
    })
    this.updateCheckListEventSubsciprtion = this._eventEmitterService.passCheckList_temp.subscribe(data => {
      this.updateCheckList(data.contentId,data.checkListStatus)
    })

    this.addCheckListEvent = this._eventEmitterService.addCheckListModal_temp.subscribe(res => {
      this.closeChecklistModal();
    })

    this.childCommentBoxSubscription=this._eventEmitterService.openKHCommentBox.subscribe(res=>{
      this.openComment(res)
    })

    this.commentModalSubscription = this._eventEmitterService.commentModal.subscribe(res => {
      this.closeWorkflowAction();
      this.getHistory()
    })

    this.getHistory()

    this.setLeftMenuScroll()

  }

  setLeftMenuScroll(){
    setTimeout(() => {
      $(this.innerScroll?.nativeElement).mCustomScrollbar();
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }

  unSetLeftMenuScroll(){
    setTimeout(() => {
      $(this.innerScroll?.nativeElement).mCustomScrollbar("destroy");
      this._utilityService.detectChanges(this._cdr)
    }, 300);
  }

  getHistory(){
    this._documentWorkflowService.getWorkflowHistory().subscribe(res => {      
      this._utilityService.detectChanges(this._cdr)
    })
  }
  
  getDocumentData() {
    DocumentsStore.breadCrumbStatus = false;
    this._route.navigateByUrl("/knowledge-hub/documents");
  }

  openComment(contentId: number){

    AppStore.openCommentBox();
    CommentStore.module="KH"
    CommentStore.commentGetApi='/document-versions/' + `${DocumentsStore.documentVersionId}` + `/contents/` + contentId
    CommentStore.commentApi = `/document-version-contents/${contentId}`;
    CommentStore.commentObjectVariable = 'document_version_content_comment_id';
    this._utilityService.detectChanges(this._cdr);
  }


  setClass(dataId){

    this.scrollbyIndex(dataId)

    if(DocumentsStore.dataId==dataId){
      DocumentsStore.dataId==null
    }
    else
    DocumentsStore.dataId=dataId
    this._utilityService.detectChanges(this._cdr)

  }

  scrollbyIndex(index) {

    document.getElementById(index).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
}

downloadDocumentFile(type, documentFile, docs) {
  event.stopPropagation();
  switch (type) {
    case "document-file":
      this._documentFileService.downloadFile(
        type,
        documentFile.id,
        docs.id,
        null,
        documentFile.title,
        docs
      );
      break;
    case "document-version":
      this._documentFileService.downloadFile(
        type,
        documentFile.id,
        docs.id,
        null,
        documentFile.title,
        docs
      );
      break;
  }
}

findLatestDocument() {
  let data=DocumentsStore.documentDetails.versions
  for (let i = 0; i < data.length; i++){
    if (data[i].is_latest == 1)
      return data[i]
      break;
  }
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

  // Delete New Modal



  delete(id: number, type, contentId?,data?) {

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

    switch (this.deleteObject.itemType) {
      case 'Content':
        if (status && this.deleteObject.id) {
            this._documentContentService.delete(this.deleteObject.id).subscribe(resp => {
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
            this._documentNoteService.delete(this.deleteObject.id).subscribe(resp => {
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

      case 'CheckList':
        if (status && this.deleteObject.id) {
          // Removing from the checklist Array in store.
          var index = ContentStore.checklistToDisplay.indexOf(this.deleteObject.data);
          ContentStore.checklistToDisplay.splice(index, 1);
            this._documentCheckListService.delete(this.deleteObject.contentId, this.deleteObject.id).subscribe(resp => {
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
        case 'Controls':
          if (status && this.deleteObject.id) {
              this._documentService.deleteDocumentControl(this.deleteObject.contentId, this.deleteObject.id).subscribe(resp => {
                setTimeout(() => {
                  this.getDocumentDetails();
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

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.title = '';
    this.deleteObject.subtitle = '';
    this.deleteObject.type = '';
    this.deleteObject.contentId = null

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

  editSection(sectionId){
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
      document_version_id:DocumentsStore.documentVersionId
    }


    this._utilityService.detectChanges(this._cdr)
    $(this.notesFormModal.nativeElement).modal('show');
    // this.openNotesForm(contentId)
  }


// Section Form Starts Here

// Accepted Params ( type - Child/Parent , data - Data which is used to calculate/automate Section/Clause Number.)

openSectionForm(type,data?){

  if (type == 'Parent') {
    this.sourceParams = {
      documentVersionContentId: null,
    }
  }
  else { 

  // To Calculate/Automate section/clause number
    this.calculateClauseNumber(data,type)
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
      // this.scrollAfterAdd();
  }


  openCheckListForm(contentId, data?) {
    this.CheckListParams = {
      content_id: contentId,
      data:data
    }
    this._utilityService.detectChanges(this._cdr)
    $(this.checkListFormModal.nativeElement).modal('show');

  }

  closeCheckListForm() {
    this.CheckListParams = null;
    $(this.checkListFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
    // this.scrollAfterAdd();
  }

  closeChecklistModal() {
    this.CheckListParams = null;
    $(this.checkListFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
    // this.scrollAfterAdd();
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
    // console.log(ControlStore.selectedControlsList);
    ProcessStore.add_control_form_modal = false;
    $(this.bpmControlListFormModal.nativeElement).modal('hide');
    if(ControlStore.selectedControlsList.length)
    {
      if(JSON.stringify(this.controlModalParam.controls) != JSON.stringify(ControlStore.selectedControlsList))
      this.saveDocumentControls();
    }
    this._utilityService.detectChanges(this._cdr)
  }

  saveDocumentControls()
  {
    this._documentService.saveDocumentControl(this.getSaveData()).subscribe(res => {
      this.controlModalParam.content_id=null;
      this.getDocumentDetails();
      this._utilityService.detectChanges(this._cdr);
    })
    
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


  calculateClauseNumber(data, type) {

    ContentStore.editCheck = false;

    if (type == 'Parent') {
      let clauseNumber = data.length 
      ContentStore.clause_number = clauseNumber
    } 
    else {
      
    if (data.children ) {

      let childData=data.children
      let totalLength = childData.length + 1
      let nextClauseNumber
      if (data.clause_number == 0)
        nextClauseNumber = 0 + '.' + totalLength 
      else
      nextClauseNumber = data.clause_number + '.' + totalLength 
      ContentStore.clause_number=nextClauseNumber
      
    }
    else if (data.children_content) {
      let childData=data.children_content
      let totalLength = childData.length + 1

      let nextClauseNumber
      if (data.clause_number == 0)
        nextClauseNumber = 0 + '.' + totalLength 
      else
      nextClauseNumber = data.clause_number + '.' + totalLength 
      ContentStore.clause_number=nextClauseNumber
      }
    }
 
  }


 

  closeSectionForm() {
    this.sourceParams = null;
    $(this.sectionFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
    // this.scrollAfterAdd();
  }

  getPopupDetails(){    
    this.userDetailObject.id = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length-1]?.created_by;
    this.userDetailObject.first_name = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length-1]?.reviewed_user_first_name;
    this.userDetailObject.last_name = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length-1]?.reviewed_user_last_name;
    this.userDetailObject.designation = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length-1]?.reviewed_user_designation;
    this.userDetailObject.image_token = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length-1]?.reviewed_user_image_token;
    this.userDetailObject.email = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length-1]?.reviewed_user_email;
    this.userDetailObject.mobile = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length-1]?.reviewed_user_mobile;
    this.userDetailObject.department = this.DocumentWorkflowStore?.documentWorkflowHistory[this.DocumentWorkflowStore?.documentWorkflowHistory?.length-1]?.reviewed_user_department;
    //this.userDetailObject.created_at=details?.created_at;
    //this.userDetailObject.status_id = details?.status_id ? details?.status?.id : 1;

    return this.userDetailObject;
  }

  getFirstLevelDetails(details){    
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

  //Workflow popup section starts here
  openWorkflowPopup(type) {
    documentWorkFlowStore.type=type
    documentWorkFlowStore.commentForm = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.commentFormModal.nativeElement).modal('show');
  }

  closeCommentsForm() {
    this.getDocumentDetails();
    documentWorkFlowStore.type=null
    documentWorkFlowStore.commentForm = false;
    $(this.commentFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }


  // Button Permission Check Starts

  checkButtonPermissions(){    
    if(DocumentsStore.documentDetails?.document_status?.type=='in-review' ){
      this._documentWorkflowService.getWorkflow(DocumentsStore.documentId).subscribe(res=>{
        if(res)
        {
          DocumentsStore.enableButtons=this.isUser()
          DocumentsStore.enableChecklistPopup= this.isUser();
          DocumentsStore.enableWorkflow=this.isUser()
          this._utilityService.detectChanges(this._cdr);
        }

      })
    }else if(DocumentsStore.documentDetails?.document_status?.type=='draft'){
      this._documentWorkflowService.getWorkflow(DocumentsStore.documentId).subscribe(res=>{
        if(res)
        {
          DocumentsStore.enableButtons=this.draftUserCheck()
          DocumentsStore.enableChecklistPopup= this.isUser();
          DocumentsStore.enableWorkflow=false
          this._utilityService.detectChanges(this._cdr);
        }

      })
    }
    else{
      DocumentsStore.enableButtons=false;
      DocumentsStore.enableChecklistPopup=this.draftUserCheck();
      DocumentsStore.enableWorkflow=false
      this._utilityService.detectChanges(this._cdr);
    } 
    this._utilityService.detectChanges(this._cdr);
  }

  draftUserCheck(){
    if(DocumentsStore.documentDetails?.created_by?.id==AuthStore.user.id){
      return true
    }else{
      return false
    }
  }


// Button Permisson Check Ends


// SubMenu Action Starts

//Workflow popup section starts here
openWorkflowAction(type) {
  documentWorkFlowStore.type=type
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

openSubmitPopup(type) {

  if (type == 'Submit') {
    this.submitObject.buttonType = type;
    this.submitObject.subtitle = "It will send document for the review"
  }
  else {
    this.submitObject.buttonType = type;
    this.submitObject.subtitle="Are you sure you want to Checkout?"
  }
  
  documentWorkFlowStore.submitPopup = true;
  this._utilityService.detectChanges(this._cdr)
  $(this.workflowSubmitPopup.nativeElement).modal('show');
}
closeSubmitPopup() {
  setTimeout(() => {
    this.getDocumentDetails();
  }, 500);
  documentWorkFlowStore.submitPopup = false;
  $(this.workflowSubmitPopup.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr)
}

getDocumentDetails() {

  this._documentService.getItemById(DocumentsStore.documentId).subscribe(res => {
    if(res){
      // if(res.is_company_document ){
        res.versions.forEach(version=>{
          if(version.is_latest){
            DocumentsStore.documentVersionId=version.id
            DocumentsStore.versionNumber=version.version
            this.getDocumentContentDetails()
          }else
          DocumentsStore.documentVersionId=version.id
        })
      // }
      this.setSubMenuItems();
      this.checkButtonPermissions();
    }
    this._utilityService.detectChanges(this._cdr);
  })
}


openCheckinForm() {
  documentWorkFlowStore.checkinForm = true;
  this._utilityService.detectChanges(this._cdr)
  $(this.checkinDocumentPopup.nativeElement).modal('show');
}

closeCheckinForm() {
  this.getDocumentContentDetails();
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

showReviewUpdatePopup(){
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

showReviewHistoryPopup(){
  documentWorkFlowStore.showHistoryPopup = true;
  this._utilityService.detectChanges(this._cdr)
  $(this.reviewHistoryPopup.nativeElement).modal('show');
}

closeReviewHistoryPopup() {
  documentWorkFlowStore.showHistoryPopup = false;
  $(this.reviewHistoryPopup.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr)
}


showWorkflowPopup(){
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

// SubMenu Action Ends

  
  setStatusColor(){

    var className='status-tag-new-two'

    switch (DocumentsStore.documentDetails?.document_status?.type) {
      case 'draft':
        className=className+' '+'bg-grey'
        break;
      case 'in-review':
        className=className+' '+'bg-light-blue'
        break;
      case 'published':
        className=className+' '+'bg-green'
        break;
      case 'reverted':
        className=className+' '+'bg-orange'
        break;
      case 'rejected':
        className=className+' '+'bg-red'
         break;
      case 'archived':
        className=className+' '+'bg-yellow'
          break;
    
      default:
        break;
    }

    return className

  }
  isUser() {
    if(documentWorkFlowStore?.documentWorkflow_loaded){
      for (let i of documentWorkFlowStore?.documentWorkflow) {
        if (i.level == DocumentsStore.documentDetails.next_review_user_level) {
          var pos = i.document_workflow_item_users.findIndex(e => e.id == AuthStore.user.id)
          var status= i.document_workflow_item_users.findIndex(e => e.status.id == 1)
          if (pos != -1 && status!=-1)
            return true;
          else
            return false
        }
      }
    }
    else{
      return false;
    }
    
  }

  getDocumentContentDetails() {     
    this._documentContentService.getAllItems().subscribe(res => {
      this.calculateClauseNumber(res,'Parent')
         this._utilityService.detectChanges(this._cdr);
       }) 
  }


  setSubMenuItems() {
    // * Function to Check whether the loggined user exist in work-flow item Users.

    if (DocumentsStore.documentDetailsLoaded && DocumentsStore.documentDetails) {

      var subMenuItems = [      
        // { activityName: 'PREVIEW_DOCUMENT_VERSION_DOCUMENT_FILE', submenuItem: { type: 'download' } },
        { activityName: 'DOCUMENT_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
        { activityName: 'DOCUMENT_FREQUENT_REVIEW_UPDATE_LIST', submenuItem: { type: 'review_update' } },
        { activityName: null, submenuItem: { type: 'review' } },
        { activityName: null, submenuItem: { type: 'history' } },
        { activityName: null, submenuItem: { type: 'workflow' } },
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      //if these conditions match then we can push this submenus,this is for docs workflow
      if(this.isUser() && DocumentsStore.documentDetails?.document_status?.id  != 1 && DocumentsStore.documentDetails?.document_status?.id != 3 &&DocumentsStore.documentDetails?.document_status?.id != 7 && KHSettingStore.khSettingsItems?.knowledge_hub_setting_type?.type=='external'){
        subMenuItems.push(          
          { activityName: null, submenuItem: { type: 'approve' } },
          { activityName: null, submenuItem: { type: 'revert' } },
          { activityName: null, submenuItem: { type: 'reject' } },          
        )
      }
      if(DocumentsStore.documentDetails?.document_status?.type=='published'){
        subMenuItems.push(                    
          { activityName: null, submenuItem: { type: 'review_modal' } },
        )
      }
      switch (DocumentsStore.documentDetails?.document_status?.id) {

         // * Document is in Review.
        case 2:

        if(this.isUser())
          subMenuItems.push(
            { activityName: null, submenuItem: { type: 'view_mode' } },
            { activityName: null, submenuItem: { type: 'edit_mode' } },
          )
          // * Checking for whether Logged in User is equal to Current reviewer.
          // if (DocumentsStore.documentDetails?.is_locked) {
          //   if (DocumentsStore.documentDetails?.locked_by.id == AuthStore?.user?.id) {
          //     subMenuItems.push(
          //       { activityName: null, submenuItem: { type: 'checkin' } },
          //     )
          //   }                     
          // } else {      
          //   if (this.userMatch) {
          //     subMenuItems.push(
          //           { activityName: null, submenuItem: { type: 'checkout' } },
          //         )
          //   }
          // }      
        break;

        // * Document is in Draft | Reverted 
        case 1:
        case 3:
          // * 1.Checking if Logged in User is same as Document Created by User
          // * 2.Checkin if the Document is Company Document
          // * 3.Checkin if Worklfow is Enabled for Document.
          if (DocumentsStore.documentDetails?.is_company_document && DocumentsStore.documentDetails?.is_workflow) {
            
            if (DocumentsStore.documentDetails?.is_locked) {
              // if (this.userMatch) {
                // * Checking if User Match to set Submit Button
              subMenuItems.push(
                { activityName: 'SUBMIT_DOCUMENT', submenuItem: { type: 'submit' } },
              )
              // }
              if (DocumentsStore.documentDetails.locked_by.id == AuthStore?.user?.id) {
                // * Checking for whether Logged in User is equal to Locked by User 
                subMenuItems.push(
                  // { activityName: null, submenuItem: { type: 'checkin' } },
                  // { activityName: null, submenuItem: { type: 'edit_modal' } },
                )
              }
            } else {
              // if (this.userMatch) {
                subMenuItems.push(
                    
                  { activityName: 'SUBMIT_DOCUMENT', submenuItem: { type: 'submit' } },
                  // { activityName: null, submenuItem: { type: 'edit_modal' } },
                  // { activityName: null, submenuItem: { type: 'checkout' } },
                      )
              // }
            
            }
          } else {
            subMenuItems.push(
                    
              // { activityName: null, submenuItem: { type: 'edit_modal' } },
                  )
          }


        break;
      
        default:
          break;
        
      }
      this._helperService.checkSubMenuItemPermissions(700, subMenuItems);
    }
  }





  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();

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
    this.modalTypeSubscription.unsubscribe();
    this.updateCheckListEventSubsciprtion.unsubscribe();
    this.updatePCDAEventSubscription.unsubscribe();
    this.addCheckListEvent.unsubscribe();
    this.workflowSubmitModalSubscription.unsubscribe();
    this.workflowUserEditModalSubscription.unsubscribe();
    this.workflowHistoryModalSubscription.unsubscribe();
    this.controlModalEventSubscription.unsubscribe();
    this.addChildControlEventSubscription.unsubscribe();
    this.deleteChildControlEventSubscription.unsubscribe();
    this.ContentStore.clearContentList();
    DocumentsStore.clearParentAccessData();
    DocumentsStore.unsetDocumentDetails();
    ContentStore.clearContentList();
    ContentStore.clearIndividualList();
    ContentStore.clearCheckList();
    ContentStore.clearNotes();
    documentWorkFlowStore.unsetDocumentWorkflow();
    documentWorkFlowStore.unsetWorkflowHistory();
    this.unSetLeftMenuScroll()
    ControlStore.unSelectControls();
    DocumentsStore.documentVersionId=null;
    DocumentsStore.documentId=null;
  }
}
