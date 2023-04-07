import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { autorun, IReactionDisposer } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ActivatedRoute } from '@angular/router';
import { TimeTrackerService } from 'src/app/core/services/project-management/time-tracker/time-tracker.service';
import { TimeTrackerStore } from 'src/app/stores/project-management/time-tracker/time-tracker.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ProjectManagementProjectsService } from 'src/app/core/services/project-management/projects/project-management-projects.service';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
declare var $: any;
@Component({
  selector: 'app-time-tracker-details',
  templateUrl: './time-tracker-details.component.html',
  styleUrls: ['./time-tracker-details.component.scss']
})
export class TimeTrackerDetailsComponent implements OnInit,OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('detailModal') detailModal: ElementRef;
  @ViewChild("addTimeTrackerModal", {static: true}) addTimeTrackerModal: ElementRef;
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  reactionDisposer: IReactionDisposer
  AppStore=AppStore;
  SubMenuItemStore=SubMenuItemStore;
  TimeTrackerStore=TimeTrackerStore;
  NoDataItemStore=NoDataItemStore;
  ProjectsStore = ProjectsStore;
  filterDateObject: { startDate: string, endDate: string };
  activityChart="pie";
  timeTrackerDetailsObject = {
    id : null,
    type : null,
    values : null
  };
  timeTrackerObject = {
    id : null,
    type : null,
    values : null,
    redirect:false
  };
  detailsTrackerSubscription: any;
  addTimeTrackerSubscription: any;
  slectedTimeTrackerId:number;
  constructor( private _cdr: ChangeDetectorRef,private _activatedRouter: ActivatedRoute,private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2, private _helperService: HelperServiceService,private _imageService:ImageServiceService,
    private _projectManagementService: ProjectManagementProjectsService,
    private _utilityService: UtilityService,private _timeTrackerService:TimeTrackerService) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    NoDataItemStore.setNoDataItems({ title: "resource_nodata_title" });
    if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
    this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);
    this.reactionDisposer = autorun(() => {
    var subMenuItems = [
      {activityName: 'CREATE_PROJECT_TIME_TRACKER', submenuItem: {type: 'new_modal'}},
      // { activityName: null, submenuItem: { type: 'datefilter' } }, 
      { activityName: null, submenuItem: { type: 'close',path:'/project-management/project-time-trackers' } },
  
      ]
      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addTimeTracker();
            break;
         
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
        if (SubMenuItemStore.DatefilterValue != '') {
          //this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
        }
      }
      if (SubMenuItemStore.DatefilterValue != '') {
        //this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
      }
    })
    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      this.slectedTimeTrackerId=id;
      if(id){
        this.getTrackerDetails(id);
        this.getProjectDetails(id);
      }
    });

    this.detailsTrackerSubscription = this._eventEmitterService.detailsTimeTrackerModalControl.subscribe(resp => {
				this.closeDetailsTimeTracker();
		})
    this.addTimeTrackerSubscription = this._eventEmitterService.addTimeTrackerModalControl.subscribe(element => {
				this.closeAddTimeTracker();
		})
    
    
  }

  addTimeTracker()
  {
    this.timeTrackerObject.type = 'Add';
    this.timeTrackerObject.values = null;
    this.timeTrackerObject.id = this.slectedTimeTrackerId;
    this.openTimeTrackerPopup()
  }

  getProjectDetails(id)
  {
    this._projectManagementService.geSingletItem(id).subscribe(res=>{
      TimeTrackerStore.setProjectTitle(res.title);
      this._utilityService.detectChanges(this._cdr);
    })
  }
 

  openTimeTrackerPopup(){
    setTimeout(() => {
      $(this.addTimeTrackerModal.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement,'z-index',99999);
  }

  closeAddTimeTracker()
  {
    this.getTrackerDetails(this.slectedTimeTrackerId);
    setTimeout(() => {
      this.timeTrackerObject.type = null;
      this.timeTrackerObject.id=null;
      $(this.addTimeTrackerModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.addTimeTrackerModal.nativeElement,'show');
      this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  getTrackerDetails(id)
  {
    this._timeTrackerService.getItem(id).subscribe(res=>{
      if(res.by_activities.length)
      {
        this.loadActiyvityWiseChart();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getPopupDetails(user) { 
    let userDetailObject: any = {};
    userDetailObject['id'] = user?.resource_id; 
    userDetailObject['first_name'] = user?.resource_first_name;
    userDetailObject['last_name'] = user?.resource_last_name;
    userDetailObject['designation'] = user?.resource_designation;
    userDetailObject['department'] = user?.resource_department;
    userDetailObject['image_token'] = user?.resource_image_token;
    userDetailObject['email'] = user?.resource_email;
    userDetailObject['mobile'] = user?.resource_mobile;
    userDetailObject['status_id'] = user?.resource_status_id;
    return userDetailObject;
  
  }

  openTimeTrackerDetailsModal() {
    this.timeTrackerDetailsObject.id = this.slectedTimeTrackerId;
    setTimeout(() => {
      $(this.detailModal.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.detailModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.detailModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.detailModal.nativeElement,'z-index',99999);
  }

  closeDetailsTimeTracker() {
   
    setTimeout(() => {
      this.timeTrackerDetailsObject.id=null;
      this.timeTrackerDetailsObject.type=null;
      $(this.detailModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.detailModal.nativeElement,'show');
      this._renderer2.setStyle(this.detailModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this.getTrackerDetails(this.slectedTimeTrackerId);
      this.getProjectDetails(this.slectedTimeTrackerId);
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  loadActiyvityWiseChart()
  {
    am4core.addLicense("CH199714744");
    // Create chart
    var chart = am4core.create("activity-pie", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.data=this.getChartData();
    // chart.data = [
    //   {
    //     country: "HTML",
    //     value: 260,
    //     "color": am4core.color("#FD0000")
    //   },
    //   {
    //     country: "Angular",
    //     value: 230,
    //     "color": am4core.color("#FFC000")
    //   },
    //   {
    //     country: "API",
    //     value: 200,
    //     "color": am4core.color("#F4F414")
    //   },
    //     {
    //     country: "Design",
    //     value: 200,
    //     "color": am4core.color("#00844c")
    //   },
    
    // ];
    var series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.radiusValue = "value";
    series.dataFields.category = "activity";
    series.slices.template.propertyFields.fill = "color";
    series.slices.template.cornerRadius = 1;
    series.colors.step = 3;
    
    series.hiddenState.properties.endAngle = -90;
    
    chart.legend = new am4charts.Legend();
    
    chart.legend.hide();
    chart.legend.position = "bottom";
    chart.legend.contentAlign = "center";  
    chart.legend.useDefaultMarker = true; 
    chart.legend.fontSize = 0;
    chart.legend.maxHeight = 0;
    chart.legend.scrollable = true;
    
    var markerTemplate = chart.legend.markers.template; 
    markerTemplate.width = 12; 
    markerTemplate.height = 12;
    /* Create axes */
    var label = series.labels.template;
    
    label.wrap = true;
    
    label.maxWidth = 80;
    label.fontSize = 10;
    label.fill = am4core.color("#33475B");
  }

   //passing token to get preview
   createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getChartData()
  {
    let data=[];
    for(let i of TimeTrackerStore?.activities)
    {
      data.push({activity:i.activities,value:i.count,color:this.getActivityColor(i.activities),})
    }
    return data;
  }
  getActivityColor(text)
  {

    if(text=='Html')
    {
      return am4core.color("#FD0000");
    }
    if(text=='Angular')
    {
      return am4core.color("#FFC000");
    }
    if(text=='Api')
    {
      return am4core.color("#F4F414");
    }
    if(text=='Design')
    {
      return am4core.color("#00844c");
    }
  }

  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

 ngOnDestroy(): void {
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  TimeTrackerStore.unsetTimeTrackerIndiviualDetails();
  this.detailsTrackerSubscription.unsubscribe();
  this.addTimeTrackerSubscription.unsubscribe();
  am4core.disposeAllCharts();
 }

}
