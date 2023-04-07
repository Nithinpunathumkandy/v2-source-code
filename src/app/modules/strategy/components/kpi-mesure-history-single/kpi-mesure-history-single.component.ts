import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;


@Component({
  selector: 'app-kpi-mesure-history-single',
  templateUrl: './kpi-mesure-history-single.component.html',
  styleUrls: ['./kpi-mesure-history-single.component.scss']
})
export class KpiMesureHistorySingleComponent implements OnInit {
  @Input('source') kpiMesureHistorySource: any;
  @ViewChild('kpiMesure') kpiMesure: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;


  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  AppStore = AppStore;
  AuthStore = AuthStore
  kpiMesureObject = {
    type: null,
    value: null,
    id:null
  }

  kpiMesureData ={
    type: null,
    value: null,
    id:null
  }

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    frequency : null
  };
  kpiMesureModalModalEventSubscription: any;


  constructor(private _eventEmitterService: EventEmitterService,private _renderer2: Renderer2,
              private _strategyService : StrategyService,private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef, private _reviewService : StrategyReviewService,
              private _sanitizer: DomSanitizer,private _imageService: ImageServiceService,
              private _documentFileService: DocumentFileService,
     ) { }

  ngOnInit(): void {
    this.kpiMesureModalModalEventSubscription = this._eventEmitterService.kpiMesureModal.subscribe(item=>{
      this.closekpiMesure();
    })
  }

  cancel(){
    this._eventEmitterService.dismisskpiMesureHistoryModal();
  }

  editFrequency(data){
    this._strategyService.induvalKpi(this.kpiMesureHistorySource.value.id).subscribe(res=>{
      this.kpiMesureObject.value = res;
      this.kpiMesureData.value = data
      this.kpiMesureObject.type = 'Edit';
      this.openKpiMesureModalPopup()
      this._utilityService.detectChanges(this._cdr)
    })


  }

  openKpiMesureModalPopup(){
    // $(this.noteModal.nativeElement).modal('show');
    this._renderer2.addClass(this.kpiMesure.nativeElement,'show');
    this._renderer2.setStyle(this.kpiMesure.nativeElement,'display','block');
    this._renderer2.setStyle(this.kpiMesure.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.kpiMesure.nativeElement,'overflow','auto');
  }

  closekpiMesure(){
    this.kpiMesureObject.type = null;    
    // $(this.kpiMesure.nativeElement).modal('hide');
    this._renderer2.removeClass(this.kpiMesure.nativeElement,'show');
    this._renderer2.setStyle(this.kpiMesure.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

     // for file preview

     viewIncidentDocument( type, docuDetails ,frequencyId,documentFile) {
      switch (type) {
        case "kpi-document":
      this._reviewService.getFilePreview(docuDetails,frequencyId).subscribe(res=>{
        var resp: any = this._utilityService.getDownLoadLink(
          res,
          docuDetails.name
        );
        this.openPreviewModal(type, resp, documentFile, docuDetails, frequencyId );
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
            this.openPreviewModal(type, resp, documentFile, docuDetails,frequencyId);
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
  
    openPreviewModal(type,filePreview, documentFiles, document , frequencyId) {
      this.previewObject.component=type
      let previewItem = null;
      if (filePreview) {
        previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
        this.previewObject.preview_url = previewItem;
        this.previewObject.file_details = documentFiles;
        this.previewObject.componentId = document.id;
        this.previewObject.frequency = frequencyId

        
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

      // Returns default image
      getDefaultImage(type) {
        return this._imageService.getDefaultImageUrl(type);
      }
    
      createPreviewUrl(type, token) {
        return this._reviewService.getThumbnailPreview(type, token)
      }
    
    
      // Returns image url according to type and token
      createImageUrl(type, token) {
        return this._reviewService.getThumbnailPreview(type, token);
      }
  
      
    // extension check function
    checkExtension(ext, extType) {
  
      return this._imageService.checkFileExtensions(ext, extType)
     
    }

    
       // for downloading files
  downloKpiMesureDocument(type, kpiDocument, docs, frequencyId) {

    event.stopPropagation();
    switch (type) {
      case "downloadKpiMesureDocument":
        this._reviewService.downloadFile(
          frequencyId,
          "kpi-measure",
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

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  ngOnDestroy(){
    this.kpiMesureModalModalEventSubscription.unsubscribe();
  }

}
