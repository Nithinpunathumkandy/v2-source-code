import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit,HostListener } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-module-submenu-modal',
  templateUrl: './module-submenu-modal.component.html'
})
export class ModuleSubmenuModalComponent implements OnInit {

  	@Input('source') ModuleSubmenuSource: any;
  	OrganizationModulesStore = OrganizationModulesStore;
	AppStore = AppStore;
	formErrors: any;
	LanguageSettingsStore = LanguageSettingsStore;
	moduleSubMenuLabel:{languageid: number, value: string, languageTitle: string}[] = [];

  constructor(
	  	private _organizationModulesService: OrganizationModulesService,
    	private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ModuleSubmenuModalComponent
   */
  ngOnInit(): void {
	  this.setLabelLanguageNgModal();
		if (this.ModuleSubmenuSource.type == 'Edit') {
			this.setFormValues();
			this._utilityService.detectChanges(this._cdr);
		  }
	}

	  setFormValues(){
		if (this.ModuleSubmenuSource.hasOwnProperty('values') && this.ModuleSubmenuSource.values) {
		  if(this.LanguageSettingsStore.activeLanguages.length > 0 && this.moduleSubMenuLabel.length > 0 )
			this.setLabelValues();
		}
	  }

	  setLabelValues(){
		for(let i of this.moduleSubMenuLabel){
			this._organizationModulesService.getSubModuleLanguages(this.ModuleSubmenuSource.values?.id).subscribe(res => {
				for (const lang of res.title) {
					if(i.languageid == lang.id){
						i.value = lang.pivot.title;
					}
				}
				this._utilityService.detectChanges(this._cdr);
			})
		}
	  }

	  setLabelLanguageNgModal(){
		this.moduleSubMenuLabel = [];
		for(let i of this.LanguageSettingsStore.activeLanguages){
		  this.moduleSubMenuLabel.push({languageid: i.id, value: '', languageTitle: i.title});
		}
	  }

	  checkFormValid(){
		var formValid = true;
		for(let i of this.moduleSubMenuLabel){
		  if(!i.value){
			formValid = false;
			break;
		  }
		}
		return formValid;
	  }	 

	resetForm(status) {
		if(status){
		  for(let i of this.moduleSubMenuLabel){
			i.value = '';
		  }
		}
		else this.moduleSubMenuLabel = [];
		AppStore.disableLoading();
	  }

	
	// cancel modal
	cancel() {
		this.closeFormModal();
	}


	// for closing the modal
	closeFormModal() {
		this.resetForm(false);
		this._eventEmitterService.dismissModuleSubmenuModal();
	}

	createPostData(){
		var postData = {
		module_languages:[]
		};
		for(let i of this.moduleSubMenuLabel){
		  let item = {title: i.value,language_id: i.languageid};
		  if(item.title != '')
			postData.module_languages.push(item);
		}
		return postData;
	  }

	

	save(close: boolean = false) {
		this.formErrors = null;
		if (this.checkFormValid) {
		  let save;
		  AppStore.enableLoading();
			save = this._organizationModulesService.updateModuleSubmenu(this.ModuleSubmenuSource.values?.id, this.createPostData());
		  save.subscribe((res: any) => {
			if(this.ModuleSubmenuSource.values == null){
			  this.resetForm(true);
			}
			AppStore.disableLoading();
			setTimeout(() => {
			  this._utilityService.detectChanges(this._cdr);
			}, 500);
			if (close) this.closeFormModal();
		  }, (err: HttpErrorResponse) => {
			if (err.status == 422) {
			  this.formErrors = err.error.errors;
			}
			else if(err.status == 500 || err.status == 403){
			  this.closeFormModal();
			}
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
		  });
		}
	   }

	   @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

		if(event.key == 'Escape' || event.code == 'Escape'){     
	
			this.cancel();
	
		}
	
	  }

	  
	//getting button name by language
	getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

}

