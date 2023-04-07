import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef,Renderer2, ChangeDetectorRef } from '@angular/core';
import { BpmFileService } from 'src/app/core/services/bpm/bpm-file/bpm-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnChanges, OnInit {
  
  @ViewChild("popup") popup: ElementRef;
  @Input('source') infoObject: any;

  activeIndex = null;
  hover = false;
  selectedItem = null;

  userDetails_loaded: boolean = false;

  constructor(
    private _bpmFileService: BpmFileService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef
  ) { 
  }

  ngOnInit(): void {

    setTimeout(() => {

      window.addEventListener('click',this.clickEvent,false)
      
    }, 1000);
  }
  ngOnChanges(changes: SimpleChanges) {
    let change = changes['infoObject']
    
    if (change) {
      this.userDetails_loaded = true
    }

  }
  createImageUrl(token,type) {
    return this._bpmFileService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }


  mouseHover(event, index) {
    if (this.activeIndex >= 0 && this.activeIndex == index) {
      this.activeIndex = null;
      this.hover = false;
    } else {
      this.activeIndex = index;
      this.hover = true;
      if (this.popup) {
        this._renderer2.setStyle(this.popup.nativeElement, "display", "block");
      }
    }
  }

  clickEvent = (event: any): void => {
    this.activeIndex = null;
    this.hover = false;
    this._utilityService.detectChanges(this._cdr)
  }

}
