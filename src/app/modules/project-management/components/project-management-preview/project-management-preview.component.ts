import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store'
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { ProjectDiscussionService } from 'src/app/core/services/project-management/project-details/project-discussion/project-discussion.service';


@Component({
  selector: 'app-project-management-preview',
  templateUrl: './project-management-preview.component.html',
  styleUrls: ['./project-management-preview.component.scss']
})
export class ProjectManagementPreviewComponent implements OnInit {

  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  UsersStore = UsersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _discussionService: ProjectDiscussionService) { }

  ngOnInit(): void {
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  closePreviewModal() {
    this.close.emit(0);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    switch (this.iFrameSource.component) {
     
      case 'discussion-document':
        this._discussionService.downloadFile(this.iFrameSource.component, this.iFrameSource.id, this.iFrameSource.file_details.project_discussion_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break
      

    }

  }

}
