import { Component, Input, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { MsAuditDocumetsVersionStore } from 'src/app/stores/ms-audit-management/ms-audit-documets-version/ms-audit-version-documents.store';

@Component({
  selector: 'app-non-confirmity-inner-documents',
  templateUrl: './non-confirmity-inner-documents.component.html',
  styleUrls: ['./non-confirmity-inner-documents.component.scss']
})
export class NonConfirmityInnerDocumentsComponent implements OnInit {
  @Input('source') childData: any;
  @Input('type') type: any;
  @Input('index') index: any;
  @Input('mainParent') mainParent: any;
  @Input('childParent') childParent: any;
  MsAuditDocumetsVersionStore = MsAuditDocumetsVersionStore
  AuditNonConfirmityStore = AuditNonConfirmityStore
  constructor() { }

  ngOnInit(): void {
    
  }

  generateIdforString(id:number){
    return `id${id.toString()}`;

  }

  getOrganisationMsTypeData(data,type,loopType){
    AuditNonConfirmityStore.getOrganisationMsTypeData(data,type,loopType)
  }

}
