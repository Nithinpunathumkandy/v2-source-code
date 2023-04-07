import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MdlService } from 'src/app/core/services/knowledge-hub/mdl/mdl.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MasterListDocumentStore } from 'src/app/stores/knowledge-hub/master-list-document/masterListDocument.store';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store';
import { DocumentContentService } from 'src/app/core/services/knowledge-hub/documents/document-content.service';
import { DocumentNotesService } from 'src/app/core/services/knowledge-hub/documents/document-notes.service';
import { DocumentChecklistService } from 'src/app/core/services/knowledge-hub/documents/document-checklist.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { element } from 'protractor';
// import { join } from 'path';
declare var $: any;

@Component({
  selector: 'app-master-details-info',
  templateUrl: './master-details-info.component.html',
  styleUrls: ['./master-details-info.component.scss']
})


export class MasterDetailsInfoComponent implements OnInit {


  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
    // Left Side Details Required Files Starts
    
    @ViewChild('sideBarRound', { static: true }) sideBarRound: ElementRef;
    @ViewChild('curveToggle') curveToggle: ElementRef;
    @ViewChildren('userSideBar') userSideBar: QueryList<ElementRef>;
    @ViewChild('userRightDetails') userRightDetails: ElementRef;
  
    // Left Side Details Required Files Ends
  
  
    @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
    @ViewChild("supportFileDetailArea", { static: false }) supportFileDetailArea: ElementRef;
    @ViewChild('supportFileViewMorePreviewArea', { static: false }) supportFileViewMorePreviewArea: ElementRef;
    @ViewChild('documentAddModal')documentAddModal:ElementRef;
    @ViewChild('renewDocForm')renewDocForm:ElementRef;
    @ViewChild('historyPopup')historyPopup:ElementRef;
    @ViewChild("innerScroll", { static: false }) innerScroll: ElementRef;
    
  @ViewChild('sectionFormModal', { static: true }) sectionFormModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('notesFormModal') notesFormModal: ElementRef;
  @ViewChild('checkListFormModal') checkListFormModal: ElementRef;

    sideCollapsed: boolean = false;
    view_more_purpose: boolean = false;
    view_more_description: boolean = false;
    previewUrl:any;
    
    sourceParams: any;
    CheckListParams: any;
    NotesParam: any;

    showPDF:boolean;
    showContent: boolean;
    disableSearch: boolean = true;

