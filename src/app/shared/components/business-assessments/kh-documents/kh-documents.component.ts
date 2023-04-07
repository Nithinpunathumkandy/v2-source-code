import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, HostListener, Output, Input } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import {DocumentsStore} from 'src/app/stores/knowledge-hub/documents/documents.store'
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AssessmentsStore } from 'src/app/stores/business-assessments/assessments/assessments.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DocumentTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-types-store';
import { DocumentTypesService } from 'src/app/core/services/masters/knowledge-hub/document-types/document-types.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-kh-documents',
  templateUrl: './kh-documents.component.html',
  styleUrls: ['./kh-documents.component.scss']
})
export class KhDocumentsComponent implements OnInit {
  @Input('documentStatus')documentStatus='private';
  @ViewChild("plainDev") plainDev: ElementRef;
  @ViewChild("navBar") navBar: ElementRef;
  @ViewChild("options") options: ElementRef;
  @ViewChild ('folderModal',{static:true}) folderModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  DocumentsStore = DocumentsStore;
  DocumentTypeMasterStore = DocumentTypeMasterStore;
  documentEmptyList = "No Documents Available"


  folderFormSubscription: any;
  ModalStyleSubscriptionEvent: any;
  
  folderObject = {
    values: null,
    type:null
  }

  form:FormGroup

  listStyle: string = "grid";
  isMenu: boolean = false;
  activeIndex = null;
  show: boolean = false;
  optionsMenu: boolean = false;
  breadCrumb: boolean = false;
  newModal: boolean = false;
  activeBreadCrumbID: number;
  activeFile = null;
  menuOpened: boolean = true;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(
    private _formBuilder:FormBuilder,
    private _renderer2: Renderer2,
    private documentsService: DocumentsService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _documentTypeService: DocumentTypesService,
    private _documentFileService: DocumentFileService,
  ) {}



  ngOnInit(): void {

    DocumentsStore.listStyle='grid'
    this.form = this._formBuilder.group({   
      searchItem:['']   
    })
    
    this.pageChange(1)
    this.listDocumentTypes()

    this.folderFormSubscription = this._eventEmitterService.commonModal.subscribe((res:any) => {
      if (res == 'save') {
        this.documentsService.getItemsInFolder(false, '', DocumentsStore.documentId).subscribe(res => {
          this._utilityService.detectChanges(this._cdr)
        })
        this.closeFolderForm()
      } else
        this.closeFolderForm()
     
    })

    this.ModalStyleSubscriptionEvent = this._eventEmitterService.ModalStyle.subscribe(res => {

      this._renderer2.setStyle(this.folderModal.nativeElement, 'z-index', '999999');
      this._renderer2.setStyle(this.folderModal.nativeElement,'overflow','auto');
    })

    this.form.get("searchItem").valueChanges.pipe(      
      switchMap(value=>this.documentsService.getAllItems(this.documentStatus=='published'?"/public?is_published=true":"/public",true,`page=1&limit=12&order=desc&order_by=documents.id&q=${value}`))
    ).subscribe((res)=>{
      this._utilityService.detectChanges(this._cdr);
    })

    // this.documentsService.getAllItems("/public?").subscribe((res) => {
    //   this._utilityService.detectChanges(this._cdr);
    // });

  }

  openMenu() {
    if (this.menuOpened)
      this.menuOpened = false;
    else if (!this.menuOpened)
    this.menuOpened = true;
    
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }
  createImageUrl(type,token ,h? ,w? ) {

    return this._documentFileService.getThumbnailPreview(type,token,h,w);
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

  getFolderDetails(updatebreadCrumb, documentId, documentData?, listType?) {
    DocumentsStore.itemsPerPage = 12;
    DocumentsStore.documentId = documentId;
    DocumentsStore.unsetDocuments()
    // Updating BreadCrumb Data

    if(updatebreadCrumb && this.activeBreadCrumbID!=documentId)
    {
      var index = DocumentsStore.breadCrumbData.indexOf(documentData);
      DocumentsStore.breadCrumbData.splice(index + 1, DocumentsStore.breadCrumbData.length);
      let lastElement = DocumentsStore.breadCrumbData[DocumentsStore.breadCrumbData.length - 1]
      DocumentsStore.folderId=lastElement.id
      }

    // Setting List Style 
    if (listType)
      this.setListStyle(listType)
    
    // Getting Folder Details
    this.documentsService.getItemsInFolder(false, '', documentId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
  })

  }


  listDocumentTypes() {
    
    this._documentTypeService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })

  }

  getDocumentTitleFormatted(title,index){
    if(title){
      if(title.length > 25) return title.substring(0,25);
      else return title;
    }
    else{
      return 'Document-'+index;
    }
  }

  pageChange(newPage: number = null) {
      
      
    if (DocumentsStore.folderId && DocumentsStore.breadCrumbData.length > 0)
    
    {
      let index = DocumentsStore.breadCrumbData.findIndex(e => e.id == DocumentsStore.folderId)
      DocumentsStore.breadCrumbData[index].currentPage = newPage;

      this.getFolderDetails(false,DocumentsStore.folderId)
      }
      
    else {
      if (newPage) { 
        DocumentsStore.setCurrentPage(newPage);
      DocumentsStore.setRootCurrentPage(newPage)
      }
      if(DocumentsStore.documentTypeId)
        this.listDocuments(DocumentsStore.selectedSideMenu, false, DocumentsStore.documentTypeId)
      else
      this.listDocuments(DocumentsStore.selectedSideMenu)
    }
   
   
  }


  
  openFolderForm() {

    setTimeout(() => {
      $(this.folderModal.nativeElement).modal('show');
    }, 100);
  }

  closeFolderForm() {
    $(this.folderModal.nativeElement).modal('hide');
    this.folderObject.type = null;
  }


