import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-document-review-history',
  templateUrl: './document-review-history.component.html',
  styleUrls: ['./document-review-history.component.scss']
})
export class DocumentReviewHistoryComponent implements OnInit {

  DocumentsStore=DocumentsStore
  AppStore=AppStore
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore
  historyEmptyList = 'kh_review_no_history';

  constructor(
    private _documentService:DocumentsService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getReviewHistory()
  }

  getReviewHistory(){
    this._documentService.getFrequentReviewUpdates().subscribe(data=>{
      this._utilityService.detectChanges(this._cdr);
    })
    this._utilityService.detectChanges(this._cdr);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {    
    this._eventEmitterService.dismissReviewHistory();  
  }

  createImageUrl(token) {        
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  ngOnDestroy(){    
    DocumentsStore.unsetReviewUpdate()
  }

}
