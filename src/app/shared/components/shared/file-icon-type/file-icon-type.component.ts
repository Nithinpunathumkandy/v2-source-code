import { Component, OnInit } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

@Component({
  selector: 'app-file-icon-type',
  templateUrl: './file-icon-type.component.html',
  styleUrls: ['./file-icon-type.component.scss']
})
export class FileIconTypeComponent implements OnInit {

  width:number=30
  height:number=30
  constructor(private _imageService: ImageServiceService,) { }

  ngOnInit(): void {
  }

  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }

}
