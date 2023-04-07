import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, Renderer2, OnDestroy, ChangeDetectorRef, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { ExternalAuditMasterStore } from 'src/app/stores/external-audit/external-audit/external-audit-store';
import { ExternalAuditService } from 'src/app/core/services/external-audit/external-audit/external-audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ExternalAuditFileService } from 'src/app/core/services/external-audit/file-service/external-audit-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AppStore } from "src/app/stores/app.store";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';

// amChart imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-external-audit-info',
  templateUrl: './external-audit-info.component.html',
  styleUrls: ['./external-audit-info.component.scss']
})
export class ExternalAuditInfoComponent implements OnInit, OnDestroy {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ExternalAuditMasterStore = ExternalAuditMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  
  eaInfoPage = "pie";
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };
  
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _router: Router,
    private _utilityService: UtilityService,
    private _sanitizer: DomSanitizer,
    private _externalAuditFileService: ExternalAuditFileService,
    private _externalAuditService: ExternalAuditService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,) { }
    // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }


  ngOnInit(): void {
    AppStore.showDiscussion = false;
    // submenu
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.edit();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })


    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'edit_modal' },
      { type: 'close', path: '../' }

    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    // get all external audit single item details
    this.getExternalAudit();
  }


  // individual data 
  getExternalAudit() {
    this._externalAuditService.getItem(ExternalAuditMasterStore.auditId).subscribe(res => {
      this.getCharts();
      this._utilityService.detectChanges(this._cdr);
      });
      
    
  }
  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.findingsChart();
      });
    }, 1000);
  }

  findingsChart(){
    am4core.addLicense("CH199714744");
    
    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    
    // Add data
    chart.data = ExternalAuditMasterStore.individualExternalAuditItemId?.finding_chart_data?.findings_category_details;

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Findings Counts"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.maxWidth = 50;
    chart.legend.maxHeight = 80;
    chart.legend.scrollable = true;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = true;
    // pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.labels.template.relativeRotation = 90;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;

    pieSeries.labels.template.radius = am4core.percent(-40);

    pieSeries.labels.template.text = "";
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);

    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    
    this._utilityService.detectChanges(this._cdr);
    
  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;

  }

  getStatusColor(color){
    if(color){
      let colorClass = color.split('-');
      if(colorClass.length > 0) return 'draft-tag-'+colorClass[0];
      else return '';
    }
  }
  
  // calling edit
  edit() {
    this._externalAuditService
      .getItem(ExternalAuditMasterStore.auditId)
      .subscribe((res) => {
        this._router.navigateByUrl("/external-audit/external-audit/edit-external-audit");
        this._utilityService.detectChanges(this._cdr);
      });
  }
  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  // // Returns image url according to type and token
  // createImageUrl(type, token) {
  //   return this._externalAuditFileService.getThumbnailPreview(type, token);
  // }
  // // for downloading files
  // downloadAuditDocument(type, externalAudit, AuditDocument) {
  //   event.stopImmediatePropagation();
  //   switch (type) {
  //     case "downloadAuditDocument":
  //       this._externalAuditFileService.downloadFile(
  //         "audit-document",
  //         externalAudit.id,
  //         AuditDocument.id,
  //         null,
  //         AuditDocument.name,
  //         AuditDocument
  //       );
  //       break;

  //   }

  // }

  //  // preview modal open function
  // openPreviewModal(type, filePreview, AuditDocument, externalAudit) {
  //   switch (type) {
  //     case "viewDocument":
  //       this.previewObject.component = "audit-document";
  //       break;
  //     default:
  //       break;
  //   }

  //   let previewItem = null;
  //   if (filePreview) {
  //     previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
  //     this.previewObject.preview_url = previewItem;
  //     this.previewObject.file_details = AuditDocument;
  //     if (type == "viewDocument") {
  //       this.previewObject.componentId = externalAudit.id;
  //     } else {
  //       this.previewObject.componentId = externalAudit.id;
  //     }

  //     this.previewObject.uploaded_user =
  //       externalAudit.updated_by.length > 0 ? externalAudit.updated_by : externalAudit.created_by;
  //     this.previewObject.created_at = externalAudit.created_at;
  //     $(this.filePreviewModal.nativeElement).modal("show");
  //     this._utilityService.detectChanges(this._cdr);
  //   }
  // }



  // *// Closes from preview
  //   closePreviewModal(event) {
  //   $(this.filePreviewModal.nativeElement).modal("hide");
  //   this.previewObject.preview_url = "";
  //   this.previewObject.uploaded_user = null;
  //   this.previewObject.created_at = "";
  //   this.previewObject.file_details = null;
  //   this.previewObject.componentId = null;
  // }

  // // for file preview

  // viewAuditDocument(type, externalAudit, AuditDocument) {


  //   switch (type) {
  //     case "viewDocument":
  //       this._externalAuditFileService
  //         .getFilePreview("audit-document", externalAudit.id, AuditDocument.id)
  //         .subscribe((res) => {
  //           var resp: any = this._utilityService.getDownLoadLink(
  //             res,
  //             externalAudit.name
  //           );
  //           this.openPreviewModal(type, resp, AuditDocument, externalAudit);
  //         }),
  //         (error) => {
  //           if (error.status == 403) {
  //             this._utilityService.showErrorMessage(
  //               "Error",
  //               "Permission Denied"
  //             );
  //           } else {
  //             this._utilityService.showErrorMessage(
  //               "Error",
  //               "Unable to generate Preview"
  //             );
  //           }
  //         };
  //       break;
  //   }
  // }

  // createImagePreview(type, token) {
  //   return this._imageService.getThumbnailPreview(type, token)
  // }


  // // extension check function
  // checkExtension(ext, extType) {

  //   return this._imageService.checkFileExtensions(ext, extType)
   
  // }

  // Common File Upload Details Page Function Starts Here

