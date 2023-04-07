import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Discussion } from 'src/app/core/models/project-management/project-details/project-discussion/project-discussion'
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectDiscussionService } from 'src/app/core/services/project-management/project-details/project-discussion/project-discussion.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { DiscussionMasterStore } from 'src/app/stores/project-management/project-details/project-discussion/project-discussion.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any; 
@Component({
  selector: 'app-project-discussion',
  templateUrl: './project-discussion.component.html',
  styleUrls: ['./project-discussion.component.scss']
})
export class ProjectDiscussionComponent implements OnInit {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;

  
  DiscussionMasterStore = DiscussionMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_project_discussion_message';
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  DiscussionObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  Loaded = false
  discussionModalCloseEvent: any;

  previewObject = {
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null,
    id: null
  }

  constructor(private _discussionService: ProjectDiscussionService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _sanitizer : DomSanitizer) { }

    ngOnInit(): void {

      this.getDiscussions()
      this.discussionModalCloseEvent = this._eventEmitterService.projectDiscussion.subscribe(res => {
        this.closeFormModal();
      })
      this.reactionDisposer = autorun(() => {
        var subMenuItems = [
          
          { activityName: 'CREATE_PROJECT_DELIVERABLE', submenuItem: { type: 'new_modal' } },
          { activityName: null, submenuItem: { type: 'close', path: '../' } },
        ]
        this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
  
        NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_project_discussion' });
  
        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "new_modal":
              
              
              setTimeout(() => {
                this.addNewItem();
              }, 1000);
              
              break;
  
            
          }
          SubMenuItemStore.unSetClickedSubMenuItem();
        }
        if (NoDataItemStore.clikedNoDataItem) {
          this.addNewItem();
          NoDataItemStore.unSetClickedNoDataItem();
        }
       
       
      })


  
    }
    addNewItem() {
      this.DiscussionObject.type = 'Add';
      this.DiscussionObject.values = null; // for clearing the value
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }

    closeFormModal() {
      $(this.formModal.nativeElement).modal('hide');
      this.getDiscussions();
      setTimeout(() => {
        this.DiscussionObject.type = null;
        this._utilityService.detectChanges(this._cdr)

      }, 200);
    }

    openFormModal() {
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 200);
    }
    getDiscussions(){
      this._discussionService.getItemById().subscribe(res => {
        this.Loaded = true      
      })
      this._utilityService.detectChanges(this._cdr)
    }
    createImagePreview(type, token) {
      return this._discussionService.getThumbnailPreview(type, token)
    }
  
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }
    viewDocument(document,data) {

      this._discussionService.getFilePreview('discussion-document', data.project?.id, document.id, document.project_discussion_id).subscribe(res => {
        var resp: any = this._utilityService.getDownLoadLink(res, document.title);
        this.openPreviewModal(resp, document,data);
      }), (error => {
        if (error.status == 403) {
          this._utilityService.showErrorMessage('Error', 'Permission Denied');
        }
        else {
          this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
        }
      });
  
    }
  
    downloadDocument(document_id, filename, doc_id, doc,data) {
      this._discussionService.downloadFile('discussion-document', data.project?.id, document_id , filename, doc_id, doc);
    }

    checkExtension(ext, extType) {
      var res = this._imageService.checkFileExtensions(ext, extType);
      return res;
    }

    openPreviewModal(filePreview, itemDetails,data) {

      let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.component = 'discussion-document';
      this.previewObject.id = data?.project?.id;
      this.previewObject.file_details = itemDetails;
      this.previewObject.file_name = itemDetails.title;
      this.previewObject.file_type = itemDetails.ext;
      this.previewObject.preview_url = previewItem;
      this.previewObject.size = itemDetails.size;
      this.previewObject.uploaded_user = data.created_by;
      // this.previewObject.uploaded_user['image_token'] =  DiscussionMasterStore?.individualJobDetails?.created_by?.image?.token;
      this.previewObject.created_at = data?.created_at;
      $(this.filePreviewModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
  
    }
  
    closePreviewModal(event) {
  
      $(this.filePreviewModal.nativeElement).modal('hide');
      this.previewObject.file_name = null;
      this.previewObject.file_type = '';
      this.previewObject.preview_url = '';
  
    }
    
    
    
}