    AuthStore = AuthStore;
    AppStore=AppStore;
    MasterListDocumentStore=MasterListDocumentStore
    SubMenuItemStore = SubMenuItemStore;
    reactionDisposer: IReactionDisposer;
    DocumentsStore=DocumentsStore;
    ContentStore=ContentStore;
    OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
    renewDocumentSubscriptionEvent:any
    documentUpdateSubscriptionEvent:any
    documentHistorySubscriptionEvent:any
    sectionChildAddSubscription: any;
    deleteEventSubscription: any;
    sectionChildDeleteSubscription: any;
    sectionChildEditSubscription: any;
    commonModalEventSubscription: any;
    childNotesEventSubscription: any;
    editChildNoteEventSubscription: any;
    deleteChildNoteEventSubscription: any;
    addChildCheckListEventSubscription: any;
    deleteChildCheckListEventSubscription: any;
    updatePCDAEventSubscription: any;
    updateCheckListEventSubsciprtion: any;
    addCheckListEvent: any;
    modalTypeSubscription: any;

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
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
    created_at:''    
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
  };

  MasterDocumentObject = {
    values: null,
    type:null
  }

  ListArray:any=[];
  collectionArray:any=[];

  constructor(
    private _renderer2: Renderer2,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _sanitizer: DomSanitizer,
    private _masterDocumnentService:MdlService,
    private route: ActivatedRoute,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _fileUploadPopupService:FileUploadPopupService,
    private _documentContentService: DocumentContentService,
    private _documentNoteService: DocumentNotesService,
    private _documentCheckListService:DocumentChecklistService,
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      let id: number;
      id = +params['id']; // (+) converts string 'id' to a number
      MasterListDocumentStore.documentId = id;
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

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "review_doc":
            setTimeout(() => {
              this.openRenewDocPopup()
            }, 500);
            break;
            case "history":
              setTimeout(() => {
                this.openHistoryPopup()
              }, 500);
              break;
            case "edit_modal":
              setTimeout(() => {
                this.setUpdateData()
              }, 500);
              break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.renewDocumentSubscriptionEvent=this._eventEmitterService.DocumentRenewModal.subscribe(res=>{
      this.getDocumentDetails();
      this.closeRenewDocPopup()
    })

    this.documentUpdateSubscriptionEvent=this._eventEmitterService.MasterListDocumentAddModal.subscribe(res=>{
      this.getDocumentDetails();
      this.closeFormModal();
    })

    this.documentHistorySubscriptionEvent=this._eventEmitterService.DocumentHistoryModal.subscribe(res=>{
      this.closeHistoryPopup();
    })

    this.sectionChildAddSubscription = this._eventEmitterService.addChildSection.subscribe(res => {
      this.openSectionForm(res.type, res.data)
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
        this.closeSectionFormModal()
      }
      else if (res.type == 'cancel')
        this.closeSectionFormModal()
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
    this.addChildCheckListEventSubscription = this._eventEmitterService.addchildCheckList_temp.subscribe(data => {
      this.openCheckListForm(data.contentId,data.checklistData)
    })

    this.deleteChildCheckListEventSubscription = this._eventEmitterService.deleteChildCheckList_temp.subscribe(data => {
      this.delete(data.checkListId, data.type, data.contentId,data.checklistData)
    })
    this.updatePCDAEventSubscription = this._eventEmitterService.passPCDA_temp.subscribe(data => {
      this.updatePCDA(data.status,data.type,data.contentId)
    })
    this.updateCheckListEventSubsciprtion = this._eventEmitterService.passCheckList_temp.subscribe(data => {
      this.updateCheckList(data.contentId,data.checkListStatus)
    })

    this.addCheckListEvent = this._eventEmitterService.addCheckListModal_temp.subscribe(res => {
      this.closeCheckListForm();
    })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.selectedTab('picture')
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  // * Document Review  Form
  openRenewDocPopup() {
    MasterListDocumentStore.renewPopup = true;
    setTimeout(() => {
      $(this.renewDocForm.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr)
  }

  // * Document  Review Form Close 

  closeRenewDocPopup() {
    $(this.renewDocForm.nativeElement).modal('hide');
    MasterListDocumentStore.renewPopup = false;
  }
  // Document History Popup
  openHistoryPopup() {

  setTimeout(() => {
    MasterListDocumentStore.documentHistoryPopup = true;
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.historyPopup.nativeElement, 'display', 'block');
    this._renderer2.removeAttribute(this.historyPopup.nativeElement, 'aria-hidden');
    setTimeout(() => {
      this._renderer2.addClass(this.historyPopup.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 50);
  }, 100);
  }

  // Document History Popup
  closeHistoryPopup() {

    setTimeout(() => {
      MasterListDocumentStore.documentHistoryPopup = false;
			document.body.classList.remove('modal-open')
			this._renderer2.setStyle(this.historyPopup.nativeElement, 'display', 'none');
			this._renderer2.setAttribute(this.historyPopup.nativeElement, 'aria-hidden', 'true');
			$('.modal-backdrop').remove();
			setTimeout(() => {
				this._renderer2.removeClass(this.historyPopup.nativeElement, 'show')
				this._utilityService.detectChanges(this._cdr)
			}, 50);
		}, 100);
  }

  getDocumentDetails() {

    this._masterDocumnentService.getItemById(MasterListDocumentStore.documentId).subscribe(res => {
      if(res){

          res.versions.forEach(version=>{
            if(version.is_latest){
              MasterListDocumentStore.documentVersionId=version.id
              MasterListDocumentStore.versionNumber=version.version
              DocumentsStore.documentVersionId=version.id
              this.getDocumentContentDetails()
              this.getDocumentPreview(version.title)
            }else
            MasterListDocumentStore.documentVersionId=version.id
            DocumentsStore.documentVersionId=version.id
          })
        this.setSubMenuItems();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDocumentContentDetails() {     
    this._documentContentService.getAllItems().subscribe(res => {
      this.calculateClauseNumber(res,'Parent')
         this._utilityService.detectChanges(this._cdr);
       }) 
  }



  setUpdateData() {
    this._masterDocumnentService.getItemById(MasterListDocumentStore.documentId).subscribe(res => {
      // setTimeout(() => {
      //   this.setDocuments(res.versions)
      // }, 200);

      var MasterDocumentDetails = res
      this.MasterDocumentObject.values = {
        id: MasterDocumentDetails.id,
        reference_code:MasterDocumentDetails.reference_code?MasterDocumentDetails.reference_code:'',
        description:MasterDocumentDetails.description?MasterDocumentDetails.description:'',
        title: MasterDocumentDetails.title?MasterDocumentDetails.title:'',
        version:MasterDocumentDetails.versions[MasterDocumentDetails.versions.length-1].version,
        document_type:MasterDocumentDetails.document_type?MasterDocumentDetails.document_type:'',
        document_review_frequency_id:MasterDocumentDetails.document_review_frequency?MasterDocumentDetails.document_review_frequency:'',
        review_user_ids:MasterDocumentDetails?.review_users?MasterDocumentDetails.review_users:'',
        organizations: MasterDocumentDetails?.organizations?MasterDocumentDetails.organizations:'',
        divisions: MasterDocumentDetails?.divisions?MasterDocumentDetails.divisions:'',
        departments: MasterDocumentDetails?.departments?MasterDocumentDetails.departments:'',
        sections: MasterDocumentDetails.sections?MasterDocumentDetails.sections:'',
        sub_sections: MasterDocumentDetails.sub_sections?MasterDocumentDetails.sub_sections:'',
        issue_date: MasterDocumentDetails?.issue_date?MasterDocumentDetails?.issue_date:'',

      }

      if(MasterDocumentDetails.versions.length > 0){
        for(let documents of MasterDocumentDetails.versions){
          if(documents.is_latest){
            let purl = this._documentFileService.getThumbnailPreview('document-version', documents.token)
            let brochureDetails = {
                name: documents.title, 
                ext: documents.ext,
                size: documents.size,
                url: documents.url,
                thumbnail_url: documents.url,
                token: documents.token,
                preview_url: purl,
                id: documents.id
            };
            this._masterDocumnentService.setDocument(brochureDetails,purl);
          }
        }
      }

      this.MasterDocumentObject.type = 'Edit';
     this.openFormModal();
      this._utilityService.detectChanges(this._cdr);
    
    })
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

   // Fix For Modal Issue

   openFormModal() {
     MasterListDocumentStore.addDocumentPopup=true;
    setTimeout(() => {
      $(this.documentAddModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    this.MasterDocumentObject.type = null;
    this.MasterDocumentObject.values = null;
    setTimeout(() => {
      $(this.documentAddModal.nativeElement).modal('hide');
    }, 100);
    MasterListDocumentStore.addDocumentPopup=false;
    this._utilityService.detectChanges(this._cdr);
  }
  
  setDocuments(documents){

    let khDocuments = [];
    documents.forEach(element => {

      if(element.is_latest){
        var purl = this._documentFileService.getThumbnailPreview('document-version', element.token)
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
          this._fileUploadPopupService.setSystemFile(lDetails, purl)
      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments=[...fileUploadPopupStore.getKHFiles,...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  setSubMenuItems() {

    if (MasterListDocumentStore.documentDetailsLoaded && MasterListDocumentStore.documentDetails) {
  
      var subMenuItems = [  

        {activityName: null, submenuItem: { type: 'history' } },
        {activityName: null, submenuItem: {type: 'close',path:'../'}},

      ]

      // Checks for any avaiable review users matches with logined user.
      if(this._helperService.getArrayProcessed(MasterListDocumentStore.documentDetails.review_users,'id').includes(AuthStore.user.id)){
        if(this.enableReviewButton())
        subMenuItems.push({
          activityName: null, submenuItem: { type: 'review_doc' } 
        })
      }

      if(MasterListDocumentStore.documentDetails.created_by.id==AuthStore.user.id){
        DocumentsStore.enableButtons=true;
        subMenuItems.push({
          activityName: null, submenuItem: { type: 'edit_modal' } 
        })
      }

      this._helperService.checkSubMenuItemPermissions(700, subMenuItems);
    }
  }


  enableReviewButton(){
    let notifyCount:number=5;
      if(this._helperService.getDateDifference(MasterListDocumentStore.documentDetails.next_review_date)<=notifyCount){
       return true
      }else{
        return false
      }
  }



  // User Left Bar Collpase and UnCollapse Function
  collapseSide(disableSideBarRound?:boolean) {
    if (!this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      setTimeout(() => {
        this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
        this._renderer2.addClass(this.userRightDetails.nativeElement, 'flex-98-width');
      }, 150);
      if(!disableSideBarRound){
        this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'block');
        this._renderer2.addClass(this.sideBarRound.nativeElement, 'tActive');
        this._renderer2.setStyle(this.sideBarRound.nativeElement, 'position', 'fixed');
        this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index','99999');
      }

      this.sideCollapsed = true;
    }else if (this.sideCollapsed && disableSideBarRound){
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'none');
      this._renderer2.removeClass(this.sideBarRound.nativeElement, 'tActive');
    }
  }

    // extension check function
    checkExtension(ext, extType) {
      return this._imageService.checkFileExtensions(ext, extType)
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
  getPopupDetails(details?){

    
      this.userDetailObject.id = details?.id;
      this.userDetailObject.first_name = details?.created_by?.first_name;
      this.userDetailObject.last_name = details?.created_by?.last_name;
      this.userDetailObject.designation = details?.created_by?.designation;
      this.userDetailObject.image_token = details?.created_by?.image?.token;
      this.userDetailObject.email = details?.created_by?.email;
      this.userDetailObject.mobile = details?.created_by?.mobile;
      this.userDetailObject.department = details?.department ? details?.created_by_department : null;
      this.userDetailObject.created_at=details?.created_at;
    

    return this.userDetailObject;
  }



    //Returns default image, if no image is present
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }
  
    createImageUrl(type, token, h?, w?) {
      return this._documentFileService.getThumbnailPreview(type,token,h,w);
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
      
        default:
          break;
      }
      
  
  
      this._utilityService.detectChanges(this._cdr);
    }

  getFormattedName(objectA, objectB, items) {
    if (items && items.length > 0 && items[0].hasOwnProperty(objectA) && items[0].hasOwnProperty(objectB)) {

      let result = items.map(val => {
        return val[objectA] + ' ' + val[objectB]
      }).join(',');
      return result
    }
    {
      return AppStore.noContentText;
    }
  }

    getStringData(p) {
      var stringContent = p.substring(0,200)+'...';
      return stringContent;
    }
    
getDocumentPreview(documentTitle){
  this._documentFileService.getFilePreview('document-version',MasterListDocumentStore.documentId,MasterListDocumentStore.documentVersionId).subscribe((res) => {
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

  

    openPreviewModal(type, filePreview, documentFiles, document) {
      this.previewObject.component = type
  
  
      let previewItem = null;
      if (filePreview) {
        previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
        this.previewObject.preview_url = previewItem;
        this.previewObject.file_details = documentFiles;
        this.previewObject.componentId = document.id;
  
  
        this.previewObject.uploaded_user = MasterListDocumentStore.documentDetails.created_by;
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
      event.stopPropagation();
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
            document.related_document_id,
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
          this._utilityService.detectChanges(this._cdr)
        }, 300);
     
      }
  
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

  this.openSectionFormModal();

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
      data:data
    }
    this._utilityService.detectChanges(this._cdr)
    $(this.checkListFormModal.nativeElement).modal('show');

  }

  closeCheckListForm() {
    this.CheckListParams = null;
    $(this.checkListFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }


  // Form Modal for Edit/Add
  openSectionFormModal() {
    this._utilityService.detectChanges(this._cdr)
    $(this.sectionFormModal.nativeElement).modal('show');
  }

  closeSectionFormModal() {
    this.sourceParams = null;
    $(this.sectionFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)

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
    this.openSectionFormModal();
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


setAccordion(index,type){

  let parentIndex

  if(type=='parent'){
     parentIndex=index
  }
  console.log(index)
  console.log(parentIndex)


  // Checking with 'accordionActive' property to handle accordion arrows icon.

  let actionData=ContentStore.ContentList[index]
  if(actionData.is_accordion_active==true)
  actionData.is_accordion_active=false
  else
  actionData.is_accordion_active=true


}


setIndex(parentIndex,childIndex?)
{
let actionData=childIndex?ContentStore.ContentList[parentIndex]['children_content'][childIndex]:ContentStore.ContentList[parentIndex]
if(actionData.is_accordion_active==true)
  actionData.is_accordion_active=false
  else
  actionData.is_accordion_active=true
}

  applyFilter(sarchItem){
    
    if(!sarchItem){
      this.ListArray=JSON.parse(JSON.stringify(ContentStore.ContentList));
    }else{
      let AllListArray=JSON.parse(JSON.stringify(ContentStore.ContentList));
      this.collectionArray=[];

      //frist arry collection
      AllListArray.filter(element=>{
        if(!element.title.toLowerCase().search(sarchItem.toLowerCase())){
          this.collectionArray.push(element);
        }
        
        if(element.children_content.length>0){
          element.children_content.filter(elementChildern=>{
            if(!elementChildern.title.toLowerCase().search(sarchItem.toLowerCase())){
              this.collectionArray.push(elementChildern);
            }

            this.loopUp(elementChildern.children,sarchItem);//childern, sarchItem

          });
        }
      });


      //final result array
      this.ListArray=this.collectionArray.filter(element => {
      
        if(!element.title.toLowerCase().search(sarchItem.toLowerCase())){
          return element;
        }
    });
    }

  }

  loopUp(children,sarchItem){//childern, sarchItem
    
    let loopArray=[];
    if(children.length>0){
      children.filter(element=>{
        if(!element.title.toLowerCase().search(sarchItem.toLowerCase())){
          this.collectionArray.push(element);
        }

        if(element.children.length>0){
          loopArray=loopArray.concat(element.children);
        }
      });
    }
  
    if(loopArray.length!=0) this.loopUp(loopArray,sarchItem);
  }

    ngOnDestroy() {

      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
      this.renewDocumentSubscriptionEvent.unsubscribe();
      this.documentUpdateSubscriptionEvent.unsubscribe();
      this.documentHistorySubscriptionEvent.unsubscribe();
      this.sectionChildAddSubscription.unsubscribe();
      this.deleteEventSubscription.unsubscribe();
      this.sectionChildDeleteSubscription.unsubscribe();
      this.sectionChildEditSubscription.unsubscribe();
      this.commonModalEventSubscription.unsubscribe();
      this.childNotesEventSubscription.unsubscribe();
      this.editChildNoteEventSubscription.unsubscribe();
      this.deleteChildNoteEventSubscription.unsubscribe();
      // this.modalStyleEventSubscription.unsubscribe();
      this.addChildCheckListEventSubscription.unsubscribe();
      this.deleteChildCheckListEventSubscription.unsubscribe();
 
      ContentStore.clearContentList();
      ContentStore.clearIndividualList();
      ContentStore.clearCheckList();
      ContentStore.clearNotes();
      MasterListDocumentStore.unsetDocumentDetails();
      MasterListDocumentStore.documentVersionId=null;
      MasterListDocumentStore.documentId=null;
  
    }

}
