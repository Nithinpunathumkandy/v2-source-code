import { Component, Input, OnInit,EventEmitter,Output } from '@angular/core';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';


@Component({
  selector: 'app-chat-thumbnail-preview',
  templateUrl: './chat-thumbnail-preview.component.html',
  styleUrls: ['./chat-thumbnail-preview.component.scss']
})
export class ChatThumbnailPreviewComponent implements OnInit {
  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  constructor(private _imageService: ImageServiceService,
    private _discussionBotService: DiscussionBotService) { }

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

}
