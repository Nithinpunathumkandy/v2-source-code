import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, Renderer2, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AppStore } from "src/app/stores/app.store";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
import { ExternalAuditFileService } from 'src/app/core/services/external-audit/file-service/external-audit-file.service';
import { FindingsService } from 'src/app/core/services/external-audit/findings/findings.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ExternalAuditMasterStore } from 'src/app/stores/external-audit/external-audit/external-audit-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
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
  selector: 'app-audit-finding-info',
  templateUrl: './audit-finding-info.component.html',
  styleUrls: ['./audit-finding-info.component.scss']
})
export class AuditFindingInfoComponent implements OnInit, OnDestroy {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('addQuickCorrectionModal', { static: true }) addQuickCorrectionModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('scroll') scroll: any;

  

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  FindingMasterStore = FindingMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ExternalAuditMasterStore = ExternalAuditMasterStore;
  EAImpactAnalysesInfo = "pie";
  EAfindingResolveCycleInfo = "pie";
  responsibleUserObject = [];
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  quickCorrectionObject = {
    type: null,
    values: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  selectedIndex: number = 0;
  quickCorrectionEvent;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  popupControlEventSubscription: any;

  comments;
  comment_id:number = null;
  constructor( 
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _router: Router,
    private _externalAuditFileService: ExternalAuditFileService,
    private _findingService: FindingsService,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _sanitizer: DomSanitizer,
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
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
           this.edit();
            break;
            case "go_to_audit":
            this.gotoAuditPage()
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      // scroll bar function for root cause analysis accordion
        // this.checkScrollBar();
         // caling quick correction modal
    this.quickCorrectionEvent = this._eventEmitterService.quickCorrectionAddModalControl.subscribe(res => {
      this.closeQuickCorrectionModal();
    })


    // for deleting/activating/deactivating using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })  
  
    
    })


    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'edit_modal' },
      { type: 'close', path: '../' }

    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    // get all external audit findings single item details
    this.getExternalAuditFindings();

  }


  // calling findings
  getExternalAuditFindings(){
    this._findingService.getItem(FindingMasterStore.auditFindingId).subscribe(res =>{
      FindingMasterStore.ea_audit_id=FindingMasterStore?.individualExternalAuditFindingItemId.external_audit.id;
      if (res?.findingStatus?.id == 1) {
        // setting submenu items
        SubMenuItemStore.setSubMenuItems([
          { type:'go_to_audit'},
          { type: 'edit_modal' },
          { type: 'close', path: '../' }
        ]);
      } else {
         // setting submenu items
         SubMenuItemStore.setSubMenuItems([
          { type:'go_to_audit'},
          { type: 'close', path: '../' }
        ]);
      }
      this.getCharts();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  gotoAuditPage(){
    this._router.navigateByUrl(`/external-audit/external-audit/${FindingMasterStore.ea_audit_id}`)
  }

  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.getCompletedPercentageChart();
        this.imapctAnalysisChart();
      });
    }, 1000);
  }

  getStatusColor(color){
    if(color){
      let colorClass = color.split('-');
      if(colorClass.length > 0) return colorClass[0];
      else return '';
    }
  }


  imapctAnalysisChart() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("piechartAuditHoursdiv", am4charts.PieChart);
    // Add data
    chart.data =  FindingMasterStore?.individualExternalAuditFindingItemId?.impact_analysis_details;

    //Add export
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "ImapctAnalysis"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    // chart.legend.valueLabels.template.disabled = true;
    // chart.legend.itemContainers.template.togglable = false;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0,0,0,0);
     
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    markerTemplate.fontSize = 10;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    // pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "title";
   
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }
    
    this._utilityService.detectChanges(this._cdr);
  }

  getCompletedPercentageChart() {
    if (FindingMasterStore?.individualExternalAuditFindingItemId?.finding_resolved_cycle_time != null) {
      am4core.addLicense("CH199714744");
      // Themes begin
      am4core.useTheme(am4themes_animated);


      //create chart
      let chart = am4core.create("gaugechartdiv", am4charts.GaugeChart);
      chart.innerRadius = am4core.percent(82);

      //Normal axis
      let axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
      axis.min = 0;
      axis.max = 365;
      axis.strictMinMax = true;
      axis.renderer.radius = am4core.percent(100);
      axis.renderer.inside = false;
      axis.renderer.line.strokeOpacity = 0;
      axis.renderer.ticks.template.disabled = false
      axis.renderer.ticks.template.strokeOpacity = 0;
      axis.renderer.ticks.template.length = 10;
      axis.renderer.grid.template.disabled = true;
      axis.renderer.labels.template.radius = 10;
      axis.renderer.labels.template.adapter.add("text", function (text) {
        return text;
      })

      //Axis for ranges
      let colorSet = new am4core.ColorSet();

      let axis2 = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
      axis2.min = 0;
      axis2.max = 365;
      axis2.strictMinMax = true;
      axis2.renderer.labels.template.disabled = true;
      axis2.renderer.ticks.template.disabled = true;
      axis2.renderer.grid.template.disabled = true;

      let range0 = axis2.axisRanges.create();
      range0.value = 0;
      range0.endValue = 182;
      range0.axisFill.fillOpacity = 1;
      range0.axisFill.fill = colorSet.getIndex(0);

      let range1 = axis2.axisRanges.create();
      range1.value = 182;
      range1.endValue = 365;
      range1.axisFill.fillOpacity = 1;
      range1.axisFill.fill = colorSet.getIndex(2);

      //Label
      let label = chart.radarContainer.createChild(am4core.Label);
      label.isMeasured = false;
      label.fontSize = 20;
      label.x = am4core.percent(50);
      label.y = am4core.percent(100);
      label.horizontalCenter = "middle";
      label.verticalCenter = "bottom";
      label.text = "182";

      //hand
      let hand = chart.hands.push(new am4charts.ClockHand());
      hand.axis = axis2;
      hand.innerRadius = am4core.percent(20);
      hand.startWidth = 10;
      hand.pin.disabled = true;
      hand.value = 182;

      hand.events.on("propertychanged", function (ev) {
        range0.endValue = ev.target.value;
        range1.value = ev.target.value;
        label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
        axis2.invalidate();
      });

      setInterval(function () {
        // console.log(ResidualRiskStore?.chartDetails?.mitigation_cycle_time);
        let value = FindingMasterStore?.individualExternalAuditFindingItemId?.finding_resolved_cycle_time?.hours;// set store values
        let animation = new am4core.Animation(hand, {
          property: "value",
          to: value
        }, 1000, am4core.ease.cubicOut).start();
      }, 2000);

      chart.hiddenState.properties.radius = am4core.percent(0);
    }
    // chart.logo.disabled = true;
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
    userDetial['status_id'] = users?.status_id? users.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;

  }

 
  // calling edit

  edit() {
    ExternalAuditMasterStore.auditId = null;
    this._findingService
      .getItem(FindingMasterStore.auditFindingId)
      .subscribe((res) => {
        this._router.navigateByUrl('/external-audit/audit-findings/edit-findings');
        this._utilityService.detectChanges(this._cdr);
      });
  }

  // // Returns default image
  // getDefaultImage(type) {
  //   return this._imageService.getDefaultImageUrl(type);
  // }

  // createPreviewUrl(type, token) {
  //   return this._imageService.getThumbnailPreview(type, token)
  // }


  // // Returns image url according to type and token
  // createImageUrl(type, token) {
  //   return this._externalAuditFileService.getThumbnailPreview(type, token);
  // }

  // createImagePreview(type, token) {
  //   return this._imageService.getThumbnailPreview(type, token)
  // }

  // // extension check function
  // checkExtension(ext, extType) {

  //   return this._imageService.checkFileExtensions(ext, extType)
   
  // }

  modalControl(status: boolean){
    switch (this.popupObject.type) {
      case '': this.deleteQuickCorrection(status)
        break;
    }
  }

  deleteQuickCorrection(status: boolean) {
    if (status && this.popupObject.id) {

      this._findingService.deleteQuickCorrection(FindingMasterStore.auditFindingId,this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }
 
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
    this.getExternalAuditFindings();

  }

  
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Quick Corrections?';
    this.popupObject.subtitle = 'delete_quick_correction_sub_title';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  changeZIndex(){
    if($(this.addQuickCorrectionModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.addQuickCorrectionModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.addQuickCorrectionModal.nativeElement,'overflow','auto');
    }
    else if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
  }

  // for opening modal
  openFormModal() {
    AuditFindingsStore.auditFindingId = null
    setTimeout(() => {
      $(this.addQuickCorrectionModal.nativeElement).modal('show');
    }, 50);
  }


  openQuickCorrectionModal() {
    this.quickCorrectionObject.type = 'Add';
    this.openFormModal();
  }

  closeQuickCorrectionModal() {

    setTimeout(() => {
      $(this.addQuickCorrectionModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 50);
    this.quickCorrectionObject.type = null;
    this.quickCorrectionObject.values = null;
    this.getExternalAuditFindings();
  }

  // edit quick correction part

  editQuickCorrection(correction) {
    this.quickCorrectionObject.values ={
      id:correction.id,
      title: correction.title,
      description: correction.description
    }
    this.quickCorrectionObject.type = 'Edit';
    this.openFormModal();
  }


  // // for downloading files
  // downloadAuditDocument(type, externalAuditFinding, AuditFindingDocument) {
  //   event.stopPropagation();
  //   switch (type) {
  //     case "downloadAuditFindingDocument":
  //       this._externalAuditFileService.downloadFile(
  //         "findings-document",
  //         externalAuditFinding.id,
  //         AuditFindingDocument.id,
  //         null,
  //         AuditFindingDocument.name,
  //         AuditFindingDocument
  //       );
  //       break;

  //   }

  // }

  //  // preview modal open function
  // openPreviewModal(type, filePreview, AuditFindingDocument, externalAuditFinding) {
  //   switch (type) {
  //     case "viewDocument":
  //       this.previewObject.component = "findings-document";
  //       break;
  //     default:
  //       break;
  //   }

  //   let previewItem = null;
  //   if (filePreview) {
  //     previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
  //     this.previewObject.preview_url = previewItem;
  //     this.previewObject.file_details = AuditFindingDocument;
  //     if (type == "viewDocument") {
  //       this.previewObject.componentId = externalAuditFinding.id;
  //     } else {
  //       this.previewObject.componentId = externalAuditFinding.id;
  //     }

  //     this.previewObject.uploaded_user =
  //     externalAuditFinding.updated_by.length > 0 ? externalAuditFinding.updated_by : externalAuditFinding.created_by;
  //     this.previewObject.created_at = externalAuditFinding.created_at;
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

  // viewAuditDocument(type, externalAuditFinding, AuditFindingDocument) {


  //   switch (type) {
  //     case "viewDocument":
  //       this._externalAuditFileService
  //         .getFilePreview("findings-document", externalAuditFinding.id, AuditFindingDocument.id)
  //         .subscribe((res) => {
  //           var resp: any = this._utilityService.getDownLoadLink(
  //             res,
  //             externalAuditFinding.name
  //           );
  //           this.openPreviewModal(type, resp, AuditFindingDocument, externalAuditFinding);
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
  console.log(type);
  
  event.stopPropagation();
  switch (type) {
    case "findings-document":
      this._externalAuditFileService.downloadFile(
        type,
        document.finding_id,
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
    case "findings-document":
      this._externalAuditFileService
        .getFilePreview(type, documents.id, documentFile.id)
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


// Returns default image
getDefaultImage(type) {
  return this._imageService.getDefaultImageUrl(type);
}

createPreviewUrl(type, token) {
  return this._imageService.getThumbnailPreview(type, token)
}


// Returns image url according to type and token
createImageUrl(type, token) {
  if(type=='findings-document')
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


  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy(){
     // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
     if (this.reactionDisposer) this.reactionDisposer();
     SubMenuItemStore.makeEmpty();
     BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
     am4core.disposeAllCharts();
     this.quickCorrectionEvent.unsubscribe();
     this.popupControlEventSubscription.unsubscribe();
     this.idleTimeoutSubscription.unsubscribe();
     this.networkFailureSubscription.unsubscribe();
    //  FindingMasterStore.unsetIndividualExternalAuditFindingItem()
    //  $(this.rcaAccordionScrollArea.nativeElement).mCustomScrollbar("destroy");

  }
}
