import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MsAuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit-check-list/ms-audit-check-list.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditCheckListStore } from 'src/app/stores/ms-audit-management/ms-audit-check-list/ms-audit-check-list.store';
// import { MsAuditCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-category-store';
// import { MsAuditCategoryService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-category/ms-audit-category.service';


declare var $: any;


@Component({
  selector: 'app-ms-audit-check-list',
  templateUrl: './ms-audit-check-list.component.html',
  styleUrls: ['./ms-audit-check-list.component.scss']
})
export class MsAuditCheckListComponent implements OnInit,OnDestroy {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;


  controlMsAuditCheckListSubscriptionEvent: any;
  reactionDisposer: IReactionDisposer;
  MsAuditCheckListStore = MsAuditCheckListStore
  AppStore = AppStore
  AuthStore = AuthStore
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  msAuditChecklistObject = {
    values: null,
    type: null,
    component : 'master-audit'
  };
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    frequency : null
  };
  selectedIndex: any = null;
  selectedInnerIndex: any = null;
  popupControlEventSubscription: any;

  MSTypeArray:any=[];
  EnableActiveClassLeft:number=0;
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  filterSubscription: Subscription = null;
  categoryId:number;
  checkListId:number;
  //MsAuditCategoryMasterStore = MsAuditCategoryMasterStore;

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _msAuditCheckLIstService : MsAuditCheckListService,
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _sanitizer: DomSanitizer,
    //private _msAuditCategoryService: MsAuditCategoryService,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      MsAuditCheckListStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.selectedInnerIndex = null;
      this.selectedIndex = null;
      this.pageChange(1);
    })
    this.reactionDisposer = autorun(() => {
      this.setMenu();
      
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
      // if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin'))
      // {
      //   NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_new_checklist' });
      // }
      // else
      // {
      //   NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle' });
      // }
      


      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "new_modal":
          //   setTimeout(() => {
          //     this.addNewItem();
          //   }, 200);
          //   break;
          case "template":
            this._msAuditCheckLIstService.generateTemplate();
            break;
          case "export_to_excel":
            this._msAuditCheckLIstService.exportToExcel();
            break;
            case "search":
              MsAuditCheckListStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1); 
              break;
              case 'refresh':
                MsAuditCheckListStore.loaded = false
                this.pageChange(1); 
                break
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        //this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      
    })

    this.controlMsAuditCheckListSubscriptionEvent = this._eventEmitterService.msAuditCheckList.subscribe(res => {
       this.closeFormModal();
       this.pageChange(1)
      //  this.selectedInnerIndex = null;
      //  this.selectedIndex = null;
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange(1);
    RightSidebarLayoutStore.filterPageTag = 'audit_mangement_checklist';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'department_ids',
      'ms_audit_category_ids'
    ]);
  }

  setMenu()
  { var subMenuItems=[];
     subMenuItems = [
      { activityName: 'MS_AUDIT_CHECKLIST_LIST', submenuItem: { type: 'search' } },
      { activityName: null, submenuItem: {type: 'refresh'}},
      { activityName: '', submenuItem: { type: 'export_to_excel' } },
      
    ]
  
    this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
  }

  pageChange(newPage: number = null) {
    //this.selectedIndex = null;
    if (newPage) MsAuditCheckListStore.setCurrentPage(newPage);
    this._msAuditCheckLIstService.getItems(true,'?is_all=true').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getIndividualCheckList(id){
    this._msAuditCheckLIstService.getIndividualCheckList(id).subscribe(res=>{
      
      this.getData();

      this._utilityService.detectChanges(this._cdr)
    })
  }


  // ms Type 
  msTypeArrayCollection(){
    this.MSTypeArray=[];

    for (const item of MsAuditCheckListStore.msAuditCheckListDetails?.document_version_contents) {
      console.log("version-->"+item.document_version.version);
      
      const Findelement = this.MSTypeArray.find(element=> (element?.ms_type?.id == item?.document_version?.documents?.ms_type_organization?.ms_type?.id && element.version?.version == item?.document_version?.version) ) 
      if(!Findelement){
        this.MSTypeArray.push({
          ms_type: item?.document_version?.documents?.ms_type_organization?.ms_type,
          version:item?.document_version,
          documents : [{
              title : item.title,
              id : item.id,
              clause_number : item.clause_number,
          }]
        });
        
      } 
    }
    


  }

  getData(){
    this.MSTypeArray=[];
    for (const item of MsAuditCheckListStore.msAuditCheckListDetails?.document_version_contents) {
     if(this.MSTypeArray.length > 0){
      let pos  = this.MSTypeArray.findIndex(element=> (element?.ms_type?.id == item?.document_version?.documents?.ms_type_organization?.ms_type?.id && element.version?.version == item?.document_version?.version) ) 
      if(pos == -1){
        this.addMsTypeData(item);
      } else {
         let kpos = this.MSTypeArray[pos]?.documents.findIndex(e=>e.id == item.id)
         if(kpos == -1){
          let obj = {
            title : item.title,
            id : item.id,
            clause_number : item.clause_number,
           }
          this.MSTypeArray[pos]?.documents.push(obj)
         }
      }
     }else{
      this.addMsTypeData(item);
     }
    }
  }




  addMsTypeData(item){
    console.log(item)
    this.MSTypeArray.push({
      ms_type: item?.document_version?.documents?.ms_type_organization?.ms_type,
      version:item?.document_version,
      year:item?.document_version?.documents?.ms_type_organization?.ms_type_version,
      documents : [{
          title : item.title,
          id : item.id,
          clause_number : item.clause_number,
      }]
    });
  }

  msTypeBaseList(index, item){
    this.EnableActiveClassLeft=index;
  }
  // **ms Type 


  addNewItem(catId) {
    this.msAuditChecklistObject.type = 'Add';
    // this._msAuditTeamService.setFileDetails(null, '', 'logo');
    //this.msAuditChecklistObject.values = null; // for clearing the value
    this.msAuditChecklistObject.values = catId;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  getArrayFormatedString(type,items,languageSupport?){
    let item=[];
    if(languageSupport){
      for(let i of items){
        for(let j of i.language){
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',',type,items);
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.msAuditChecklistObject.type = null;
    if(this.checkListId)
    {
      this.getIndividualCheckList(this.checkListId);
    }
    
    this._utilityService.detectChanges(this._cdr);
  }

  selectedIndexChange(index,id:number){
    MsAuditCheckListStore.individualLoaded=false
    if(this.selectedIndex == index){
      this.selectedIndex = null;
      this.selectedInnerIndex = null;
    } else{
      this.selectedInnerIndex = null;
      this.selectedIndex = index;
      this._utilityService.detectChanges(this._cdr);
    }
  }

  selectedInnerIndexChange(index,id:number){
    //console.log(id)
    if(this.selectedInnerIndex == index){
      this.selectedInnerIndex = null;
    } else{
      this.selectedInnerIndex = index;
      this._utilityService.detectChanges(this._cdr);
    }
      this.checkListId=id;
		  this.getIndividualCheckList(id)

  }

  editCheckList(checkList){
    //event.stopPropagation();
    this._msAuditCheckLIstService.getIndividualCheckList(checkList.id).subscribe(res=>{
      this.msAuditChecklistObject.type = 'Edit';
      this.msAuditChecklistObject.values = res
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    })
  }

  deleteCheckList(id:number){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_strategy_profile?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
        // for popup object clearing
        clearPopupObject() {
          this.popupObject.id = null;
          this.popupObject.type = null;
        }

        // modal control event
        modalControl(status: boolean) {
          switch (this.popupObject.type) {
            case '': this.deleteMsAuditCheckList(status)
              break;
          }
      
        }
      
          // delete function call
          deleteMsAuditCheckList(status: boolean) {
            if (status && this.popupObject.id) {
              this._msAuditCheckLIstService.deleteChecklist(this.popupObject.id).subscribe(resp => {
                setTimeout(() => {
                  this.pageChange(1);
                  this.checkListId=null;
                  this._utilityService.detectChanges(this._cdr);
                }, 500);
                this.clearPopupObject();
              });
            }
            else {
              this.clearPopupObject();
            }
            setTimeout(() => {
              $(this.confirmationPopUp.nativeElement).modal('hide');
            }, 250);
        
          }
  
          getDefaultImage(type) {
            return this._imageService.getDefaultImageUrl(type);
          }
        
          createPreviewUrl(type, token) {
            return this._msAuditCheckLIstService.getThumbnailPreview(type, token)
          }
      
           // Returns image url according to type and token
           createImageUrl(type, token) {
            return this._msAuditCheckLIstService.getThumbnailPreview(type, token);
          }

            // extension check function
    checkExtension(ext, extType) {

      return this._imageService.checkFileExtensions(ext, extType)
     
    }

    downloCheckListDocument(type, kpiDocument, docs, frequencyId) {

      event.stopPropagation();
      switch (type) {
        case "check-list":
          this._msAuditCheckLIstService.downloadFile(
            frequencyId,
            "check-list",
            kpiDocument.id,
            null,
            kpiDocument.title,
            kpiDocument
          );
          break;
          case "document-version":
            this._documentFileService.downloadFile(
              type,
              kpiDocument.document_id,
              docs.id,
              null,
              document.title,
              docs
            );
            break;
    
      }
    
    }

    viewCheckListDocument( type, docuDetails ,id,documentFile) {
      switch (type) {
        case "check-list":
      this._msAuditCheckLIstService.getCheckListPreview(docuDetails,id).subscribe(res=>{
        var resp: any = this._utilityService.getDownLoadLink(
          res,
          docuDetails.name
        );
        this.openPreviewModal(type, resp, documentFile, docuDetails, id );
      }),
      (error) => {
        if (error.status == 403) {
          this._utilityService.showErrorMessage(
            "Error",
            "permission_denied"
          );
        } else {
          this._utilityService.showErrorMessage(
            "Error",
            "unable_generate_preview"
          );
        }
      };
      break;
      case "document-version":
        this._documentFileService
          .getFilePreview(type, docuDetails.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              docuDetails.title
            );
            this.openPreviewModal(type, resp, documentFile, docuDetails,id);
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
  
    openPreviewModal(type,filePreview, documentFiles, document , id) {
      this.previewObject.component = type
      let previewItem = null;
      if (filePreview) {
        previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
        this.previewObject.preview_url = previewItem;
        this.previewObject.file_details = documentFiles;
        this.previewObject.componentId = document.id;
        this.previewObject.frequency = id
  
        
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

  
  ngOnDestroy() {
    this.controlMsAuditCheckListSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MsAuditCheckListStore.loaded=false;
    SubMenuItemStore.searchText='';
    MsAuditCheckListStore.searchText='';
		MsAuditCheckListStore.unsetMsAuditCheckListDetails();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }


}
