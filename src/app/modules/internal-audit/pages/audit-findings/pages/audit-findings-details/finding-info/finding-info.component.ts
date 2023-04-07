import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { FindingCommentsStore } from 'src/app/stores/internal-audit/audit-findings/finding-comment/finding-comment-store';
import { FindingCommentService } from 'src/app/core/services/internal-audit/audit-findings/finding-comment/finding-comment.service';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';

// amChart imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { AuditSettingStore } from 'src/app/stores/settings/audit-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-finding-info',
  templateUrl: './finding-info.component.html',
  styleUrls: ['./finding-info.component.scss']
})
export class FindingInfoComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('addQuickCorrectionModal', { static: true }) addQuickCorrectionModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('scroll') scroll: any;




  AuditFindingsStore = AuditFindingsStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  AuditStore = AuditStore;
  FindingCommentsStore = FindingCommentsStore;
  AuditSettingStore = AuditSettingStore;

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

  quickCorrectionEvent;
  popupControlEventSubscription: any;
  previewFocusSubscription:any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  comments;
  comment_id: number = null;
  ImpactAnalysesInfo = "bar";
  findingResolveCycleInfo = "pie";
  chartShow: boolean;
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _auditFindingsService: AuditFindingsService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _renderer2: Renderer2,
    private _findingCommentService: FindingCommentService,
    private _internalAuditFileService: InternalAuditFileService,
    private _router: Router,
    private _discussionBotService: DiscussionBotService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    ) { }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }


  ngOnInit(): void {
    AppStore.showDiscussion = true;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            AuditStore.audit_id = null;
            this.gotoEditPage();
            break;
            case "go_to_audit":
						this.gotoAuditDetails()
					break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    // caling quick correction modal
    this.quickCorrectionEvent = this._eventEmitterService.quickCorrectionAddModalControl.subscribe(res => {
      this.closeQuickCorrectionModal();
    })


    // for deleting/activating/deactivating using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
        this.previewFocusSubscription=this._eventEmitterService.previewFocus.subscribe(res=>{
      this.setPreviewFocus();
    })

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    // getting details
    this.getAuditFindings();
  }

  getAuditFindings() {
    this.comments = null;
    this.comment_id = null;
    // findings/1/corrective-actions/1/comments?page=1
    DiscussionBotStore.setDiscussionMessage([]);
    DiscussionBotStore.setbasePath('/findings/');
    DiscussionBotStore.setDiscussionAPI(AuditFindingsStore.auditFindingId + '/comments')
    this._auditFindingsService.getItem(AuditFindingsStore.auditFindingId).subscribe(res => {
      if (res?.findingStatus?.id == 1) {
        // setting submenu items
        SubMenuItemStore.setSubMenuItems([
          { type: 'go_to_audit' },
          { type: 'edit_modal' },          
          { type: 'close', path: '../' }
        ]);
      } else {
        // setting submenu items
        SubMenuItemStore.setSubMenuItems([
          { type: 'go_to_audit' },
          { type: 'close', path: '../' }
        ]);
      }
      this.getCharts();
      this.downloadDiscussionThumbnial();
      this.getImagePrivew();
      this.showThumbnailImage();
      this.getDiscussions();
    })

  }

  gotoAuditDetails(){
		this._router.navigateByUrl("/internal-audit/audits/"+AuditFindingsStore?.findingsDetails?.audit_id)
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


  setPreviewFocus(){
    this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
  }

  imapctAnalysisChart() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("piechartAuditHoursdiv", am4charts.PieChart);
    var impactAnalysis = [];
    // Add data
    chart.data =  AuditFindingsStore.findingsDetails?.impact_analysis_details;

    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.maxWidth = 50;
    chart.legend.maxHeight = 80;
    chart.legend.scrollable = true;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    // pieSeries.labels.template.text = "";

    pieSeries.labels.template.radius = am4core.percent(-40);

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);

    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent == 0)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }


    am4core.options.autoDispose = true;
    this._utilityService.detectChanges(this._cdr);
  }


  getCompletedPercentageChart() {
    if (AuditFindingsStore?.findingsDetails?.finding_resolved_cycle_time != null) {
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
        let value = AuditFindingsStore?.findingsDetails?.finding_resolved_cycle_time?.hours;// set store values
        let animation = new am4core.Animation(hand, {
          property: "value",
          to: value
        }, 1000, am4core.ease.cubicOut).start();
      }, 2000);

      chart.hiddenState.properties.radius = am4core.percent(0);
    }
    // chart.logo.disabled = true;
  }


  getDiscussions() {
    this._discussionBotService.getDiscussionMessage().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  downloadDiscussionThumbnial() {
    DiscussionBotStore.setThumbnailDownloadAPI(AuditFindingsStore.auditFindingId + '/comments/')
  }

  showThumbnailImage() {
    DiscussionBotStore.setShowThumbnailAPI(AuditFindingsStore.auditFindingId + '/comments/')
  }

  getImagePrivew() {
    DiscussionBotStore.setDiscussionThumbnailAPI('/internal-audit/files/finding-comment-document/thumbnail?token=')
  }

  getFindingComment() {
    this._findingCommentService.getComments(AuditFindingsStore.auditFindingId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  processMessage() {
    var saveDate = {
      description: this.comments,
      finding_id: AuditFindingsStore.auditFindingId
    }

    return saveDate;
  }

  editComment(comment) {
    this.comment_id = comment.id;
    this.comments = comment.description;
  }

  deleteComment(comment_id: number) {
    this.comment_id = comment_id;
    if (this.comment_id) {
      this._findingCommentService.deleteComment(AuditFindingsStore.auditFindingId, this.comment_id).subscribe(res => {
        if (res) {
          this.getAuditFindings();
          this.mscrollToBottom();
        }
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  getMessage() {
    if (!this.comment_id) {
      this._findingCommentService.saveComment(AuditFindingsStore.auditFindingId, this.processMessage()).subscribe(res => {
        if (res) {
          this.getAuditFindings();
          this.mscrollToBottom();
        }
        this._utilityService.detectChanges(this._cdr);
      })

    } else {
      this._findingCommentService.upateComment(AuditFindingsStore.auditFindingId, this.processMessage(), this.comment_id).subscribe(res => {
        if (res) {
          this.getAuditFindings();
          this.mscrollToBottom();
        }
        this._utilityService.detectChanges(this._cdr);
      })

    }
    this.comments = null;
    this.comment_id = null;

  }

  mscrollToBottom() {
    setTimeout(() => {
      $(this.scroll.nativeElement).mCustomScrollbar("scrollTo", "bottom", {
        scrollEasing: "linear"
      });
    }, 25);
  }

  gotoEditPage() {
    AuditStore.audit_id = null;
    this._router.navigateByUrl('/internal-audit/findings/edit-findings');
    this._utilityService.detectChanges(this._cdr);
  }
  // gotoEditPage() {

  //   this._auditFindingsService
  //     .getItem(AuditFindingsStore.auditFindingId)
  //     .subscribe((res) => {
  //       console.log(res)
  //       this._router.navigateByUrl('/internal-audit/findings/edit-findings');
  //       this._utilityService.detectChanges(this._cdr);
  //     });
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

// Closes from preview
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
    case "findings":
      this._internalAuditFileService.downloadFile(
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
    case "findings":
      this._internalAuditFileService
        .getFilePreview(type, documents.finding_id, documentFile.id)
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
  if(type=='findings')
  return this._internalAuditFileService.getThumbnailPreview(type, token);
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

  // Returns default image
  // getDefaultImage(type) {
  //   return this._imageService.getDefaultImageUrl(type);
  // }

  // createPreviewUrl(type, token) {
  //   return this._imageService.getThumbnailPreview(type, token)
  // }


  // Returns image url according to type and token
  // createImageUrl(type, token) {
  //   return this._internalAuditFileService.getThumbnailPreview(type, token);
  // }

  // extension check function
  // checkExtension(ext, extType) {

  //   return this._imageService.checkFileExtensions(ext, extType)

  // }

  // createImagePreview(type, token) {
  //   return this._imageService.getThumbnailPreview(type, token)
  // }


  // for downloading files
  // downloadAuditFingingsDocument(type, auditFindings, auditFindingsDocument) {

  //   event.stopPropagation();
  //   switch (type) {
  //     case "downloadFindingsDocument":
  //       this._internalAuditFileService.downloadFile(
  //         "findings",
  //         auditFindings.id,
  //         auditFindingsDocument.id,
  //         null,
  //         auditFindingsDocument.name,
  //         auditFindingsDocument
  //       );
  //       break;

  //   }

  // }

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;

  }

  // preview modal open function
  // openPreviewModal(type, filePreview, auditFindingsDocument, auditFindings) {
  //   switch (type) {
  //     case "viewDocument":
  //       this.previewObject.component = "findings";
  //       break;
  //     default:
  //       break;
  //   }

  //   let previewItem = null;
  //   if (filePreview) {
  //     previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
  //     this.previewObject.preview_url = previewItem;
  //     this.previewObject.file_details = auditFindingsDocument;
  //     if (type == "viewDocument") {
  //       this.previewObject.componentId = auditFindings.id;
  //     } else {
  //       this.previewObject.componentId = auditFindings.id;
  //     }

  //     this.previewObject.uploaded_user =
  //       auditFindings.updated_by.length > 0 ? auditFindings.updated_by : auditFindings.created_by;
  //     this.previewObject.created_at = auditFindings.created_at;
  //     $(this.filePreviewModal.nativeElement).modal("show");
  //     this._utilityService.detectChanges(this._cdr);
  //   }
  // }



  // Closes from preview
  //   closePreviewModal(event) {
  //   $(this.filePreviewModal.nativeElement).modal("hide");
  //   this.previewObject.preview_url = "";
  //   this.previewObject.uploaded_user = null;
  //   this.previewObject.created_at = "";
  //   this.previewObject.file_details = null;
  //   this.previewObject.componentId = null;
  // }

  // for file preview

  // viewAuditFindingsDocument(type, auditFindings, auditFindingsDocument) {


  //   switch (type) {
  //     case "viewDocument":
  //       this._internalAuditFileService
  //         .getFilePreview("findings", auditFindings.id, auditFindingsDocument.id)
  //         .subscribe((res) => {
  //           var resp: any = this._utilityService.getDownLoadLink(
  //             res,
  //             auditFindings.name
  //           );
  //           this.openPreviewModal(type, resp, auditFindingsDocument, auditFindings);
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

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteQuickCorrection(status)
        break;
    }
  }

  deleteQuickCorrection(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditFindingsService.deleteQuickCorrection(AuditFindingsStore.auditFindingId, this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
        $(this.confirmationPopUp.nativeElement).modal('hide');      
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
    this.getAuditFindings();

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

  changeZIndex() {
    if ($(this.addQuickCorrectionModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.addQuickCorrectionModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.addQuickCorrectionModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
  }


  // for opening modal
  openFormModal() {
    FindingMasterStore.auditFindingId = null;
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
    this.getAuditFindings();
  }

  // edit quick correction part

  editQuickCorrection(correction) {
    this.quickCorrectionObject.values = {
      id: correction.id,
      title: correction.title,
      description: correction.description
    }
    this.quickCorrectionObject.type = 'Edit';
    this.openFormModal();
  }

  messageClicked(event) {
    AppStore.openDiscussionBox();
    this.comments = null;
    this.comment_id = null;
  }

  messageClosed(event) {
    AppStore.closeDiscussionBox();
    this.comments = null;
    this.comment_id = null;
  }

  discussionLargeClicked(event) {
    if (AppStore.discussionBoxLarge) AppStore.makeDiscussionBoxSmall();
    else AppStore.makeDiscussionBoxLarge();
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.quickCorrectionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    AppStore.showDiscussion = false;

  }


}
