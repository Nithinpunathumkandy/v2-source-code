import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";

@Component({
  selector: 'app-user-info-popup',
  templateUrl: './user-info-popup.component.html',
  styleUrls: ['./user-info-popup.component.scss']
})
export class UserInfoPopupComponent implements OnInit {

  @Input('source') userInfo: any;
  @Input('showbuttons') showButtons: boolean;
  constructor(private _router: Router, private _imageService: ImageServiceService) { }

  ngOnInit(): void {
  }

  createPreviewUrl(type,token){
    return this._imageService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  gotoUserDetails(userDetails){
    this._router.navigateByUrl('/human-capital/users/'+userDetails.id);
  }

}
