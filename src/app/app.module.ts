import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);

import { AppComponent } from './app.component';
import { CalendarModule, DateAdapter, MOMENT } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { SchedulerModule } from 'angular-calendar-scheduler';

import { AppService } from './services/app.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import * as moment from 'moment';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RoundToNearest15Directive } from './services/timedirective';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    SchedulerModule.forRoot({
      locale: 'en',
      headerDateFormat: 'daysRange',
      logEnabled: true,
    }),
    MatProgressSpinnerModule,
  ],
  providers: [
    RoundToNearest15Directive,
    AppService,
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: MOMENT, useValue: moment },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
