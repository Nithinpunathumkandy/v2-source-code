import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UtilityService } from "src/app/shared/services/utility.service";

declare var $: any;

@Component({
  selector: 'app-download-progress',
  templateUrl: './download-progress.component.html',
  styleUrls: ['./download-progress.component.scss']
})
export class DownloadProgressComponent implements OnInit {

  @ViewChild('downloadProgressDiv',{static:false}) downloadProgressDiv: ElementRef;
  DownloadProgressStore = DownloadProgressStore;
  styleChangeSubscription: any = null;

  constructor(private _imageService: ImageServiceService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    $(this.downloadProgressDiv.nativeElement).mCustomScrollbar();
  }

  /**
   * Returns whether file extension is of imgage, pdf, document or etc..
   * @param ext File extension
   * @param extType Type - image,pdf,doc etc..
   */
  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }

  cancel(position){
    DownloadProgressStore.clearDownloadFileDetails(position);
    this._utilityService.detectChanges(this._cdr);
  }

}
