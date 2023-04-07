import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { AppStore } from 'src/app/stores/app.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { DocumentTypesService } from 'src/app/core/services/masters/knowledge-hub/document-types/document-types.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { DocumentTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-types-store';
import { Router } from '@angular/router';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';


declare var $: any;
@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.scss'],
  host: {
    "(window:click)": "onClick()"
  }
})
export class DocumentsListComponent implements OnInit {

  @ViewChild("plainDev") plainDev: ElementRef;
  @ViewChild("navBar") navBar: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("folderRename") folderRename: ElementRef;
  @ViewChild("options") options: ElementRef;
  @ViewChild("documentSearch") documentSearch: ElementRef;
  @ViewChild('folderModal', { static: true }) folderModal: ElementRef;
  @ViewChild('quickUpload', { static: true }) quickUpload: ElementRef;
  @ViewChild("folderDetails") folderDetails: ElementRef;
  @ViewChild("shareDataPopup") shareDataPopup: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  DocumentsStore = DocumentsStore;
  AuthStore = AuthStore;
  DocumentTypeMasterStore = DocumentTypeMasterStore;

  restoreFlag: boolean = false;
  activeBreadCrumbID: number;
  activeIndex = null;
  show: boolean = false;
  optionsMenu: boolean = false;
  documentTypeList: boolean = false;
  enableSearchPopup: boolean = false;
  enableFolderDetailsPopup: boolean = false;

  folderRenameModalSubscription: any;
  filterSubscription: any;
  deleteEventSubscription: any;
  searchDataSubscription: any;
  folderFormSubscription: any;

  popupObject = {
    title: 'Delete',
    id: null,
    subtitle: '',
    type: '',
    itemType: ''
  };
  folderRenameObject = {
    status: true,
    title: ''
  }
  folderObject = {
    values: null,
    type: null
  }

  documentEmptyList = "No Documents Available"
  selectedDocId: number;
  selectedDocVersionId: number;
 enableShareDataPopup : boolean = false;
  shareDataSubscription: any;

  constructor(
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private documentsService: DocumentsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _documentTypeService: DocumentTypesService,
    private _imageService: ImageServiceService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.DocumentsStore.documentsLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    AppStore.showDiscussion = false;

    this.reactionDisposer = autorun(() => {


      this.addSubmenu()
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "grid":
            this.setListStyle("grid");
            break;
          case "table":
            this.setListStyle("table");
            break;

          case "refresh":
            SubMenuItemStore.searchText = '';
            DocumentsStore.searchText = '';
            if (DocumentsStore.documentId) {
              DocumentsStore.documentsLoaded = false;
              this.documentsService.getItemsInFolder(false, null, DocumentsStore.documentId).subscribe(res => {
                this._utilityService.detectChanges(this._cdr)
              })
            }
            else
              this.listDocuments(DocumentsStore.selectedSideMenu)
            break;
          case "new-folder":
            setTimeout(() => {
              this.folderObject.type = 'Add'
              this.folderObject.values = null
              this._utilityService.detectChanges(this._cdr);
              this.openFolderForm();
            }, 500);
            break;

          case "file-upload":
            setTimeout(() => {
              this.openDocumentForm()
            }, 500);
            break;

          // case "quick-upload":
          //   setTimeout(() => {
          //     this.openQuickUploadForm();
          //   }, 500);

          //   break;
          case "doc_search":
            this.openSearchPopup()
            break;
          case "template":
            this.documentsService.generateTemplate();
            break;
          case "export_to_excel":
            this.documentsService.exportToExcel();
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    SubMenuItemStore.setNoUserTab(true);

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, "height", "auto");
      window.addEventListener("scroll", this.scrollEvent, true);
    }, 1000);


