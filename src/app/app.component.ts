import {
  Component,
  OnInit,
  Inject,
  LOCALE_ID,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';

import { endOfDay, addMonths } from 'date-fns';
import {
  DAYS_IN_WEEK,
  SchedulerViewDay,
  SchedulerViewHour,
  SchedulerViewHourSegment,
  CalendarSchedulerEvent,
  CalendarSchedulerEventAction,
  startOfPeriod,
  endOfPeriod,
  addPeriod,
  subPeriod,
  SchedulerDateFormatter,
  SchedulerEventTimesChangedEvent,
  CalendarSchedulerViewComponent,
} from 'angular-calendar-scheduler';
import {
  CalendarView,
  CalendarDateFormatter,
  DateAdapter,
} from 'angular-calendar';

import { AppService } from './services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: SchedulerDateFormatter,
    },
  ],
})
export class AppComponent implements OnInit {
  bookingForm: FormGroup;
  bookings: any[] = [];
  selectedFloor = 'floor0';
  meetingRooms:any = 
    {
     
      floor0: [
        { id: 'meetingRoom1', name: 'Meeting Room 1' ,availableClass : 'green' },
        { id: 'meetingRoom2', name: 'Meeting Room 2' ,availableClass : 'green'},
        { id: 'meetingRoom3', name: 'Meeting Room 3' ,availableClass : 'green'},
        { id: 'conferenceRoom1', name: 'Conference Room 1' ,availableClass : 'green'},
        {id: 'phoneBooth1' , name: 'Phone Booth 1',availableClass : 'green'},
        {id: 'phoneBooth2', name: 'Phone Booth 2',availableClass : 'green'}
      ],
      floor1: [
        { id: 'conferenceRoom1', name: 'Conference Room 1' ,availableClass : 'green'},
        { id: 'conferenceRoom2', name: 'Conference Room 2' ,availableClass : 'green'},
        { id: 'conferenceRoom3', name: 'Conference Room 3' ,availableClass : 'green'},
        {id: 'phoneBooth1' , name: 'Phone Booth 1',availableClass : 'green'},
        {id: 'phoneBooth2', name: 'Phone Booth 2',availableClass : 'green'}
    
      ]

    }
  


  
  meetingRoomID: string = ''
  title: string = 'Angular Calendar Scheduler Demo';

  CalendarView = CalendarView;

  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  viewDays: number = 3;
  refresh: Subject<any> = new Subject();
  locale: string = 'en';
  hourSegments: number = 4;
  weekStartsOn: number = 1;
  startsWithToday: boolean = true;
  activeDayIsOpen: boolean = true;
  excludeDays: number[] = []; // [0];
  dayStartHour: number = 6;
  dayEndHour: number = 22;

  minDate: Date = new Date();
  maxDate: Date = endOfDay(addMonths(new Date(), 1));
  dayModifier: Function;
  hourModifier: Function;
  segmentModifier: Function;
  eventModifier: Function;
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;

  actions: CalendarSchedulerEventAction[] = [
    {
      when: 'enabled',
      label:
        '<span class="valign-center"><i class="material-icons md-18 md-red-500">cancel</i></span>',
      title: 'Delete',
      onClick: (event: CalendarSchedulerEvent): void => {
        console.log("Pressed action 'Delete' on event " + event.id);
      },
    },
    {
      when: 'cancelled',
      label:
        '<span class="valign-center"><i class="material-icons md-18 md-red-500">autorenew</i></span>',
      title: 'Restore',
      onClick: (event: CalendarSchedulerEvent): void => {
        console.log("Pressed action 'Restore' on event " + event.id);
      },
    },
  ];

  events: CalendarSchedulerEvent[];

  @ViewChild(CalendarSchedulerViewComponent)
  calendarScheduler: CalendarSchedulerViewComponent;

  constructor(
    @Inject(LOCALE_ID) locale: string,
    private appService: AppService,
    private dateAdapter: DateAdapter,
    private fb: FormBuilder
  ) {
    this.locale = locale;

    // this.dayModifier = ((day: SchedulerViewDay): void => {
    //     day.cssClass = this.isDateValid(day.date) ? '' : 'cal-disabled';
    // }).bind(this);

    // this.hourModifier = ((hour: SchedulerViewHour): void => {
    //     hour.cssClass = this.isDateValid(hour.date) ? '' : 'cal-disabled';
    // }).bind(this);

    this.segmentModifier = ((segment: SchedulerViewHourSegment): void => {
      segment.isDisabled = !this.isDateValid(segment.date);
    }).bind(this);

    this.eventModifier = ((event: CalendarSchedulerEvent): void => {
      event.isDisabled = !this.isDateValid(event.start);
    }).bind(this);

    this.dateOrViewChanged();
  }

