import { Component, ChangeDetectorRef,OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ByDocumentService } from 'src/app/core/services/business-assessments/assessments/by-document/by-document.service';
import { ByDocumentStore } from 'src/app/stores/business-assessments/assessments/by-document.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  selector: 'app-assessment-document',
  templateUrl: './assessment-document.component.html',
  styleUrls: ['./assessment-document.component.scss']
})
export class AssessmentDocumentComponent implements OnInit {

  ByDocumentStore = ByDocumentStore;
    subMenuItems: { id: number, title: string }[];
    AppStore = AppStore;
    SubMenuItemStore = SubMenuItemStore;
    AuthStore = AuthStore;
    emptyMessage="no_data_found";
    constructor(
        private _byDocumentService: ByDocumentService,
        private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
        private _documentFileService:DocumentFileService,
        private _imageService:ImageServiceService
    ) { }


    ngOnInit() {
    

      NoDataItemStore.setNoDataItems({title: "assessment_nodata_title"});


      this._byDocumentService.getByDocumentSummary().subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
      });
      
      this._byDocumentService.getExcellentByDocuments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
              
  }

  getData(type: string) {
      this.setStatus(type);
      

      switch (type) {
          case "excellent":
              if(ByDocumentStore.excellent_status == 'Active')
              this._byDocumentService.getExcellentByDocuments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
              
              break;

          case "good":
              if (ByDocumentStore.good_status == 'Active') {
                  this._byDocumentService.getGoodByDocuments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
              }
              break;

          case "average":
              if (ByDocumentStore.average_status == 'Active') {
                  this._byDocumentService.getAverageByDocuments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
              }
              break;

          case "below_average":
              if (ByDocumentStore.below_status == 'Active') {
                  this._byDocumentService.getBelowAverageByDocuments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
              }
              break;
      }
      this._utilityService.detectChanges(this._cdr);
  }

  createImagePreview(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }

  setStatus(type) {
      switch (type) {
          case "excellent":
              if (ByDocumentStore.excellent_status != 'Active')
                  ByDocumentStore.excellent_status = 'Active';
              else
                  ByDocumentStore.excellent_status = 'Inactive';
              break;

          case "good":
              if (ByDocumentStore.good_status != 'Active')
                  ByDocumentStore.good_status = 'Active';
              else
                  ByDocumentStore.good_status = 'Inactive';
              break;
          case "average":
              if (ByDocumentStore.average_status != 'Active')
                  ByDocumentStore.average_status = 'Active';
              else
                  ByDocumentStore.average_status = 'Inactive';
              break;

          case "below_average":
              if (ByDocumentStore.below_status != 'Active')
                  ByDocumentStore.below_status = 'Active';
              else
                  ByDocumentStore.below_status = 'Inactive';
              break;
      }
  }

  getDefaultGeneralImage(){
    return this._imageService.getDefaultImageUrl('general');
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  ngOnDestroy() {
      SubMenuItemStore.makeEmpty();
      ByDocumentStore.summary_loaded = false;
  }

}
