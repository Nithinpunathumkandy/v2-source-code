import { Component, Input, OnInit } from '@angular/core';
import { AmAuditTestPlanStore } from 'src/app/stores/audit-management/am-audit/am-audit-test-plan.store';

@Component({
  selector: 'app-am-inner-document-versions',
  templateUrl: './am-inner-document-versions.component.html',
  styleUrls: ['./am-inner-document-versions.component.scss']
})
export class AmInnerDocumentVersionsComponent implements OnInit {
  @Input('source') childData: any;
  @Input('type') type: any;
  @Input('index') index: any;
  AmAuditTestPlanStore = AmAuditTestPlanStore
  constructor() { }

  ngOnInit(): void {
  }

  changeDocumetVersion(data){
    AmAuditTestPlanStore.setSelectedDocuments(data) 
 }
}
