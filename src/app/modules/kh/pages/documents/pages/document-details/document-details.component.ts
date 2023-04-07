import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { KhSettingsService } from 'src/app/core/services/settings/organization_settings/kh-settings/kh-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;


  KHSettingStore=KHSettingStore;
  DocumentsStore=DocumentsStore; 
  AppStore=AppStore;
  constructor(
    private _KhSettingsService:KhSettingsService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private route: ActivatedRoute,
    private documentsService: DocumentsService,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit(): void {
    
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.getKHSettingsPermission()

  }


  getKHSettingsPermission(){
    this._KhSettingsService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }



scrollEvent = (event: any): void => {
  if(event.target.documentElement){
    const number = event.target.documentElement.scrollTop;
    if(number > 50){
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
      this._renderer2.addClass(this.navBar.nativeElement,'affix');
    }
    else{
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      this._renderer2.removeClass(this.navBar.nativeElement,'affix');
    }
  }
}

}
