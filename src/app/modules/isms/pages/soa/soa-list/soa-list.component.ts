import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SoaService } from 'src/app/core/services/isms/soa/soa.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SOAStore } from 'src/app/stores/isms/isms-risks/soa.store';
declare var $: any;
@Component({
  selector: 'app-soa-list',
  templateUrl: './soa-list.component.html',
  styleUrls: ['./soa-list.component.scss']
})
export class SoaListComponent implements OnInit {
  @ViewChild("soaFormModal") soaFormModal: ElementRef;
  reactionDisposer : IReactionDisposer;
  SOAStore = SOAStore;
  soaEventSubscription:any;
  AppStore = AppStore;
  soaObject={
    component:'SOA',
    type:null,
    values:null
  }
  constructor(private _helperService:HelperServiceService,
    private _soaService:SoaService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _eventEmitterService:EventEmitterService,
    private _renderer2:Renderer2,
    private _router:Router) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_soa'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'refresh'}},
        { activityName: null, submenuItem: { type: 'search'} },
        { activityName: 'UPDATE_SOA', submenuItem: { type: 'new_modal' } },
        { activityName: 'EXPORT_SOA', submenuItem: { type: 'export_to_excel' } },
       
      ]    

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
              // this._utilityService.detectChanges(this._cdr);
            }, 1000);
            break;
          case 'refresh':
            SOAStore.loaded = false;
            this.getItems(1); 
            break 
          case "export_to_excel":
            this._soaService.exportToExcel();
            break;
            case "search":
              SOAStore.searchText = SubMenuItemStore.searchText;
              this.getItems(1);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
       if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.getItems(1);

    this.soaEventSubscription = this._eventEmitterService.IsmsSoa.subscribe(item => {
      this.closeFormModal();
    })
  }

  addNewItem(){
    this.soaObject.type='add';
    $(this.soaFormModal.nativeElement).modal("show");
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  
  getItems(newPage: number = null){
    if (newPage) SOAStore.setCurrentPage(newPage);
    this._soaService.getItems(false,'').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  closeFormModal(){
    this.soaObject.type=null;
    this.soaObject.values=null;
    $(this.soaFormModal.nativeElement).modal("hide");
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'z-index', 99);
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    if(SOAStore.lastInsertedId)
    this._router.navigateByUrl('/isms/soa/'+SOAStore.lastInsertedId)
  }


  updateSoa(data){
    this.soaObject.type='edit';
    this.soaObject.values={
      control:data,
      soa_status:null,
      soa_implementation_status:null,
      justify:data.justify,
      method:data.method,
      comment:data.comment
     
    }
    if(data.soa_status_id!=null){
      this.soaObject.values.soa_status={id:data.soa_status_id,title:data.soa_status_title};
    }

    if(data.implementation_status_id!=null){
      this.soaObject.values.soa_implementation_status={id:data.implementation_status_id,title:data.implementation_status_title}
    }
    
    
    $(this.soaFormModal.nativeElement).modal("show");
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  changeSoaStatus(status_id,id){
    let saveData={
      soa_status_id:status_id==1?2:1
    }
    this._soaService.updateStatus(id,saveData).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  gotoDetails(id){
    // this._soaService.getItem(id).subscribe(res=>{
    //   this._utilityService.detectChanges(this._cdr);
      this._router.navigateByUrl('/isms/soa/'+id);
    // })
    
  }

  //Right left scroll starts
	prev(){
		var container = document.getElementById('container');
		this.sideScroll(container,'left',0,1000,10);
	}

	next(){
		var container = document.getElementById('container');
		this.sideScroll(container,'right',0,1000,10);
	}

	sideScroll(element,direction,speed,distance,step){
		let scrollAmount = 0;
		var slideTimer = setInterval(function(){
			if(direction == 'left'){
				element.scrollLeft -= step;
			} else {
				element.scrollLeft += step;
			}
			scrollAmount += step;
			if(scrollAmount >= distance){
				window.clearInterval(slideTimer);
			}
		}, speed);
	  }
	  //Right left scroll ends

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.soaEventSubscription.unsubscribe();
    SOAStore.lastInsertedId = null;
    SubMenuItemStore.searchText=null;
    SOAStore.searchText = null;
  }


}
