import { Component, Input, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { BcpStore } from 'src/app/stores/bcm/bcp/bcp-store';

@Component({
  selector: 'app-calltree-user',
  templateUrl: './calltree-user.component.html',
  styleUrls: ['./calltree-user.component.scss']
})
export class CalltreeUserComponent implements OnInit {
  
  AppStore = AppStore;
  AuthStore = AuthStore;
  BcpStore = BcpStore;
  @Input('details') loopItems: any[] = [];
  @Input('showButtons') showButtons: boolean = true;
  constructor(private _imageService: ImageServiceService, private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  createImageUrl(token){
    return this._imageService.getThumbnailPreview('user-profile-picture',token);
  }

  // Return Default Image
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  addUser(id){
    this._eventEmitterService.addUserToCallTreeModal(id);
  }

  editCallTree(callTreeItem){
    this._eventEmitterService.callTreeChangeEvent(callTreeItem);
  }

  deleteCallTreeUser(id: number){
    this._eventEmitterService.callTreeChangeEvent(id);
  }

}
