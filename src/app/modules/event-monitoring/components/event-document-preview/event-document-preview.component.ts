import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

@Component({
  selector: 'app-event-document-preview',
  templateUrl: './event-document-preview.component.html',
  styleUrls: ['./event-document-preview.component.scss']
})
export class EventDocumentPreviewComponent implements OnInit {

  @Input('source') iFrameSource: any;
	@Output()
	close: EventEmitter<any> = new EventEmitter<any>();
	fileUrl: any;

	constructor(
		private _imageService: ImageServiceService,
    private _eventFileService: EventFileServiceService
	) { }

	ngOnInit(): void {
		
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
		
		return this._imageService.getThumbnailPreview(type, token);
	}

	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	downloadFile() {

		if (this.iFrameSource.component == 'event-file')
			this._eventFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId, this.iFrameSource.file_details.process_activity_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
	
	}


}
