import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KhRoutingModule } from './kh-routing.module';
import { DocumentsComponent } from './pages/documents/documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DocumentsListComponent } from './pages/documents/pages/list/documents-list.component';
import { FolderRenameComponent } from './pages/documents/pages/add/folder-rename/folder-rename.component';
import { DocumentListLoaderComponent } from './components/document-list-loader/document-list-loader.component';
import { DocumentSearchComponent } from './pages/documents/components/document-search/document-search.component';
import { DocumentFolderDetailsComponent } from './pages/documents/components/document-folder-details/document-folder-details.component';
import { AddFolderComponent } from './pages/documents/pages/add/add-folder/add-folder.component';
import { QuickUploadComponent } from './pages/documents/pages/add/quick-upload/quick-upload.component';
import { AddFileComponent } from './pages/documents/pages/add/add-file/add-file.component';


//Document change request
import { ChangeRequestComponent } from './pages/change-request/change-request.component';
import { ChangeRequestListComponent } from './pages/change-request/pages/change-request-list/change-request-list.component';
import { AddChangeRequestComponent } from './pages/change-request/pages/add-change-request/add-change-request.component';
import { EditChangeRequestComponent } from './pages/change-request/pages/edit-change-request/edit-change-request.component';
import { ChangeRequestDetailsComponent } from './pages/change-request/pages/change-request-details/change-request-details.component';
import { InfoComponent } from './pages/change-request/pages/change-request-details/info/info.component';
import { CrMainClauseComponent } from './pages/change-request/components/cr-main-clause/cr-main-clause.component';
import { CrNotesComponent } from './pages/change-request/components/cr-notes/cr-notes.component';
import { CrChildDataComponent } from './pages/change-request/components/cr-child-data/cr-child-data.component';
import { InternalChangeRequestComponent } from './pages/change-request/pages/change-request-details/internal-change-request/internal-change-request.component';
import { ExternalChangeRequestComponent } from './pages/change-request/pages/change-request-details/external-change-request/external-change-request.component';
import { CrWorkflowComponent } from './pages/change-request/components/cr-workflow/cr-workflow.component';
import { CrWorkflowHistoryComponent } from './pages/change-request/components/cr-workflow-history/cr-workflow-history.component';
import { CrCommentsFormComponent } from './pages/change-request/components/cr-comments-form/cr-comments-form.component';
import { TemplateListPopupComponent } from './pages/templates/components/template-list-popup/template-list-popup.component';
import { DocumentTypePopupComponent } from './pages/documents/components/document-type-popup/document-type-popup.component';
import { DocumentDetailsComponent } from './pages/documents/pages/document-details/document-details.component';
import { DocumentInfoComponent } from './pages/documents/pages/document-details/pages/document-info/document-info.component';
import { InternalDocumentComponent } from './pages/documents/pages/document-details/pages/document-info/internal-document/internal-document.component';
import { ExternalDocumentComponent } from './pages/documents/pages/document-details/pages/document-info/external-document/external-document.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardDetailsComponent } from './pages/dashboard/dashboard-details/dashboard-details.component';
import { KhTemplateListComponent } from './pages/templates/pages/kh-template-list/kh-template-list.component';
import { KhTemplateDetailsComponent } from './pages/templates/pages/kh-template-details/kh-template-details.component';
import { KhTemplateInfoComponent } from './pages/templates/pages/kh-template-details/kh-template-info/kh-template-info.component';
import { KhTemplateInternalComponent } from './pages/templates/pages/kh-template-details/kh-template-internal/kh-template-internal.component';
import { KhTemplateExternalComponent } from './pages/templates/pages/kh-template-details/kh-template-external/kh-template-external.component';
import { TemplateMainClauseComponent } from './pages/templates/components/template-main-clause/template-main-clause.component';
import { TemplateNotesComponent } from './pages/templates/components/template-notes/template-notes.component';
import { TemplateChildDataComponent } from './pages/templates/components/template-child-data/template-child-data.component';
import { KhTemplateAddComponent } from './pages/templates/pages/kh-template-add/kh-template-add.component';
import { AddSectionComponentComponent } from './pages/documents/pages/document-details/components/add-section-component/add-section-component.component';
import { InternalDocumentLeftMenuComponent } from './pages/documents/pages/document-details/components/internal-document-left-menu/internal-document-left-menu.component';
import { AddNotesComponentComponent } from './pages/documents/pages/document-details/components/add-notes-component/add-notes-component.component';
import { AddChecklistComponentComponent } from './pages/documents/pages/document-details/components/add-checklist-component/add-checklist-component.component';
import { WorkflowSubmitPopupComponent } from './pages/documents/pages/document-details/components/workflow-submit-popup/workflow-submit-popup.component';
import { WorkflowActionPopupComponent } from './pages/documents/pages/document-details/components/workflow-action-popup/workflow-action-popup.component';
import { DocumentReviewHistoryComponent } from './pages/documents/pages/document-details/components/document-review-history/document-review-history.component';
import { WorkflowPopupComponent } from './pages/documents/pages/document-details/components/workflow-popup/workflow-popup.component';
import { WorkflowHistoryPopupComponent } from './pages/documents/pages/document-details/components/workflow-history-popup/workflow-history-popup.component';
import { DocumentCheckinPopupComponent } from './pages/documents/pages/document-details/components/document-checkin-popup/document-checkin-popup.component';
import { WorkflowEditPopupComponent } from './pages/documents/pages/document-details/components/workflow-edit-popup/workflow-edit-popup.component';
import { ActivityLogComponent } from './pages/documents/pages/document-details/components/activity-log/activity-log.component';
import { ActivityLogLoaderComponent } from './pages/documents/pages/document-details/components/activity-log-loader/activity-log-loader.component';
import { ReviewUpdatePopupComponent } from './pages/documents/pages/document-details/components/review-update-popup/review-update-popup.component';
import { PreviewComponent } from './pages/documents/components/preview/preview.component';
import { ExternalDocumentSectionRecursiveModalComponent } from './pages/documents/pages/document-details/components/external-document-section-recursive-modal/external-document-section-recursive-modal.component';
import { InternalDocumentSectionRecursiveModalComponent } from './pages/documents/pages/document-details/components/internal-document-section-recursive-modal/internal-document-section-recursive-modal.component';
import { MasterDocumentListComponent } from './pages/master-document-list/master-document-list.component';
import { MasterDetailsComponent } from './pages/master-document-list/pages/master-details/master-details.component';
import { MasterListComponent } from './pages/master-document-list/pages/master-list/master-list.component';
import { MasterAddComponent } from './pages/master-document-list/pages/master-add/master-add.component';
import { KhReportsComponent } from './pages/kh-reports/kh-reports.component';
import { KhCountListComponent } from './pages/kh-reports/kh-count-list/kh-count-list.component';
import { KhCountTypeComponent } from './pages/kh-reports/kh-count-type/kh-count-type.component';
import { MasterDetailsInfoComponent } from './pages/master-document-list/pages/master-details/master-details-info/master-details-info.component';
import { MasterDocumentSearchComponent } from './pages/master-document-list/components/master-document-search/master-document-search.component';
import { KhWorkflowComponent } from './pages/workflow/kh-workflow.component';
import { KhWorkflowAddComponent } from './pages/workflow/pages/kh-workflow-add/kh-workflow-add.component';
import { KhWorkflowDetailsComponent } from './pages/workflow/pages/kh-workflow-details/kh-workflow-details.component';
import { KhWorkflowListComponent } from './pages/workflow/pages/kh-workflow-list/kh-workflow-list.component';
import { KhWorkflowDetailsLoaderComponent } from './pages/workflow/components/kh-workflow-details-loader/kh-workflow-details-loader.component';
import { KhTemplateListLoaderComponent } from './pages/templates/components/kh-template-list-loader/kh-template-list-loader.component';
import { KhDocTypeViewMoreComponent } from './pages/templates/components/kh-doc-type-view-more/kh-doc-type-view-more.component';
import { MasterDocumentRenewComponent } from './pages/master-document-list/components/master-document-renew/master-document-renew.component';
import { MasterDocumentReviewHistoryComponent } from './pages/master-document-list/components/master-document-review-history/master-document-review-history.component';
import { MasterDocumentReviewHistoryLoaderComponent } from './pages/master-document-list/components/master-document-review-history-loader/master-document-review-history-loader.component';
import { ExternalDocumentDetailsLoaderComponent } from './components/external-document-details-loader/external-document-details-loader.component';
import { InternalDocumentDetailsLoaderComponent } from './components/internal-document-details-loader/internal-document-details-loader.component';
import { EditFileComponent } from './pages/documents/pages/add/edit-file/edit-file.component';
import { KhOverviewComponent } from './pages/kh-overview/kh-overview.component';
import { ShareDocumentModelComponent } from './components/share-document-model/share-document-model.component';
import { DocumentMappingComponent } from './pages/documents/pages/document-details/pages/document-info/document-mapping/document-mapping.component';
import { AddRiskMappingKhComponent } from './pages/documents/pages/document-details/components/add-risk-mapping-kh/add-risk-mapping-kh.component';
import { AddAuditFindingModalKhComponent } from './pages/documents/pages/document-details/components/add-audit-finding-modal-kh/add-audit-finding-modal-kh.component';
import { KhDashboardLoaderComponent } from './components/kh-dashboard-loader/kh-dashboard-loader.component';



