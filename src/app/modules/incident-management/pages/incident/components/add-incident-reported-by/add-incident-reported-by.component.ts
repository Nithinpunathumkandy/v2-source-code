import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';

@Component({
  selector: 'app-add-incident-reported-by',
  templateUrl: './add-incident-reported-by.component.html',
  styleUrls: ['./add-incident-reported-by.component.scss']
})
export class AddIncidentReportedByComponent implements OnInit {
  UsersStore = UsersStore;
  form: FormGroup;
  formErrors: any;
  selectedReported: any;
  clearClicked = false;
  constructor(private _cdr: ChangeDetectorRef,private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,private _userService: UsersService,
    private _helperService: HelperServiceService,private _imageService: ImageServiceService,

    ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      reported_by: [null, [Validators.required, Validators.maxLength(255)]]
    });

    this.getUsers()
  }

  ngDoCheck(){
    if(!this.form.value.reported_by  && IncidentInvestigationStore.investigationIncidentObjects.reported_by !=null){
      if(!this.clearClicked){
     this.form.patchValue({
      reported_by : IncidentInvestigationStore.investigationIncidentObjects.reported_by ? IncidentInvestigationStore.investigationIncidentObjects.reported_by  : []
       
     })
     this.selectedReported = IncidentInvestigationStore.investigationIncidentObjects.reported_by
     this._utilityService.detectChanges(this._cdr);
    }
    }
   }

   reportedSelected(e){
    if(e)
      this.selectedReported = e ;
    else {
      this.clearClicked = true;
      this.selectedReported = null;
      this.form.reset();
    }
  }

  searchReportedBy(e) {
    if(this.form.value.department_ids){
      let params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
    this._userService.searchUsers('?q=' + e.term+params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  }

  getUsers(){
    var params = '';
    // params = '?organization_ids='+this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
    // +'&division_ids='+this._helperService.createParameterFromArray(this.form.get('division_ids').value)
    // +'&department_ids='+this._helperService.createParameterFromArray(this.form.get('department_ids').value)
    // +'&section_ids='+this._helperService.createParameterFromArray(this.form.get('section_ids').value)
    // +'&sub_section_ids='+this._helperService.createParameterFromArray(this.form.get('sub_section_ids').value);
    this._userService.getAllItems(params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  cancel(){
    this.form.reset();
  this.selectedReported = null;
  this.clearClicked = false;
  }

  save(){
    IncidentInvestigationStore.investigationIncidentObjects.reported_by = this.selectedReported
    this._utilityService.showSuccessMessage('success','incident_reported_by');
    this._utilityService.detectChanges(this._cdr);
    this.form.reset();
  
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

}
