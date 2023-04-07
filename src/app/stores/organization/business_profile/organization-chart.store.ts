import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { OrganizationChartImageResponse } from 'src/app/core/models/organization/business_profile/organization-chart-image.model';

class Store {

    userWiseChartLoaded: boolean = false;
    private _userWiseChart: any[] = [];
    
    departmentWiseChartLoaded: boolean = false;
    private _departmentWiseChart: any[] = [];

    organizationChartImage:Image = null;

    temporaryChartImage: Image = null;

    organizationChartResponse: OrganizationChartImageResponse;

    @observable
    logo_preview_available = false;

    setUserWiseChart(chart: any[]){
        this._userWiseChart = chart;
        this.userWiseChartLoaded = true;
    }

    get userWiseChart(): any[]{
        return this._userWiseChart;
    }

    setDepartmentWiseChart(chart: any[]){
        this._departmentWiseChart = chart;
        this.departmentWiseChartLoaded = true;
    }

    get departmentWiseChart(): any[]{
        return this._departmentWiseChart;
    }

    setOrganizationChartImage(imageDetails){
        this.organizationChartImage = imageDetails;
    }

    setOrganizationChartImageResponse(details: OrganizationChartImageResponse){
        this.organizationChartResponse = details;
    }

    setTemporaryChartImage(image){
        this.temporaryChartImage = image;
    }
}

export const OrganizationChartStore = new Store();