import { NgModule } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { DashboardPage } from './page/dashboard.page';
import { DashboardLoaderComponent } from './component/dashboard-loader/dashboard-loader.component';

@NgModule({
    declarations: [
        DashboardPage,
        DashboardLoaderComponent
    ],
    imports: [
        SharedModule,
        CarouselModule,
        DashboardRoutingModule,
    ],
    providers: [],
})
export class DashboardModule { }