@NgModule({
  declarations: [
    DocumentsComponent,
    DocumentsListComponent,
    ChangeRequestComponent,
    ChangeRequestListComponent,
    AddChangeRequestComponent,
    EditChangeRequestComponent,    
    ChangeRequestDetailsComponent, 
    InfoComponent, 
    CrMainClauseComponent, 
    CrNotesComponent, 
    CrChildDataComponent,    
    FolderRenameComponent,
    DocumentListLoaderComponent,
    DocumentSearchComponent,
    DocumentFolderDetailsComponent,
    AddFolderComponent,
    QuickUploadComponent,
    AddFileComponent,
    EditFileComponent,
    InternalChangeRequestComponent,
    ExternalChangeRequestComponent,
    CrWorkflowComponent,
    CrWorkflowHistoryComponent,
    CrCommentsFormComponent,
    
    TemplateListPopupComponent,
    DocumentTypePopupComponent,
    DocumentDetailsComponent,
    DocumentInfoComponent,
    InternalDocumentComponent,
    ExternalDocumentComponent,
    DashboardComponent,
    DashboardDetailsComponent,
    KhTemplateListComponent,
    KhTemplateDetailsComponent,
    KhTemplateInfoComponent,
    KhTemplateInternalComponent,
    KhTemplateExternalComponent,
    TemplateMainClauseComponent,
    TemplateNotesComponent,
    TemplateChildDataComponent,
    KhTemplateAddComponent,
    AddSectionComponentComponent,
    InternalDocumentLeftMenuComponent,
    AddNotesComponentComponent,
    AddChecklistComponentComponent,
    WorkflowSubmitPopupComponent,
    WorkflowActionPopupComponent,
    DocumentReviewHistoryComponent,
    WorkflowPopupComponent,
    WorkflowHistoryPopupComponent,
    DocumentCheckinPopupComponent,
    WorkflowEditPopupComponent,
    ActivityLogComponent,
    ActivityLogLoaderComponent,
    ReviewUpdatePopupComponent,
    PreviewComponent,
    ExternalDocumentSectionRecursiveModalComponent,
    InternalDocumentSectionRecursiveModalComponent,
    MasterDocumentListComponent,
    MasterListComponent,
    MasterAddComponent,
    MasterDetailsComponent,
    KhReportsComponent,
    KhCountListComponent,
    KhCountTypeComponent,
    MasterDetailsInfoComponent,
    MasterDocumentSearchComponent,
    KhWorkflowComponent,
    KhWorkflowAddComponent,
    KhWorkflowDetailsComponent,
    KhWorkflowListComponent,
    KhWorkflowDetailsLoaderComponent,
    KhTemplateListLoaderComponent,
    KhDocTypeViewMoreComponent,
    MasterDocumentRenewComponent,
    MasterDocumentReviewHistoryComponent,
    MasterDocumentReviewHistoryLoaderComponent,
    ExternalDocumentDetailsLoaderComponent,
    InternalDocumentDetailsLoaderComponent,
    KhOverviewComponent,
    ShareDocumentModelComponent,
    DocumentMappingComponent,
    AddRiskMappingKhComponent,
    AddAuditFindingModalKhComponent,
    KhDashboardLoaderComponent
  ],
  imports: [
    CommonModule,
    KhRoutingModule,
    SharedModule,
    NgxPaginationModule,
  ]
})
export class KhModule { }
