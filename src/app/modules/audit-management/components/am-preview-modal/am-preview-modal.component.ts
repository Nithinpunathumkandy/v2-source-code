import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AmAuditInformationRequestService } from 'src/app/core/services/audit-management/am-audit/am-audit-information-request/am-audit-information-request.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
// import { AssetManagementService } from 'src/app/core/services/asset-management/asset-management-service/asset-management.service';
// import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';


@Component({
	selector: 'app-am-preview-modal',
	templateUrl: './am-preview-modal.component.html',
	styleUrls: ['./am-preview-modal.component.scss']
})
export class AmPreviewModalComponent implements OnInit {

	@Input('source') iFrameSource: any;
	@Output()
	close: EventEmitter<any> = new EventEmitter<any>();
	fileUrl: any;

	constructor(
		private _imageService: ImageServiceService,
		private _auditManagementService: AuditManagementService,
		private _documentFileService: DocumentFileService
	) { }

	ngOnInit(): void {
		// console.log('in premodel');
	}

	checkExtension(ext, extType) {
		var res = this._imageService.checkFileExtensions(ext, extType);
		return res;
	}
	closePreviewModal() {
		//console.log('close clicked');
		this.close.emit(0);
	}

	createImagePreview(type, token) {
		// console.log('in img');
		return this._imageService.getThumbnailPreview(type, token);
	}

	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	downloadFile() {

		if (this.iFrameSource.component == 'information-request')
			this._auditManagementService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId.am_audit_information_request_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, null, this.iFrameSource.file_details);
		if (this.iFrameSource.component == 'audit-document')
			this._auditManagementService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details?.id, null, this.iFrameSource.file_details.title, null, this.iFrameSource.file_details);
		if (this.iFrameSource.component == 'audit-meeting')
			this._auditManagementService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId.meeting_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, null, this.iFrameSource.file_details);
		if (this.iFrameSource.component == 'document-version')
			this._documentFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId.document_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, null, this.iFrameSource.file_details);
		if (this.iFrameSource.component == 'test-plan-document')
			this._auditManagementService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId.am_audit_test_plan_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, null, this.iFrameSource.file_details);
		if (this.iFrameSource.component == 'corrective-action')
			this._auditManagementService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId.finding_corrective_action_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, null, this.iFrameSource.file_details);
		if (this.iFrameSource.component == 'csa-answer-document')
			this._auditManagementService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId.am_audit_control_self_assessment_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, null, this.iFrameSource.file_details);
			if (this.iFrameSource.component == 'csa-answer-update-document')
			this._auditManagementService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId.am_audit_control_self_assessment_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.name, this.iFrameSource.componentId?.id, this.iFrameSource.file_details);

	}



}
