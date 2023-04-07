import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ByAuditorService } from 'src/app/core/services/internal-audit/annual-plan/by-auditor/by-auditor.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ByAuditorsStore } from 'src/app/stores/internal-audit/annual-plan/by-auditor/by-auditor-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-by-auditor',
  templateUrl: './by-auditor.component.html',
  styleUrls: ['./by-auditor.component.scss']
})
export class ByAuditorComponent implements OnInit ,OnDestroy {

  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AppStore = AppStore;
  ByAuditorsStore = ByAuditorsStore;
  constructor(private _byAuditorService:ByAuditorService,
    private _cdr: ChangeDetectorRef,
    private _imageService : ImageServiceService,
    private _router: Router,
    private _utilityService: UtilityService,) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;

    this.pageChange(1);

  }

  pageChange(newPage: number = null){
    if (newPage) ByAuditorsStore.setCurrentPage(newPage);
    this._byAuditorService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  gotoDetails(user){
    this._router.navigateByUrl('/internal-audit/anual-plan/by_auditor/'+user.user_id);
  }



  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    ByAuditorsStore.loaded = false;
  }

}
