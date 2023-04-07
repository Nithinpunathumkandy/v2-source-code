import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ProjectTeamService } from 'src/app/core/services/project-monitoring/project-team/project-team.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { ProjectTeamStore } from 'src/app/stores/project-monitoring/project-team-store';

@Component({
  selector: 'app-add-project-team',
  templateUrl: './add-project-team.component.html'
})
export class AddProjectTeamComponent implements OnInit {
  @Input('source') ProjectTeamSource: any;

	AppStore = AppStore;
  UsersStore = UsersStore;
  ProjectTeamStore = ProjectTeamStore;
	form: FormGroup;
	formErrors: any;

  constructor(
		private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
    private _projectTeamService : ProjectTeamService,
    private _usersService: UsersService,
    private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof AddProjectTeamComponent
   */    
  ngOnInit(): void {
    this.form = this._formBuilder.group({
			project_manager_id: [null, [Validators.required]],
      assistant_manager_ids: [[], [Validators.required]],
      member_ids: [[], [Validators.required]],
    });

    if (this.ProjectTeamSource.type == 'Edit')
    this.getPopulateData();
    }

    getUsers() {
      this._usersService.getAllItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
  
    }
  
    searchUers(e) {   
      this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
  
    }

    getPopulateData() {
      this.form.patchValue({
        project_manager_id: this.ProjectTeamStore.projectManagers?.project_manager ? this.ProjectTeamStore.projectManagers?.project_manager : null,
        assistant_manager_ids: this.ProjectTeamStore.projectAssistantManagers?.project_assistant_managers ? this.getData(this.ProjectTeamStore.projectAssistantManagers?.project_assistant_managers) : [],
        member_ids: this.ProjectTeamStore.projectMembers?.project_members ? this.getData(this.ProjectTeamStore.projectMembers?.project_members) : [],
      })
    }

    getData(value) {
      let data = [];
      for(let i of value) {
        data.push(i);
      }
      return data;
    }

    customSearchFn(term: string, item: any) { 
      term = term.toLowerCase();
      // Creating and array of space saperated term and removinf the empty values using filter
      let splitTerm = term.split(' ').filter(t => t);
      let isWordThere = [];
      // Pushing True/False if match is found
      splitTerm.forEach(arr_term => {
        item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
        let search = item['searchLabel'].toLowerCase();
        isWordThere.push(search.indexOf(arr_term) != -1);
      });
  
      const all_words = (this_word) => this_word;
      // Every method will return true if all values are true in isWordThere.
      return isWordThere.every(all_words);
    }

    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }
  
    createImagePreview(type, token) {
      return this._humanCapitalService.getThumbnailPreview(type, token);
    }
    getStringsFormatted(stringArray,characterLength,seperator){
      return this._helperService.getFormattedName(stringArray,characterLength,seperator);
    }    

    getId(value) {
      let data = [];
      for(let i of value) {
        data.push(i.id);
      }
      return data;
    }
    
    processSaveData() {
      let saveData = {
        project_manager_id : this.form.value.project_manager_id ? this.form.value.project_manager_id.id : null,
        assistant_manager_ids : this.form.value.assistant_manager_ids ? this.getId(this.form.value.assistant_manager_ids) : [],
        member_ids : this.form.value.member_ids ? this.getId(this.form.value.member_ids) : [],
      }
      
      return saveData;
    }

    save(close: boolean = false) {
      this.formErrors = null;
      if (this.form.valid) {
        let save;
        AppStore.enableLoading();
          save = this._projectTeamService.saveProjectTeam(ProjectMonitoringStore.selectedProjectId,this.processSaveData(),this.ProjectTeamSource.type);
        save.subscribe((res: any) => {
          if (!this.form.value.id) {
            this.resetForm();
          }
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.cancel();
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          }
          else if (err.status == 500 || err.status == 403) {
            this.cancel();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        });
      }
    }

    resetForm() {
      this.form.reset();
      this.formErrors = null;
    }

    cancel(){
      this._eventEmitterService.dismissProjectTeamModalModal();
     }

  getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

}
