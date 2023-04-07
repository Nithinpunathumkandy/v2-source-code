import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { MdlService } from 'src/app/core/services/knowledge-hub/mdl/mdl.service';
import { DocumentTypesService } from 'src/app/core/services/masters/knowledge-hub/document-types/document-types.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MasterListDocumentStore } from 'src/app/stores/knowledge-hub/master-list-document/masterListDocument.store';
import { DocumentTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-types-store';

declare var $: any;

@Component({
  selector: 'app-master-list',
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.scss'],
  host: {
    "(window:click)": "onClick()"
  }
})
export class MasterListComponent implements OnInit {

  @ViewChild("plainDev") plainDev: ElementRef;
  @ViewChild("navBar") navBar: ElementRef;
  @ViewChild("documentAddModal") documentAddModal: ElementRef;
  @ViewChild("options") options: ElementRef;
  @ViewChild("documentSearch") documentSearch: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  enableDocumentAddform:boolean=false;


  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  MasterListDocumentStore=MasterListDocumentStore;
  DocumentTypeMasterStore = DocumentTypeMasterStore;
  AppStore=AppStore;

  MasterDocumentAddFormSubscription:any
  DocumentSearchSubscription:any;
  searchDataSubscription:any
  deleteEventSubscription: any;
  filterSubscription: any;

  documentEmptyList = "No Documents Available"
  activeIndex = null;
  show: boolean = false;
  optionsMenu: boolean = false;
  enableSearchPopup:boolean=false;
  documentTypeList: boolean = false;
  
  popupObject = {
    title: 'Delete',
    id: null,
    subtitle: '',
    type: '',
  };

  constructor(

    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private documentsService: DocumentsService,
    private _masterDocumentService:MdlService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _documentTypeService: DocumentTypesService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {


    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      MasterListDocumentStore.documentsLoaded = false;
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
            MasterListDocumentStore.searchText = '';
            this.listDocuments()
            break;
          case "new_modal":
            setTimeout(() => {
              this.openDocumentForm()
            }, 500);
            break;

          case "doc_search":
            this.openSearchPopup()
            break;
          case "export_to_excel":
              this._masterDocumentService.exportToExcel();
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    
    this.MasterDocumentAddFormSubscription=this._eventEmitterService.MasterListDocumentAddModal.subscribe(documentId=>{
      if(documentId)
      this.gotoDocument(documentId)
      else
      {
        this.listDocumentTypes()
        this.listDocuments()
      }

      this.closeFolderForm()
    })

    this.searchDataSubscription = this._eventEmitterService.searchData.subscribe(res => {
      this.gotoDocument(res.docId)
      this.closeSearchPopup()
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteDocument(item);
    })
    this.DocumentSearchSubscription=this._eventEmitterService.documentSearch.subscribe(res=>{
      this.closeSearchPopup()
      
    })

    SubMenuItemStore.setNoUserTab(true);

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, "height", "auto");
      window.addEventListener("scroll", this.scrollEvent, true);
    }, 1000);
    this.listDocumentTypes()
    RightSidebarLayoutStore.filterPageTag = 'document-list';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'document_type_ids',
      'created_by_user_ids',
    ]);
    this.pageChange(1)
  }


   // * Document  Form

   openDocumentForm() {
    MasterListDocumentStore.addDocumentPopup=true;  
    setTimeout(() => {
      $(this.documentAddModal.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr)
  }

    // * Document  Form Close 

  closeFolderForm() {
    $(this.documentAddModal.nativeElement).modal('hide');
    MasterListDocumentStore.addDocumentPopup=false;  
  }

   // Download Document 
   downloadDocument(event,documentDetails,type?){
     event.stopPropagation()
    if(type==1){
      this._documentFileService.downloadFile('document-file-all',documentDetails.id,documentDetails.document_version_id, null,documentDetails.document_version_title,documentDetails);
    }else{
      this._documentFileService.downloadFile('document-version',documentDetails.id,documentDetails.document_version_id, null,documentDetails.document_version_title,documentDetails);
    }    
  }

  // * To Open Right Click Menu Option
  
  openOptions(event,index) {
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

      this.activeIndex=null;
      
    }

      // * To Set the Dropdown in  Left Side Menu of Document Types
      showDocumentTypes() {

        if (this.documentTypeList == false)
          this.documentTypeList = true;
        else
          this.documentTypeList = false;
          
      }


      // * Open Search  Popup

   openSearchPopup() {

    this.enableSearchPopup=true;
    setTimeout(() => {
      this.documentsService.searchDocument('').subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);        
      });            
      $(this.documentSearch.nativeElement).modal('show')
    }, 100);


    }
  
    closeSearchPopup() {
      setTimeout(() => {
        $(this.documentSearch.nativeElement).modal('hide')
      }, 100);
      this.enableSearchPopup=false;
    }


  addSubmenu() {

    // * Checking if Grid Listing is Selected

  if (MasterListDocumentStore.listStyle == 'grid') {
    
    var subMenuItems = [

      { activityName: null, submenuItem: { type: 'doc_search' } },
      { activityName: null, submenuItem: { type: "refresh" } },    
      { activityName: null, submenuItem: { type: "table" } },   
      { activityName: 'CREATE_DOCUMENT', submenuItem: { type: "new_modal" } },
      { activityName: 'EXPORT_DOCUMENT', submenuItem: { type: "export_to_excel" } }, 

        ]
        }
    
    else {
      
   // * Checking if Table List is Selected
  //  * Checking if Master List is Selected and disabling Grid View.
  var subMenuItems = [

    { activityName: null, submenuItem: { type: 'doc_search' } },
    { activityName: null, submenuItem: { type: "refresh" } },
    { activityName: null, submenuItem: { type: "grid" } },   
    { activityName: 'CREATE_DOCUMENT', submenuItem: { type: "new_modal" } },
    { activityName: 'EXPORT_DOCUMENT', submenuItem: { type: "export_to_excel" } },

      ]

    }
    this._helperService.checkSubMenuItemPermissions(700, subMenuItems);

  
}



 // * To goto Folder Details
  
 gotoDocument(documentId) {
  MasterListDocumentStore.itemsPerPage = 14;
  MasterListDocumentStore.documentId = documentId;

    MasterListDocumentStore.unsetDocumentDetails()
    this._masterDocumentService.getItemById(documentId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
    this._router.navigateByUrl("/knowledge-hub/corporate-documents/"+documentId);
  
}

   // * Listing Data and Setting pagination

   pageChange(newPage: number = null) {
      if (newPage) { 
        MasterListDocumentStore.setCurrentPage(newPage);
        this.listDocuments()
      }
  }

    // * Listing Different Document Types
    listDocumentTypes() {
    
      this._documentTypeService.getAllItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
  
    }


  listDocuments(type?,documentTypeId?){
    MasterListDocumentStore.itemsPerPage = 24;
    MasterListDocumentStore.documentsLoaded=false;
    MasterListDocumentStore.selectedSideMenu=type
    this.setListStyle(MasterListDocumentStore.listStyle)
    this.addSubmenu();
    if(type=='doc_type'){
      this._masterDocumentService.getAllItems(`?document_type_ids=${documentTypeId}&`).subscribe((res) => {
         this._utilityService.detectChanges(this._cdr);
      });
    }else{
      this._masterDocumentService.getAllItems().subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }

  }

  setClass(selectedMenu,type?) {

    if(type='multiple')
      var className = 'nav-link'
    else
      className ='folder-menu-link nav-link'
    if (MasterListDocumentStore.selectedSideMenu == selectedMenu)
      className = className + ' ' + 'active' +' '+ 'show'
    return className
  }

//Getting Default Image and Thumnail Preview 
getDefaultImage(type) {
  return this._imageService.getDefaultImageUrl(type);
}
createImageUrl(type,token ,h? ,w? ) {
  return this._documentFileService.getThumbnailPreview(type,token,h,w);
}


  //To Set the Listing Type

  setListStyle(type) {
    console.log(type)
    if (type == "grid") MasterListDocumentStore.listStyle = type;
    if (type == "table") MasterListDocumentStore.listStyle = type;
  }
      //  Document Sorting
      setDocumentSort(type) {
        MasterListDocumentStore.setCurrentPage(1);
        this._masterDocumentService.sortDocumentList(type, true);      
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



  
  // *Delete Confirmation

  deleteConfirm(id: number,event) {
    event.stopPropagation()
    this.popupObject.id = id;
    this.popupObject.title='Delete Document?';
    this.popupObject.subtitle = 'kh_document_delete';
    this.popupObject.type='are_you_sure_delete'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
  }
  // * Folder Delete

  // * Document Delete

  deleteDocument(status: boolean) {
    if (status && this.popupObject.id) {
      this._masterDocumentService.deleteDocument(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
        this.listDocuments()
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

  closeConfirmationPopup(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }


  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this._rightSidebarFilterService.resetFilter();

    SubMenuItemStore.searchText = null; 
    SubMenuItemStore.searchText = '';
    MasterListDocumentStore.searchText = '';

    this.filterSubscription.unsubscribe();
    this.searchDataSubscription.unsubscribe();
    this.MasterDocumentAddFormSubscription.unsubscribe();
  }

}
