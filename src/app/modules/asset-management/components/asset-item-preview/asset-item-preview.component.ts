import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AssetManagementService } from 'src/app/core/services/asset-management/asset-management-service/asset-management.service';
import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

@Component({
	selector: 'app-asset-item-preview',
	templateUrl: './asset-item-preview.component.html',
	styleUrls: ['./asset-item-preview.component.scss']
})
export class AssetItemPreviewComponent implements OnInit {

	@Input('source') iFrameSource: any;
	@Output()
	close: EventEmitter<any> = new EventEmitter<any>();
	fileUrl: any;

	constructor(
		private _assetRegisterService: AssetRegisterService,
		private _imageService: ImageServiceService,
		private _assetManagementService:AssetManagementService
	) { }

	ngOnInit(): void {
		console.log('in premodel');
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
		console.log('in img');
		return this._imageService.getThumbnailPreview(type, token);
	}

	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	downloadFile() {

		if (this.iFrameSource.component == 'process-activities')
			this._assetRegisterService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId, this.iFrameSource.file_details.process_activity_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
		else if(this.iFrameSource.component == 'maintenance-schedule')
		this._assetManagementService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId, this.iFrameSource.file_details.title,this.iFrameSource.file_details.id, this.iFrameSource.file_details,this.iFrameSource.schedule_id);
		else if(this.iFrameSource.component == 'maintenance-shutdown')
		this._assetManagementService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId, this.iFrameSource.file_details.title,this.iFrameSource.file_details.id, this.iFrameSource.file_details,this.iFrameSource.schedule_id,this.iFrameSource.shutdown_id);
		
		else
			this._assetRegisterService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
	}

}
