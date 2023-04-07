import { Component, Input, OnInit, Output ,EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { BcmFileServiceService } from 'src/app/core/services/masters/bcm/bcm-file-service/bcm-file-service.service';
import { RiskManagementService } from 'src/app/core/services/risk-management/risk-management-service/risk-management.service';
import { BcmRiskTreatmentStore } from 'src/app/stores/bcm/risk-assessment/bc-risk-treatment.store';
import { RiskTreatmentStore } from 'src/app/stores/risk-management/risks/risk-treatment.store';

declare var $: any;
@Component({
  selector: 'app-bcm-preview',
  templateUrl: './bcm-preview.component.html',
  styleUrls: ['./bcm-preview.component.scss']
})
export class BcmPreviewComponent implements OnInit {

  @Input('source') iFrameSource: any;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  downloadMessage: string = '';
  constructor(private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
    private _riskManagementService: RiskManagementService,
    private _bcmFileService: BcmFileServiceService,) { }

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

  downloadFile() {
    $(this.loaderPopUp.nativeElement).modal('show');
    switch (this.iFrameSource.component) {
      case 'document-version':
        this._documentFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.document_id, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
      case 'test-and-exercise':
        this._bcmFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.test_and_exercise_id, this.iFrameSource.file_details.id, null,this.iFrameSource.file_details.title, this.iFrameSource.file_details );
        break;
        case 'test-and-exercise-outcomes':
        this._bcmFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.test_and_exercise_outcome_id, this.iFrameSource.file_details.id, null,this.iFrameSource.file_details.title, this.iFrameSource.file_details );
        break;
        case 'risk-treatment-documents':
        this._riskManagementService.downloadFile(this.iFrameSource.component, BcmRiskTreatmentStore.riskTreatmentDetails.id, this.iFrameSource.file_details.risk_treatment_update_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break;
        case 'action-plan-history':
        this._bcmFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId, this.iFrameSource.file_details.id, this.iFrameSource.updateId,this.iFrameSource.file_details.title, this.iFrameSource.file_details );
        break;
    }
    this.closeDownloadPopUp();
  }

  closeDownloadPopUp(){
    this._eventEmitterService.enablePreviewFocus()
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 1000);
  }

}
