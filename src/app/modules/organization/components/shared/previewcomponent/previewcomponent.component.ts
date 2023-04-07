import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';

@Component({
  selector: 'app-previewcomponent',
  templateUrl: './previewcomponent.component.html',
  styleUrls: ['./previewcomponent.component.scss']
})
export class PreviewcomponentComponent implements OnInit {
  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(private _imageService: ImageServiceService, private _organizationFileService: OrganizationfileService, private _documentFileService: DocumentFileService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void { 
  }

  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }

  closePreviewModal(){
    //console.log('close clicked');
    this.close.emit(0);
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile(){

    // console.log(this.iFrameSource.comonent)

    if(this.iFrameSource.component=='document-version')
    this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    else
    this._organizationFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.id,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
  }

  checkIeorNot(){
    return this._helperService.checkBrowser();
  }

}