// To check Breadcrumb Last Index.
  checkIndex(data) {
  
    let totalLength = DocumentsStore.breadCrumb.length
    if (data.id == DocumentsStore.breadCrumb[totalLength - 1].id)
      return false;
    else
      return true;
  }


  gotoFolder(isFolder, documentId, title,doc?) {
    DocumentsStore.documentId = documentId;
    this.activeBreadCrumbID = documentId

    if (isFolder) {
      DocumentsStore.folderId = documentId
      DocumentsStore.breadCrumbStatus = true;
      let breadCrumbData = {
        documentId,title,currentPage:1
      }
      DocumentsStore.setBreadcrumb(breadCrumbData)
      this.getFolderDetails(false,documentId)
    } else {
      if(this.activeFile!=null && this.activeFile.id==doc.id){
              this.activeFile = null
            }
            else{
              this.activeFile = doc;
              
            }
    }
  }

  openDocument() {
    AssessmentsStore.setDocumentImageDetails(this.activeFile)
    this._eventEmitterService.dismissKhDocumentModal();
  }

  setDocumentSort(type) {
    DocumentsStore.setCurrentPage(1);
    this.documentsService.sortDocumentList(type,true,DocumentsStore.selectedSideMenu);
  }

  
  dismissModal(){
    this.activeFile = null;
    this._eventEmitterService.dismissKhDocumentModal();
  }

  searchDocument(){    
      this.documentsService.getAllItems("/public?").subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });   
  }



  listDocuments(param, rootCheck?: boolean, docTypeId?) {
    DocumentsStore.itemsPerPage = 12;
    if (DocumentsStore.rootCurrentPage && rootCheck) {
      DocumentsStore.currentPage=DocumentsStore.rootCurrentPage
    }

    DocumentsStore.documentsLoaded = false;
    DocumentsStore.selectedSideMenu=param
    DocumentsStore.clearBreadCrumb();
    DocumentsStore.breadCrumbStatus = false;
    this.documentsService.getAllItems(this.documentStatus=='published'?"/public?is_published=true&":"/public?").subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });

    // switch (param) {
    //   case "recent":
        
    //     this.documentsService.getAllItems("/recent?").subscribe((res) => {
    //       this._utilityService.detectChanges(this._cdr);
    //     });

    //     break;

    //   case "starred":
    //     this.documentsService
    //       .getAllItems("/starred?")
    //       .subscribe((res) => {
    //         this._utilityService.detectChanges(this._cdr);
    //       });

    //     break;

    //   case "new":
    //     this.documentsService.getAllItems("/new?").subscribe((res) => {
    //       this._utilityService.detectChanges(this._cdr);
    //     });

    //     break;
      
    //     case "root":
    //     this.documentsService.getAllItems("?root=true&").subscribe((res) => {
    //         DocumentsStore.documentId = null;
    //         this._utilityService.detectChanges(this._cdr);
    //       });

    //     break;
      
    //   case "trash":
    //     this.documentsService.getAllItems("/trash?").subscribe((res) => {
    //         DocumentsStore.documentId = null;
    //         this._utilityService.detectChanges(this._cdr);
    //       });

    //     break;
      
    //   case "doc_type":
    //     this.documentsService.getAllItems(`?document_type_ids=${docTypeId}&`).subscribe((res) => {
    //         DocumentsStore.documentId = null;
    //          this._utilityService.detectChanges(this._cdr);
    //       });
  
    //     break;
      
    //     case "public":
    //       this.documentsService.getAllItems("/public?").subscribe((res) => {
    //           this._utilityService.detectChanges(this._cdr);
    //         });
    
    //       break;
        
    //       case "private":
    //       this.documentsService.getAllItems("/private?").subscribe((res) => {
    //           this._utilityService.detectChanges(this._cdr);
    //         });
    
    //       break;
        
    //       case "shared":
    //       this.documentsService.getAllItems("/shared?").subscribe((res) => {
    //           this._utilityService.detectChanges(this._cdr);
    //         });
    
    //         break;
        

    //   default:
    //     break;
    // }
  }


  setListStyle(type) {
    if (type == "grid") DocumentsStore.listStyle = type;
    if (type == "table") DocumentsStore.listStyle = type;
  }

  ngOnDestroy() {
    // BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    // TemplateStore.unsetTemplateDetails();
    // SubMenuItemStore.makeEmpty();
    this.activeFile = null;
    // this.modalEventSubscription.unsubscribe();
    
  }

}