openPreviewModal(type, filePreview, documentFiles, document) {
  this.previewObject.component=type


  let previewItem = null;
  if (filePreview) {
    previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.preview_url = previewItem;
    this.previewObject.file_details = documentFiles;
    this.previewObject.componentId = document.id;
    

    this.previewObject.uploaded_user =
    document.updated_by ? document.updated_by : document.created_by;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }
}

*// Closes from preview
  closePreviewModal(event) {
  $(this.filePreviewModal.nativeElement).modal("hide");
  this.previewObject.preview_url = "";
  this.previewObject.uploaded_user = null;
  this.previewObject.created_at = "";
  this.previewObject.file_details = null;
  this.previewObject.componentId = null;
}

downloadDocumentFile(type, document, docs?) {
  event.stopPropagation();
  switch (type) {
    case "audit-document":
      this._externalAuditFileService.downloadFile(
        "audit-document",
        document.external_audit_id,
        document.id,
        null,
        document.title,
        document
      );
      break;
    case "document-version":
      this._documentFileService.downloadFile(
        type,
        document.document_id,
        docs.id,
        null,
        document.title,
        docs
      );
      break;
  }
}

viewDocument(type, documents, documentFile) {
  switch (type) {
    case "viewDocument":
      this._externalAuditFileService
        .getFilePreview("audit-document", documents.id, documentFile.id)
        .subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(
            res,
            documents.title
          );
          this.openPreviewModal(type, resp, documentFile, documents);
        }),
        (error) => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage(
              "Error",
              "Permission Denied"
            );
          } else {
            this._utilityService.showErrorMessage(
              "Error",
              "Unable to generate Preview"
            );
          }
        };
      break;

      case "document-version":
        this._documentFileService
          .getFilePreview(type, documents.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;


  }
}

// Returns image url according to type and token
createImageUrl(type, token) {
  if(type=='audit-document')
  return this._externalAuditFileService.getThumbnailPreview(type, token);
  else
  return this._documentFileService.getThumbnailPreview(type, token);

}

// extension check function
checkExtension(ext, extType) {

  return this._imageService.checkFileExtensions(ext, extType)
 
}



createImagePreview(type, token) {
  return this._imageService.getThumbnailPreview(type, token)
}
// Common FIle Upload Details Page Function Ends Here


  assignUserValues(user){
    if(user){
    var userInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }

    userInfoObject.first_name = user?.first_name;
    userInfoObject.last_name = user?.last_name;
    userInfoObject.designation = user?.designation;
    userInfoObject.image_token = user?.image.token;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status.id
    userInfoObject.department = user?.department;
     return userInfoObject;
  }
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    am4core.disposeAllCharts();//Dispose amcharts
    ExternalAuditMasterStore.unsetIndividualExternalAuditItem()
  }


}