    this.folderFormSubscription = this._eventEmitterService.commonModal.subscribe((res: any) => {
      if (res == 'cancel')
        this.closeFolderForm();
      else if (DocumentsStore.folderId) {
        this.documentsService.getItemsInFolder(false, '', DocumentsStore.documentId).subscribe(res => {
          this._utilityService.detectChanges(this._cdr)
        })
        this.closeFolderForm();
      }
      else if (DocumentsStore.documentTypeId)
        this.listDocuments('doc_type', false, DocumentsStore.documentTypeId, DocumentsStore.selectedSideMenu)
      else {
        this.listDocuments(DocumentsStore.selectedSideMenu);
        this.closeFolderForm();
      }


    })

    this.folderRenameModalSubscription = this._eventEmitterService.folderRenameModal.subscribe(res => {

      if (res == 'cancel')
        this.closeFolderRenameForm();
      else if (DocumentsStore.documentId) {
        this.documentsService.getItemsInFolder(false, '', DocumentsStore.documentId).subscribe(res => {
          this._utilityService.detectChanges(this._cdr)
        })
        this.closeFolderRenameForm();
      }
      else {
        this.listDocuments(DocumentsStore.selectedSideMenu);
        this.closeFolderRenameForm();
      }

    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.searchDataSubscription = this._eventEmitterService.searchData.subscribe(res => {
      if (!DocumentsStore.breadCrumbItemCheck)
        this.gotoFolder(res.folderStatus, res.docId, res.docTitle)
      this.closeSearchPopup()
    })


    this.shareDataSubscription = this._eventEmitterService.sharePopup.subscribe(item => {
      ShareItemStore.shareData? this.openShareDataPopup() : this.closeShareDataModel();
    })





    this.listDocumentTypes()
    RightSidebarLayoutStore.filterPageTag = 'document-list';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'document_type_ids',
      'document_access_type_ids',
      'document_status_ids',
      'is_new',
      'is_recent',
      'is_starred',
      // 'document_list',
      'created_by_user_ids',
      'document_category_ids',
      'document_sub_category_ids',
      'document_sub_sub_category_ids',
      'document_family_ids',
      'region_ids',
      'country_ids',
      'is_master_document_list',
      'is_trashed'
    ]);
    this.pageChange(1)
  }

  //To Set the Listing Type

  setListStyle(type) {
    if (type == "grid") DocumentsStore.listStyle = type;
    if (type == "table") DocumentsStore.listStyle = type;
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, "height", "45px");
        this._renderer2.addClass(this.navBar.nativeElement, "affix");
      } else {
        this._renderer2.setStyle(this.plainDev.nativeElement, "height", "auto");
        this._renderer2.removeClass(this.navBar.nativeElement, "affix");
      }
    }
  };

  // * Listing Different Document Types
  listDocumentTypes() {

    this._documentTypeService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })

  }
  // * To Set the Dropdown in  Left Side Menu of Document Types
  showDocumentTypes() {

    if (this.documentTypeList == false)
      this.documentTypeList = true;
    else
      this.documentTypeList = false;

  }


  //Getting Default Image and Thumnail Preview 
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  createImageUrl(type, token, h?, w?) {
    return this._documentFileService.getThumbnailPreview(type, token, h, w);
  }



  // * To Open Right Click Menu Option

  openOptions(event, index) {
    event.stopPropagation();
    event.preventDefault();
    this.optionsMenu = true;
    if (this.activeIndex >= 0 && this.activeIndex == index) {
      this.activeIndex = null;
      this.show = false;
    } else {
      this.activeIndex = index;
      this.show = true;
      if (this.options) {
        this._renderer2.setStyle(
          this.options.nativeElement,
          "display",
          "block"
        );
      }
    }
  }

  // * To Disable Right Click Menu on Click's
  onClick() {

    this.activeIndex = null;

  }

  // * To Star(Favourite) a Document.

  starDocument(isFolder, isStarred, docId) {
    event.stopPropagation();

    if (isFolder) {
      if (isStarred)
        this.documentsService.unStarFolder(docId).subscribe(res => {
          if (DocumentsStore.documentId)
            this.documentsService.getItemsInFolder(false, null, DocumentsStore.documentId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr)
            })
          else
            this.listDocuments(DocumentsStore.selectedSideMenu, false, DocumentsStore.documentTypeId)
        })
      else
        this.documentsService.starFolder(docId).subscribe(res => {
          if (DocumentsStore.documentId)
            this.documentsService.getItemsInFolder(false, null, DocumentsStore.documentId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr)
            })
          else
            this.listDocuments(DocumentsStore.selectedSideMenu, false, DocumentsStore.documentTypeId)
        })
    } else {

      if (isStarred)
        this.documentsService.unStarDocument(docId).subscribe(res => {
          if (DocumentsStore.documentId)
            this.documentsService.getItemsInFolder(false, null, DocumentsStore.documentId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr)
            })
          else
            this.listDocuments(DocumentsStore.selectedSideMenu, false, DocumentsStore.documentTypeId)
        })
      else
        this.documentsService.starDocument(docId).subscribe(res => {
          if (DocumentsStore.documentId)
            this.documentsService.getItemsInFolder(false, null, DocumentsStore.documentId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr)
            })
          else
            this.listDocuments(DocumentsStore.selectedSideMenu, false, DocumentsStore.documentTypeId)
        })

    }

  }


  // * Listing Documents Based on Different Type

  listDocuments(sideMenuType, rootCheck?: boolean, docTypeId?, doctypeTitle?) {

    DocumentsStore.documentId = null;
    DocumentsStore.folderId = null;
    DocumentsStore.clearParentAccessData();

    DocumentsStore.itemsPerPage = 24;

    // *Seting Document Type Id
    DocumentsStore.documentTypeId = docTypeId

    // * Saving Pagination Value of Root
    if (DocumentsStore.rootCurrentPage && rootCheck) {
      DocumentsStore.currentPage = DocumentsStore.rootCurrentPage
    }

    // * If Different Submenu is selected reseting currentPage to 1
    if (DocumentsStore.selectedSideMenu != sideMenuType)
      DocumentsStore.currentPage = 1;

    DocumentsStore.documentsLoaded = false;
    // * Setting SideMenu Type to highlight the selected menu 
    if (sideMenuType == 'doc_type') {
      DocumentsStore.selectedSideMenu = doctypeTitle
      DocumentsStore.selectedSideMenuType = 'doc_type'
    }

    else {
      DocumentsStore.selectedSideMenuType = 'other'
      DocumentsStore.selectedSideMenu = sideMenuType
    }


    this.restoreFlag = false;
    // * Clearing breadcrumb data for root listing.
    if (rootCheck) {
      DocumentsStore.clearBreadCrumb();
      DocumentsStore.breadCrumbStatus = false;
    }


    switch (sideMenuType) {
      case "recent":
        if(DocumentsStore.listStyle)
        this.setListStyle(DocumentsStore.listStyle)
        else
        this.setListStyle('grid')
        this.addSubmenu();
        this.documentsService.getAllItems("/recent?is_not_master_document_list&").subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });

        break;

      case "starred":
        if(DocumentsStore.listStyle)
        this.setListStyle(DocumentsStore.listStyle)
        else
        this.setListStyle('grid')
        this.addSubmenu();
        this.documentsService
          .getAllItems("/starred?is_not_master_document_list&")
          .subscribe((res) => {
            this._utilityService.detectChanges(this._cdr);
          });

        break;

      case "new":
        if(DocumentsStore.listStyle)
        this.setListStyle(DocumentsStore.listStyle)
        else
        this.setListStyle('grid')
        this.addSubmenu();
        this.documentsService.getAllItems("/new?is_not_master_document_list&").subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });

        break;

      case "trash":
        if(DocumentsStore.listStyle)
        this.setListStyle(DocumentsStore.listStyle)
        else
        this.setListStyle('grid')
        this.addSubmenu();
        this.restoreFlag = true;
        this.documentsService.getAllItems("/trash?is_not_master_document_list&").subscribe((res) => {
          DocumentsStore.documentId = null;
          this._utilityService.detectChanges(this._cdr);
        });

        break;

      case "doc_type":
        if(DocumentsStore.listStyle)
        this.setListStyle(DocumentsStore.listStyle)
        else
        this.setListStyle('grid')
        this.addSubmenu();
        this.documentsService.getAllItems(`?document_type_ids=${docTypeId}&is_not_master_document_list&`).subscribe((res) => {
          DocumentsStore.documentId = null;
          this._utilityService.detectChanges(this._cdr);
        });

        break;

      case "public":

        if(DocumentsStore.listStyle)
        this.setListStyle(DocumentsStore.listStyle)
        else
        this.setListStyle('grid')
        this.addSubmenu();
        this.documentsService.getAllItems("/public?public_root=true&is_not_master_document_list&").subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });

        break;

      case "private":
        if(DocumentsStore.listStyle)
        this.setListStyle(DocumentsStore.listStyle)
        else
        this.setListStyle('grid')
        this.addSubmenu();
        this.documentsService.getAllItems("/private?root=true&is_not_master_document_list&").subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });

        break;

      case "shared":
        if(DocumentsStore.listStyle)
        this.setListStyle(DocumentsStore.listStyle)
        else
        this.setListStyle('grid')
        this.addSubmenu();
        this.documentsService.getAllItems("/shared?shared_root=true&is_not_master_document_list&").subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });

        break;

      case "review":
        if(DocumentsStore.listStyle)
        this.setListStyle(DocumentsStore.listStyle)
        else
        this.setListStyle('grid')
        this.addSubmenu();
        this.documentsService.getAllItems("/in-review?in_review_root=true&is_not_master_document_list&is_pending_review=1&").subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });

        break;

      case "master":
        //  To remove Table/Grid View from submenu and enabling table view as default.
        if(DocumentsStore.listStyle)
        this.setListStyle(DocumentsStore.listStyle)
        else
        this.setListStyle('grid')
        this.addSubmenu();
        this.documentsService.getAllItems("?is_not_master_document_list&").subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });

        break;

        case "archive":
          //  To remove Table/Grid View from submenu and enabling table view as default.
          if(DocumentsStore.listStyle)
          this.setListStyle(DocumentsStore.listStyle)
          else
          this.setListStyle('grid')
          this.addSubmenu();
          this.documentsService.getAllItems("/archive?").subscribe((res) => {
            this._utilityService.detectChanges(this._cdr);
          });
  
          break;

      default:

        this.documentsService.getAllItems(`?document_type_ids=${docTypeId}&is_not_master_document_list&`).subscribe((res) => {
          DocumentsStore.documentId = null;
          this._utilityService.detectChanges(this._cdr);
        });


        break;
    }
  }

  // * To check if a folder and navigate accordingly.

  gotoFolder(isFolder, documentId, title) {

    if(DocumentsStore.selectedSideMenu!='trash'){
      DocumentsStore.itemsPerPage = 14;
      DocumentsStore.documentId = documentId;
      this.activeBreadCrumbID = documentId
  
      if (isFolder) {
        DocumentsStore.folderId = documentId
        DocumentsStore.parentDataStatus = true;
        this.storeFolderAccessDetails(documentId)
        DocumentsStore.breadCrumbStatus = true;
        let breadCrumbData = {
          documentId, title, currentPage: 1
        }
        DocumentsStore.setBreadcrumb(breadCrumbData)
        this.getFolderDetails(false, documentId)
      } else {
  
        DocumentsStore.unsetDocumentDetails()
        this.documentsService.getItemById(documentId).subscribe(res => {
          this._utilityService.detectChanges(this._cdr)
        })
        this._router.navigateByUrl("/knowledge-hub/documents/" + documentId);
      }
    }

  
  }
  // * To Store Folder Access Details

  storeFolderAccessDetails(folderId) {

    let parentAccessDetails = {

      accessId: null,
      accessData: {
        org_ids: [],
        division_ids: [],
        department_ids: [],
        section_ids: [],
        sub_section_ids: [],
        user_ids: null,
        designation_ids: [],
      }

    }


    this.documentsService.getItemById(folderId).subscribe(res => {

      parentAccessDetails.accessId = res.document_access_type.id
      if (res.document_access_type.is_shared) {
        parentAccessDetails.accessData.org_ids = res.organizations
        parentAccessDetails.accessData.division_ids = res.divisions
        parentAccessDetails.accessData.section_ids = res.sections
        parentAccessDetails.accessData.sub_section_ids = res.sub_sections
        parentAccessDetails.accessData.department_ids = res.departments
        parentAccessDetails.accessData.designation_ids = res.designations
        parentAccessDetails.accessData.user_ids = res.users
      }
      else
        delete parentAccessDetails.accessData

      DocumentsStore.setParentAccessData(parentAccessDetails)

    })

  }

  // Setting the Sub Menu Based on Condition

  addSubmenu() {

    // * Checking if Grid Listing is Selected

    if (DocumentsStore.listStyle == 'grid') {

      var subMenuItems = [

        { activityName: null, submenuItem: { type: 'doc_search' } },
        { activityName: null, submenuItem: { type: "new_document" } },
        { activityName: null, submenuItem: { type: "refresh" } },
        { activityName: 'CREATE_DOCUMENT', submenuItem: { type: "file-upload" } },
        { activityName: 'CREATE_FOLDER', submenuItem: { type: "new-folder" } },
        { activityName: null, submenuItem: { type: "table" } },
        { activityName: 'EXPORT_DOCUMENT', submenuItem: { type: "export_to_excel" } },
        { activityName: 'CREATE_DOCUMENT_QUICK_UPLOAD', submenuItem: { type: "quick-upload" } },
        { activityName: 'CREATE_COMPLIANCE', submenuItem: { type: "compliance-register" } },

      ]
    } else if (DocumentsStore.selectedSideMenu == 'master') {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'doc_search' } },
        { activityName: null, submenuItem: { type: "refresh" } },
        { activityName: 'CREATE_DOCUMENT', submenuItem: { type: "file-upload" } },
        { activityName: 'CREATE_FOLDER', submenuItem: { type: "new-folder" } },
        { activityName: 'EXPORT_DOCUMENT', submenuItem: { type: "export_to_excel" } },
        { activityName: 'CREATE_DOCUMENT_QUICK_UPLOAD', submenuItem: { type: "quick-upload" } },
        { activityName: 'CREATE_COMPLIANCE', submenuItem: { type: "compliance-register" } },
      ]
    }

    else {

      // * Checking if Table List is Selected
      //  * Checking if Master List is Selected and disabling Grid View.
      var subMenuItems = [

        { activityName: null, submenuItem: { type: 'doc_search' } },
        { activityName: null, submenuItem: { type: "new_document" } },
        { activityName: null, submenuItem: { type: "refresh" } },
        { activityName: 'CREATE_DOCUMENT', submenuItem: { type: "file-upload" } },
        { activityName: 'CREATE_FOLDER', submenuItem: { type: "new-folder" } },
        { activityName: 'EXPORT_DOCUMENT', submenuItem: { type: "export_to_excel" } },
        { activityName: 'CREATE_DOCUMENT_QUICK_UPLOAD', submenuItem: { type: "quick-upload" } },
        { activityName: 'CREATE_COMPLIANCE', submenuItem: { type: "compliance-register" } },

      ]

      if (DocumentsStore.selectedSideMenu != 'master') {
        subMenuItems.splice(3, 0, { activityName: null, submenuItem: { type: "grid" } },)
      }


    }
    this._helperService.checkSubMenuItemPermissions(700, subMenuItems);


  }


  // * Setting BreadCrumb Root Text Dynamically

  setBreadCrumbText() {

    let breadCrumb

    if (DocumentsStore.selectedSideMenu == 'private')
      return breadCrumb = 'My Documents'
    else
      return breadCrumb = DocumentsStore.selectedSideMenu.charAt(0).toUpperCase() + DocumentsStore.selectedSideMenu.slice(1)

  }

  // * To check Breadcrumb Last Index and to remove the arrow 
  checkIndex(data) {

    let totalLength = DocumentsStore.breadCrumb.length
    if (data.id == DocumentsStore.breadCrumb[totalLength - 1].id)
      return false;
    else
      return true;
  }

  // Download Document 
  downloadDocument(documentDetails, type?) {
    if (type == 1) {
      this._documentFileService.downloadFile('document-file-all', documentDetails.id, documentDetails.document_version_id, null, documentDetails.document_version_title, documentDetails);
    } else {
      this._documentFileService.downloadFile('document-version', documentDetails.id, documentDetails.document_version_id, null, documentDetails.document_version_title, documentDetails);
    }
  }

  // * To get items in Folder

  getFolderDetails(updatebreadCrumb, documentId, documentData?, listType?) {
    DocumentsStore.documentId = documentId;
    DocumentsStore.unsetDocuments()
    // * Updating BreadCrumb Data

    if (updatebreadCrumb && this.activeBreadCrumbID != documentId) {
      var index = DocumentsStore.breadCrumbData.indexOf(documentData);
      DocumentsStore.breadCrumbData.splice(index + 1, DocumentsStore.breadCrumbData.length);
      let lastElement = DocumentsStore.breadCrumbData[DocumentsStore.breadCrumbData.length - 1]
      DocumentsStore.folderId = lastElement.id
    }

    // * Setting List Style 
    if (listType)
      this.setListStyle(listType)

    // * Getting Folder Details
    this.documentsService.getItemsInFolder(false, '', documentId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })

  }
  // * Listing Data and Setting pagination

  pageChange(newPage: number = null) {

    if (DocumentsStore.folderId && DocumentsStore.breadCrumbData.length > 0) {
      let index = DocumentsStore.breadCrumbData.findIndex(e => e.id == DocumentsStore.folderId)
      DocumentsStore.breadCrumbData[index].currentPage = newPage;
      this.getFolderDetails(false, DocumentsStore.folderId)
    }

    else {
      if (newPage) {
        DocumentsStore.setCurrentPage(newPage);
        DocumentsStore.setRootCurrentPage(newPage);
      }
      if (DocumentsStore.documentTypeId)
        this.listDocuments(DocumentsStore.selectedSideMenu, false, DocumentsStore.documentTypeId);
      else
        this.listDocuments(DocumentsStore.selectedSideMenu);
    }


  }


  // * To Handle Right Click Menu Function's

  rightClickMenu(type, docId, isFolder?, docName?,docVersionId?) {

    switch (type) {
      case 'delete':
        this.setDeleteData(docId, isFolder)
        break;

      case 'restore':
        if (isFolder) {
          this.documentsService.restoreFolder(docId).subscribe(res => {
            this.listDocuments(DocumentsStore.selectedSideMenu)
          })
        } else {
          this.documentsService.restoreDocument(docId).subscribe(res => {
            this.listDocuments(DocumentsStore.selectedSideMenu)
          })
        }
        break;

      case 'rename':
        this.openFolderRenameForm(docId, docName)
        break;

      case 'share':
          ShareItemStore.setTitle('share_document_title');
          ShareItemStore.formErrors = {};
          this.openShareDataModel(docId, docVersionId)
          break;  
      default:
        break;
    }
  }

  // Popups and Forms Starts Here

  // * Document Step Form Open

  openDocumentForm() {
    DocumentsStore.fileUploadType = 'Add'
    if (!DocumentsStore.breadCrumbStatus) {

      DocumentsStore.parentDataStatus = false;

    }
    this._router.navigateByUrl("/knowledge-hub/documents/add-document");
  }


  // * Document Folder Form

  openFolderForm() {

    if (!DocumentsStore.breadCrumbStatus)
      DocumentsStore.parentDataStatus = false;
    setTimeout(() => {
      $(this.folderModal.nativeElement).modal('show');
    }, 100);
  }

  // * Document Folder Form Close 

  closeFolderForm() {
    $(this.folderModal.nativeElement).modal('hide');
    this.folderObject.type = null;
  }

  // * Document Quick Upload Form

  openQuickUploadForm() {
    DocumentsStore.quick_upload = true;
    setTimeout(() => {
      $(this.quickUpload.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  // * Document Quick Upload Form Clsoe

  closeQuickUpload() {
    $(this.quickUpload.nativeElement).modal('hide');
    DocumentsStore.quick_upload = false;
  }

  // * Open Search  Popup

  openSearchPopup() {

    this.enableSearchPopup = true;
    setTimeout(() => {
      this.documentsService.searchDocument('').subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
      $(this.documentSearch.nativeElement).modal('show')
    }, 100);


  }

  closeSearchPopup() {

    this.enableSearchPopup = false;
    setTimeout(() => {
      $(this.documentSearch.nativeElement).modal('hide')
    }, 100);


  }

  // * Open Folder Details

  openFolderDetails(folderId) {
    this.enableFolderDetailsPopup = true;
    this.documentsService.getFolderDetails(folderId).subscribe(res => {
      DocumentsStore.setFolderDetails(res)
      setTimeout(() => {
        $(this.folderDetails.nativeElement).modal('show')
      })
      this._utilityService.detectChanges(this._cdr);
    })
  }

  closeFolderDetails() {

    setTimeout(() => {
      $(this.folderDetails.nativeElement).modal('hide')
    })
    this.enableFolderDetailsPopup = false;

  }


  // * Open Folder Rename Form

  openFolderRenameForm(folderId, docTitle) {
    this.folderRenameObject.status = true;
    this.folderRenameObject.title = docTitle
    DocumentsStore.folderId = folderId;
    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.folderRename.nativeElement).modal('show');
    }, 100);

  }

  // * Close Folder Rename Form

  closeFolderRenameForm() {
    $(this.folderRename.nativeElement).modal('hide');
    this.folderRenameObject.status = false;
    this.folderRenameObject.title = ''
  }

   // * Open share model

   openShareDataModel(docId: number, docVersionId: number) {
    this.selectedDocId = docId
    this.selectedDocVersionId = docVersionId
    this.enableShareDataPopup = true
    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.shareDataPopup.nativeElement).modal('show');
    }, 100);

  }

  openShareDataPopup() {
    if(ShareItemStore.shareData){
    this.documentsService.shareDocument(this.selectedDocId, this.selectedDocVersionId, ShareItemStore.shareData).subscribe(res=>{
      ShareItemStore.unsetShareData();
      ShareItemStore.setTitle('');
      ShareItemStore.unsetData();
      $(this.shareDataPopup.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
      document.body.classList.remove('modal-open');
      setTimeout(() => {
        $(this.mailConfirmationPopup.nativeElement).modal('show');              
      }, 200);
  },(error)=>{
    if (error.status == 422){
      ShareItemStore.processFormErrors(error.error.errors);
    }
    ShareItemStore.unsetShareData();
    this._utilityService.detectChanges(this._cdr);
    $('.modal-backdrop').remove();
    console.log(error);
  });
    }
  }

  // * Close share model
  closeShareDataModel() {
    $(this.mailConfirmationPopup.nativeElement).modal('hide');
    
    this.selectedDocId = null
    this.selectedDocVersionId = null
    this.enableShareDataPopup = false
  }


  // Popups and Forms Ends Here

  setDeleteData(docId, isFolder) {

    if (this.restoreFlag) {
      if (isFolder) {

        this.popupObject.subtitle = 'Are you sure you want to delete this Folder from Trash?.';
        this.deleteConfirm(docId, 'folder-trash')

      } else {

        this.popupObject.subtitle = 'Are you sure you want to delete this Document from Trash?.';
        this.deleteConfirm(docId, 'document-trash');

      }
    } else {
      if (isFolder) {

        this.popupObject.subtitle = 'Are you sure you want to delete this Folder? Use the trash to check what was deleted recently.';
        this.deleteConfirm(docId, 'folder')

      } else {

        this.popupObject.subtitle = 'kh_document_delete_to_trash';
        this.deleteConfirm(docId, 'document');

      }
    }

  }


  // *Delete Confirmation

  deleteConfirm(id: number, itemType) {
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Document?';
    this.popupObject.itemType = itemType
    this.popupObject.type = 'are_you_sure_delete'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // * Switching Based on Deleting a folder/document

  modalControl(status: boolean) {
    switch (this.popupObject.itemType) {

      case 'folder': this.deleteFolder(status)
        break;
      case 'document': this.deleteDocument(status)
        break;
      case 'document-trash': this.deleteDocumentTrash(status)
        break;
      case 'folder-trash': this.deleteFolderTrash(status)
        break;

    }

  }

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
    this.popupObject.itemType = '';

  }
  // * Folder Delete

  deleteFolder(status: boolean) {
    if (status && this.popupObject.id) {
      this.documentsService.deleteFolder(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          if (DocumentsStore.documentId)
            this.documentsService.getItemsInFolder(false, null, DocumentsStore.documentId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr)
            })
          else
            this.listDocuments(DocumentsStore.selectedSideMenu)
        }, 300);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  // * Document Delete

  deleteDocument(status: boolean) {
    if (status && this.popupObject.id) {
      this.documentsService.deleteDocument(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          if (DocumentsStore.documentId)
            this.documentsService.getItemsInFolder(false, null, DocumentsStore.documentId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr)
            })
          else if (DocumentsStore.documentTypeId)
            this.listDocuments('doc_type', false, DocumentsStore.documentTypeId, DocumentsStore.selectedSideMenu)
          else
            this.listDocuments(DocumentsStore.selectedSideMenu)
          // else
          // this.listDocuments(DocumentsStore.selectedSideMenu)
        }, 300);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  // * Delete Document From Trash

  deleteDocumentTrash(status: boolean) {
    if (status && this.popupObject.id) {
      this.documentsService.deleteDocumentTrash(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          if (DocumentsStore.documentId)
            this.documentsService.getItemsInFolder(false, null, DocumentsStore.documentId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr)
            })
          else
            this.listDocuments(DocumentsStore.selectedSideMenu)
        }, 300);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }


  // * Delete Document From Trash

  deleteFolderTrash(status: boolean) {
    if (status && this.popupObject.id) {
      this.documentsService.deleteFolderTrash(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          if (DocumentsStore.documentId)
            this.documentsService.getItemsInFolder(false, null, DocumentsStore.documentId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr)
            })
          else
            this.listDocuments(DocumentsStore.selectedSideMenu)
        }, 300);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }


  closeConfirmationPopup() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  //  Document Sorting

  setDocumentSort(type) {
    DocumentsStore.setCurrentPage(1);
    this.documentsService.sortDocumentList(type, true, DocumentsStore.selectedSideMenu);

  }


  setClass(selectedMenu, type?) {

    if (type = 'multiple')
      var className = 'nav-link'
    else
      className = 'folder-menu-link nav-link'
    if (DocumentsStore.selectedSideMenu == selectedMenu)
      className = className + ' ' + 'active' + ' ' + 'show'
    return className
  }

  checkDeletePermission(documentData){
 
    // Checking if loggined user is of super admin role then enabling delete in all cases
    // Fo other users delete enabled only to my documents from the left menu and in trash if they want to restore document.
    if(AuthStore.user.designation.is_super_admin)
    return true;
    else if(AuthStore.user.id==documentData.created_by && (DocumentsStore.selectedSideMenu=='private'|| DocumentsStore.selectedSideMenu=='trash') )
    return true;
  }
  

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    // DocumentsStore.clearBreadCrumb();
    this._rightSidebarFilterService.resetFilter();

    SubMenuItemStore.searchText = null;
    RightSidebarLayoutStore.showFilter = false;
    SubMenuItemStore.searchText = '';
    DocumentsStore.searchText = '';

    this.folderRenameModalSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.searchDataSubscription.unsubscribe();
    this.folderFormSubscription.unsubscribe();
  }

}