  ngOnInit(): void {
    this.setMeetingRoom('conferenceRoom1');

  // Initialize the booking form
  this.bookingForm = this.fb.group({
    date: ['', [Validators.required, this.validateDate]],
    starttime: ['', Validators.required],
    endtime: ['', Validators.required],
    room: ['', Validators.required],
    description: ['', Validators.required],
  });

  // Ensure meetingRoomID is set before subscribing
  if (this.meetingRoomID) {
    this.appService.getEvents(this.meetingRoomID)
      .subscribe(
        (events: CalendarSchedulerEvent[]) => (this.events = events),
        (error) => console.error('Error fetching events:', error)
      );
  } else {
    console.error('Meeting room ID is not set.');
  }
  }

  validateDate(control: any): { [key: string]: boolean } | null {
    const currentDate = new Date();
    console.log('curr date' , currentDate);
    
    const selectedDate = new Date(control.value);
    console.log('selected date' , selectedDate);
    
    const twoWeeksLater = new Date(
      currentDate.getTime() + 14 * 24 * 60 * 60 * 1000
    );

    if (selectedDate < currentDate || selectedDate > twoWeeksLater) {
      return { invalidDate: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.appService.addEvents(this.meetingRoomID,this.bookingForm.value);
      this.appService
     this.refreshCalender();
      alert('Meeting Room Booked')
      this.bookingForm.reset();
    }
  }


  setMeetingRoom(id){
    this.meetingRoomID = id
  }

  refreshCalender():void{
    this.appService
    .getEvents(this.meetingRoomID)
    .subscribe((events: CalendarSchedulerEvent[]) => {
      this.events = events
      this.refresh.next();
    });
  }

  setFloor(floorNumber){
    this.selectedFloor = floorNumber;
    this.refreshCalender();

  }
  viewRoomSchedule(meetingId): void{
    this.setMeetingRoom(meetingId);
    this.appService
    .getEvents(meetingId)
    .subscribe((events: CalendarSchedulerEvent[]) => (this.events = events));
    this.refresh.next();
  }

  viewDaysOptionChanged(viewDays: number): void {
    console.log('viewDaysOptionChanged', viewDays);
    this.calendarScheduler.setViewDays(viewDays);
  } 

  changeDate(date: Date): void {
    console.log('changeDate', date);
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  changeView(view: CalendarView): void {
    console.log('changeView', view);
    this.view = view;
    this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
    if (this.startsWithToday) {
      this.prevBtnDisabled = !this.isDateValid(
        subPeriod(
          this.dateAdapter,
          CalendarView.Day /*this.view*/,
          this.viewDate,
          1
        )
      );
      this.nextBtnDisabled = !this.isDateValid(
        addPeriod(
          this.dateAdapter,
          CalendarView.Day /*this.view*/,
          this.viewDate,
          1
        )
      );
    } else {
      this.prevBtnDisabled = !this.isDateValid(
        endOfPeriod(
          this.dateAdapter,
          CalendarView.Day /*this.view*/,
          subPeriod(
            this.dateAdapter,
            CalendarView.Day /*this.view*/,
            this.viewDate,
            1
          )
        )
      );
      this.nextBtnDisabled = !this.isDateValid(
        startOfPeriod(
          this.dateAdapter,
          CalendarView.Day /*this.view*/,
          addPeriod(
            this.dateAdapter,
            CalendarView.Day /*this.view*/,
            this.viewDate,
            1
          )
        )
      );
    }

    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  private isDateValid(date: Date): boolean {
    return /*isToday(date) ||*/ date >= this.minDate && date <= this.maxDate;
  }

  viewDaysChanged(viewDays: number): void {
    console.log('viewDaysChanged', viewDays);
    this.viewDays = viewDays;
  }

  dayHeaderClicked(day: SchedulerViewDay): void {
    console.log('dayHeaderClicked Day', day);
  }

  hourClicked(hour: SchedulerViewHour): void {
    console.log('hourClicked Hour', hour);
  }

  segmentClicked(action: string, segment: SchedulerViewHourSegment): void {
    console.log('segmentClicked Action', action);
    console.log('segmentClicked Segment', segment);
  }

  eventClicked(action: string, event: CalendarSchedulerEvent): void {
    console.log('eventClicked Action', action);
    console.log('eventClicked Event', event);
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
    type,
  }: SchedulerEventTimesChangedEvent): void {
    console.log('eventTimesChanged Type', type);
    console.log('eventTimesChanged Event', event);
    console.log('eventTimesChanged New Times', newStart, newEnd);
    const ev: CalendarSchedulerEvent = this.events.find(
      (e) => e.id === event.id
    );
    ev.start = newStart;
    ev.end = newEnd;
    this.refresh.next();
  }
}
