import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectManagementProjectsService } from 'src/app/core/services/project-management/projects/project-management-projects.service';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { TimeTrackerService } from 'src/app/core/services/project-management/time-tracker/time-tracker.service';
import { TimeTrackerStore } from 'src/app/stores/project-management/time-tracker/time-tracker.store';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/stores/auth.store';
@Component({
  selector: 'app-add-time-tracker',
  templateUrl: './add-time-tracker.component.html',
  styleUrls: ['./add-time-tracker.component.scss']
})
export class AddTimeTrackerComponent implements OnInit, OnDestroy {
  @Input('source') timeTrackerSource: any;
  form: FormGroup;
  formErrors: any;
  AppStore=AppStore;
  UsersStore=UsersStore;
  AuthStore=AuthStore;
  projectStore = ProjectsStore;
  TimeTrackerStore=TimeTrackerStore;
  constructor(
    private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
		private _eventEmitterService: EventEmitterService,
    private _projectManagementService: ProjectManagementProjectsService,
    private _timeTrackerService:TimeTrackerService,
    private _router: Router,
		private _utilityService: UtilityService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
			date : [null,[Validators.required]],
      hours : [null,[Validators.required]],
      comment : ['',[Validators.required]],
      resource_id : [null,[Validators.required]],
      project_id : [null,[Validators.required]],
      project_time_tracker_activity_id : [null,[Validators.required]],
      id: [''],
    });
    if(!this.timeTrackerSource.redirect)
    {
        this.form.patchValue({
          project_id:this.timeTrackerSource.id
        })
        this.getAllProjects('');
    }
    if (this.timeTrackerSource.type=='Add') {
      this.form.patchValue({
        date:new Date(),
        resource_id:{first_name:AuthStore.user.name,last_name:AuthStore.user.last_name,id:AuthStore.user.id,email:AuthStore.user.email}
      })
      this.searchUers({term:AuthStore.user.id})
    }
    if (this.timeTrackerSource.type=='Edit') {
      let id = this.timeTrackerSource.values;
      this._timeTrackerService.getItemById(id).subscribe((res) => {
        this.setEditDetails(res);
        this._utilityService.detectChanges(this._cdr);
      })
      
    } 
  }

  setEditDetails(data) {
    this.form.patchValue({
      id : data.id,
      date: data.date,
      hours: data.hours,
      comment: data.comment,
      resource_id: data.resource,
      project_id: data.project.id,
      project_time_tracker_activity_id: {id:data.project_time_tracker_activity?.language[0]?.pivot?.project_time_tracker_activity_id,
        project_time_tracker_activity_language_title:data.project_time_tracker_activity?.language[0]?.pivot?.title}
    })
    //console.log(this.form.value?.project_time_tracker_activity_id)
    this.getAllProjects({term:data.project.id});
    this.getAllProjectsTimeTrackerActivity({term:data.project_time_tracker_activity.id});
  }

  cancel()
  {
    this._eventEmitterService.dismissAddTimeTrackerModal();
  }


  getAllProjects(searchVal) {
    ProjectsStore.setCurrentPage(1);
    let param='';
    if(searchVal)
    {
       param="q="+searchVal.term
    }
    else{
      param="q="+TimeTrackerStore.projectTitle
    }
    this._projectManagementService.getItems(false, param).subscribe(() => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAllProjectsTimeTrackerActivity(searchVal) {
    
    let param='?per_page=50';
    if(searchVal)
    {
       param=param+"&q="+searchVal.term
    }
    this._timeTrackerService.getTimeTrackerActivity(param).subscribe(() => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  resetForm()
  {
    //this.form.reset();
    if(!this.timeTrackerSource.redirect)
    {
        this.form.patchValue({
          date:null,
          hours:null,
          comment:null,
          //resource_id:null,
          project_time_tracker_activity_id:null
        })
    }
    else{
      if(this.timeTrackerSource.type=='Add')
      {
        this.form.reset();
      }
      
    }
  }

  searchUers(e){
    var params = '';
    this._userService.searchUsers('?q='+e.term+params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getUsers(){
    var params = '';
    this._userService.getAllItems(params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  // Returns default image
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl('user-logo');
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  save(close: boolean = false) {
    AppStore.enableLoading();
    let id
    if(this.timeTrackerSource.type=='edit'){
      id=this.form.value?.id
    }
    let save;
   
    if (this.form.value?.id || this.timeTrackerSource.type=='edit') {
      save = this._timeTrackerService.updateItem(this.form.value?.id , this.getSaveData());
    }
    else {
      save = this._timeTrackerService.saveItem(this.getSaveData());
    }
    save.subscribe(res => {
      AppStore.disableLoading();
      
      if(this.timeTrackerSource.redirect && close)
      {
        this.getDetails();
      }
      else
      {
        this.resetForm();
      }
      if (close) this.cancel();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }
  getDetails()
  {
    this._router.navigateByUrl(`/project-management/project-time-trackers/${this.form.value.project_id}`)
  }
  numberOnly(evt): boolean {
    //console.log(evt.target.value);
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode != 46 && charCode > 31 
    && (charCode < 48 || charCode > 57))
     return false;
  
  return true;
  
  }

  getSaveData()
  {
    const payload={
      project_id:this.form.value.project_id,
      project_time_tracker_activity_id:this.form.value.project_time_tracker_activity_id?.id,
      hours:this.form.value.hours,
      comment:this.form.value.comment,
      resource_id:this.form.value.resource_id?.id,
      date:this._helperService.passSaveFormatDateOnTimeTracker(this.form.value.date)
    }
    return payload;
  }

  
  
ngOnDestroy(): void {
  this.timeTrackerSource = null;
}
}
