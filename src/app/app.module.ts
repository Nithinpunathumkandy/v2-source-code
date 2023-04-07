import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SnackbarModule } from 'ngx-snackbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { IsorobotTranslateLoader } from './core/services/translate/translate.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { VerifyComponent } from './modules/sso/verify/verify.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ApplicationLoaderComponent } from 'src/app/core/modules/application-loader/application-loader.component';
import { NgOtpInputModule } from 'ng-otp-input';

export function IsorobotTranslateLoaderFactory(http: HttpClient) {
  return new IsorobotTranslateLoader(http);
}

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);


@NgModule({
  declarations: [
    AppComponent,
    VerifyComponent,
    ApplicationLoaderComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    InfiniteScrollModule,
    NgOtpInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: IsorobotTranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SnackbarModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,      
    }),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,      
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
