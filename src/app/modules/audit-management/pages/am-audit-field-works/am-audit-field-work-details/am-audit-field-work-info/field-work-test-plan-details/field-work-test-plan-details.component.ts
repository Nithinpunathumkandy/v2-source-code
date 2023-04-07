import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditFindingService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding.service';
import { AmAuditTestPlanService } from 'src/app/core/services/audit-management/am-audit/am-audit-test-plan/am-audit-test-plan.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { AmAuditTestPlanStore } from 'src/app/stores/audit-management/am-audit/am-audit-test-plan.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
import { AmAuditFieldWorkService } from 'src/app/core/services/audit-management/am-audit-field-work/am-audit-field-work.service';
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;
@Component({
  selector: 'app-field-work-test-plan-details',
  templateUrl: './field-work-test-plan-details.component.html',
  styleUrls: ['./field-work-test-plan-details.component.scss']
})
export class FieldWorkTestPlanDetailsComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  AmAuditTestPlanStore = AmAuditTestPlanStore;
  AmAuditFieldWorkStore = AmAuditFieldWorkStore;
  AppStore =AppStore;
  reactionDisposer:IReactionDisposer;
  findingModal:any;
  findingObject = {
    component: 'audit-test-plan',
    values: null,
    type: null,
  };

  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  currentTab = null;
  deleteEventSubscription:any;

  constructor(private _auditTestPlanService:AmAuditTestPlanService,
    private _cdr:ChangeDetectorRef,
    private _utilityService:UtilityService,
    private _route:ActivatedRoute,
    private _eventEmitterService:EventEmitterService,
    private _auditManagementService:AuditManagementService,
    private _documentFileService:DocumentFileService,
    private _humanCapitalService:HumanCapitalService,
    private _sanitizer:DomSanitizer,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _auditFindingService:AmAuditFindingService,
    private _fileUploadPopupService:FileUploadPopupService,
    private _renderer2:Renderer2,
    private _auditFieldWorkService: AmAuditFieldWorkService,
    ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "", subtitle: 'common_nodata_title'});
    this.reactionDisposer = autorun(() => {
      if(AmAuditTestPlanStore?.individualTestPlanDetails?.am_audit_test_plan_status?.type == 'in-progress'){
        var subMenuItems = [
          {activityName:null, submenuItem: {type: 'complete'}},
          { activityName: null, submenuItem: { type: 'close', path: AppStore.previousUrl } },
        ]
        this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      }
      else {
        var subMenuItem = [
          { activityName: null, submenuItem: { type: 'close', path: AppStore.previousUrl } },
        ]
        this._helperService.checkSubMenuItemPermissions(3600, subMenuItem);
      }
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "complete":         
              this.completeTestPlan();
            break;         
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.getTestPlanDetails();
    this.findingModal = this._eventEmitterService.amAuditFindingModal.subscribe(item => {
      this.closeFormModal();
    })

    
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalSelect(item);
    })
    this.getFindingProgress();
  }
  getTestPlanDetails(){
    let id: number;
    this._route.params.subscribe(params => {
      if(AmAuditTestPlanStore.auditTestPlanId){
        id=AmAuditTestPlanStore.auditTestPlanId;
      }
      else
      id = +params['test_id']; // (+) converts string 'id' to a number
      AmAuditTestPlanStore.setAuditTestPlanId(id);
    this._auditTestPlanService.getItem(id).subscribe(res => {
      this.getFindingProgress();
      this._utilityService.detectChanges(this._cdr)
    })
  })
  }

 
  openFindingPopup() {
    this.findingObject.type = 'Add';
    this.findingObject.values = null;
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    setTimeout(() => {

      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);
  }


  closeFormModal() {
    this.findingObject.type = null;
    this.getTestPlanDetails();
    
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  
  viewDocument(type, documents, documentFile,finding) {
    switch (type) {
      case "audit-finding-document":
        this._auditManagementService
          .getFilePreview(type, documents.am_audit_finding_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents,finding);
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
            this.openPreviewModal(type, resp, documentFile, documents,finding);
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

  getFindingProgress(){
    if(AmAuditTestPlanStore?.individualTestPlanDetails?.id || AmAuditTestPlanStore?.auditTestPlanId){
      this._auditTestPlanService.getFindingProgress(AmAuditTestPlanStore?.individualTestPlanDetails?.id?AmAuditTestPlanStore?.individualTestPlanDetails?.id:AmAuditTestPlanStore?.auditTestPlanId).subscribe(res => {
        setTimeout(() => {
          this.GaugeChart();      
        }, 500);
        this._utilityService.detectChanges(this._cdr);
      })
    }
   
  }
  
  GaugeChart() {
    am4core.addLicense("CH199714744");
    // Create chart instance
  
    let chart = am4core.create("piechartdiv", am4charts.PieChart);
    chart.data = AmAuditTestPlanStore.findingProgress?.risk_ratings
    
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    // chart.legend.valueLabels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    chart.legend.valueLabels.template.disabled = false;
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);


    // chart.legend.labels.template.disabled = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize = 10;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "audit_labels";
    pieSeries.dataFields.value = "finding_precentage";
    pieSeries.dataFields.category = "type";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
    // pieSeries.slices.template.events.on("hit", this.typeChartClick,this)
  
    this._utilityService.detectChanges(this._cdr);
  }

  // chartPie(data:any){
  //   // let risk_ratings: any[] = []
  //   for(let i of data.risk_ratings){
  //     // if(i.risk_ratings){
  //       risk_ratings.push({
  //         finding_count: i.finding_count,
  //         id: i.id,
  //         // percentage: i.percentage,
  //         title: i.title
  //       })
  //     // }
  //   }
  // }
  
  openPreviewModal(type, filePreview, documentFiles, document,finding) {
    this.previewObject.component = type
  
  
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document;
      this.previewObject.uploaded_user =AmAuditTestPlanStore.individualTestPlanDetails?.created_by;
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
        case "audit-finding-document":
          this._auditManagementService.downloadFile(
            type,
            document.am_audit_finding_id,
            document.id,
            document.title,
            null,
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

    createImageUrl(type,token) {
      if (type == 'audit-finding-document')
        return this._auditManagementService.getThumbnailPreview(type, token);
      else if(type=='document-version')
        return this._documentFileService.getThumbnailPreview(type, token);
      else
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

    
  	// extension check function
	checkExtension(ext, extType) {
		return this._imageService.checkFileExtensions(ext, extType)
	}

  
  getCreatedByDetails(user) {
    let userDetail: any = {};
    userDetail['first_name'] = user?.first_name ? user?.first_name : '';
    userDetail['last_name'] = user?.last_name;
    userDetail['designation'] = user?.designation;
    userDetail['image_token'] = user?.image?.token;
    userDetail['email'] = user?.email;
    userDetail['mobile'] = user?.mobile;
    userDetail['id'] = user?.id;
    userDetail['department'] = user?.department;
    userDetail['status_id'] = user?.status?.id;
    userDetail['created_at'] = AmAuditTestPlanStore.individualTestPlanDetails?.created_at;

    return userDetail;
  }
  setCurrentTab(id){
    if(this.currentTab==id)
    this.currentTab = null;
    else
    this.currentTab = id
  }

  
  editFinding(id) {
    AmAuditFindingStore.setAuditFindingId(id);
    this._auditFindingService.getItem(id).subscribe(res => {

      this.findingObject.values = {

        id: id,
        am_audit_id: res['am_audit']?.id,
        am_audit_test_plan_id: res['am_audit_test_plan']?.id,
        finding_risk_rating_id: res['am_audit_finding_risk_rating'],
        title: res['title'],
        description: res['description'],
        recommendation: res['recommendation'],
        department_response: res['department_response'],
        remarks: res['remarks'],
        departments: res['departments'],
        divisions: res['divisions'],
        organizations: res['organizations'],
        sub_sections: res['sub_sections'],
        sections: res['sections'],
        finding_risks: res['am_audit_finding_risks']?res['am_audit_finding_risks']:[],
        documents: res['documents'],

      }
      this.clearCommonFilePopupDocuments();
      if (res['documents']?.length > 0) {
        this.setDocuments(res['documents']);
      }

      this.findingObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);

    })
  }


  setDocuments(documents) {

    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element?.kh_document?.versions?.forEach(innerElement => {

          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement

            })
          }

        });
      }
      else {
        if (element && element.token) {
          var purl = this._auditManagementService.getThumbnailPreview('finding-document', element.token)
          var lDetails = {
            created_at: element.created_at,
            created_by: element.created_by,
            updated_at: element.updated_at,
            updated_by: element.updated_by,
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            asset_id: element.asset_id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl);

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);

  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  /**
* Delete the audit finding
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._auditFindingService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this.getTestPlanDetails();
          this._utilityService.detectChanges(this._cdr);
        
        }, 500);
        this.clearDeleteObject();
      }, (error => {
        setTimeout(() => {
          if (error.status == 405) {
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  deleteFinding(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_finding_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  completeTestPlan() {
    this.deleteObject.id = AmAuditTestPlanStore.individualTestPlanDetails?.id;
    this.deleteObject.type = 'complete';
    this.deleteObject.subtitle = 'complte_am_test_plan_subtitle';
    $(this.deletePopup.nativeElement).modal('show');
  }

  complete(status){
    if(this.deleteObject.id && status){
      this._auditTestPlanService.completeTestPlan(this.deleteObject.id).subscribe(() => {
        setTimeout(() => {
          this.getTestPlanDetails();
          this._utilityService.detectChanges(this._cdr);
        
        }, 500);
        this.clearDeleteObject();
      },(error => {
        setTimeout(() => {
          // if (error.status == 404) {
            $(this.deletePopup.nativeElement).modal('hide');
            this._utilityService.detectChanges(this._cdr);
          // }
          this.clearDeleteObject();
        }, 100);
      }));
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

   
  }

  modalSelect(status: boolean){
    switch(this.deleteObject.type){
      case '':
        this.delete(status);
        break;
      case 'complete':
        this.complete(status);
        break;
    }
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    // this.deleteObject.subtitle = '';
  }

  
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription?.unsubscribe();
    this.findingModal?.unsubscribe();
  
  }


}
