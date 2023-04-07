import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditDocumetsVersionStore } from 'src/app/stores/ms-audit-management/ms-audit-documets-version/ms-audit-version-documents.store';

@Component({
  selector: 'app-inner-document-versions',
  templateUrl: './inner-document-versions.component.html',
  styleUrls: ['./inner-document-versions.component.scss']
})
export class InnerDocumentVersionsComponent implements OnInit {
  @Input('source') childData: any;
  @Input('type') type: any;
  @Input('index') index: any;
  MsAuditDocumetsVersionStore = MsAuditDocumetsVersionStore
  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    
  }

  changeDocumetVersion(data){
    MsAuditDocumetsVersionStore.setSelectedDocuments(data) 
 }

}
