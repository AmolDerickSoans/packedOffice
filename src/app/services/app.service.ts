import { Injectable } from '@angular/core';
import {
  CalendarSchedulerEvent,
  CalendarSchedulerEventStatus,
  CalendarSchedulerEventAction,
} from 'angular-calendar-scheduler';
import {
  startOfHour,
  addHours,
  setHours,
  setMinutes,
  isAfter,
  isBefore,
  parse,
} from 'date-fns';
import { concat, of } from 'rxjs';

@Injectable()
export class AppService {
  private eventsByMeetingRoomIDKey = 'eventsByMeetingRoom'
 
  eventsByMeetingRoomID: { [meetingRoomID: string]: CalendarSchedulerEvent[] } = {};

  bookedEvents = {
    floor0:[],
    floor1:[],
    
  }
  events = [
    // {
    //   id: '1',
    //   start: addDays(startOfHour(new Date()), 1),
    //   end: addDays(addHours(startOfHour(new Date()), 1), 1),
    //   title: 'Event 1',
    //   content: 'IMPORTANT EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: true,
    // },

    // {
    //   id: '12',
    //   start: subHours(addDays(startOfHour(new Date()), 1), 1),
    //   end: subHours(addDays(addHours(startOfHour(new Date()), 1), 1), 1),
    //   title: 'Event 12',
    //   content: 'IMPORTANT EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'danger' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    //   draggable: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    // },
    // {
    //   id: '2',
    //   start: addDays(startOfHour(new Date()), 2),
    //   end: subMinutes(addDays(addHours(startOfHour(new Date()), 2), 2), 15),
    //   title: 'Event 2',
    //   content: 'LESS IMPORTANT EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'warning' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '22',
    //   start: subHours(addDays(startOfHour(new Date()), 2), 1),
    //   end: subHours(addDays(addHours(startOfHour(new Date()), 1), 2), 1),
    //   title: 'Event 22',
    //   content: 'LESS IMPORTANT EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'warning' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '3',
    //   start: addDays(startOfHour(new Date()), 3),
    //   end: addDays(addHours(startOfHour(new Date()), 3), 3),
    //   title: 'Event 3',
    //   content: 'NOT IMPORTANT EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '32',
    //   start: subHours(addDays(startOfHour(new Date()), 3), 1),
    //   end: subHours(addDays(addHours(startOfHour(new Date()), 1), 3), 1),
    //   title: 'Event 32',
    //   content: 'NOT IMPORTANT EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '4',
    //   start: startOfHour(addHours(new Date(), 2)),
    //   end: addHours(startOfHour(addHours(new Date(), 2)), 2),
    //   title: 'Event 4',
    //   content: 'TODAY EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '5',
    //   start: addDays(startOfHour(setHours(new Date(), 6)), 2),
    //   end: addHours(addDays(startOfHour(setHours(new Date(), 6)), 2), 1),
    //   title: 'Event 5',
    //   content: 'EARLY EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '51',
    //   start: addDays(startOfHour(setHours(new Date(), 6)), 2),
    //   end: addHours(addDays(startOfHour(setHours(new Date(), 6)), 2), 1),
    //   title: 'Event 51',
    //   content: 'EARLY EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '52',
    //   start: addHours(addDays(startOfHour(setHours(new Date(), 6)), 2), 1),
    //   end: addHours(addDays(startOfHour(setHours(new Date(), 6)), 2), 2),
    //   title: 'Event 52',
    //   content:
    //     'EARLY EVENT WITH LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG DESCRIPTION',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '53',
    //   start: addHours(addDays(startOfHour(setHours(new Date(), 6)), 2), 2),
    //   end: addMinutes(
    //     addHours(addDays(startOfHour(setHours(new Date(), 6)), 2), 2),
    //     30
    //   ),
    //   title: 'Event 53',
    //   content: 'EARLY EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '6',
    //   start: startOfHour(setHours(new Date(), 22)),
    //   end: addHours(startOfHour(setHours(new Date(), 22)), 10),
    //   title: 'Event 6',
    //   content: 'TWO DAYS EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '7',
    //   start: addDays(startOfHour(setHours(new Date(), 14)), 4),
    //   end: addDays(addDays(startOfHour(setHours(new Date(), 14)), 4), 2),
    //   title: 'Event 7',
    //   content: 'THREE DAYS EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
    // {
    //   id: '8',
    //   start: startOfHour(addHours(new Date(), 2)),
    //   end: addHours(startOfHour(addHours(new Date(), 2)), 3),
    //   title: 'Event 8',
    //   content: 'CONCURRENT EVENT',
    //   color: { primary: '#E0E0E0', secondary: '#EEEEEE' },

    //   status: 'ok' as CalendarSchedulerEventStatus,
    //   isClickable: true,
    //   isDisabled: false,
    // },
  ];

  constructor(){
   
  }

  getEvents(meetingRoomID: string) {
    let storedEvents = localStorage.getItem(this.eventsByMeetingRoomIDKey)
    if(storedEvents){
      this.eventsByMeetingRoomID[meetingRoomID] = JSON.parse(storedEvents);
      return of(this.eventsByMeetingRoomID[meetingRoomID]|| []);
    }
    localStorage.setItem(this.eventsByMeetingRoomIDKey , JSON.stringify(this.eventsByMeetingRoomID[meetingRoomID]))
    return of(this.eventsByMeetingRoomID[meetingRoomID] || []);
  }



  //by default i pass 1 hour from start time to filter events
  // filterEventsByTime(startTime,endTime = addHours(new Date(), 1)){
    
  //   let available = []
  //   let availableSoon = []
  //   let occupied = []

  //   this.eventsByMeetingRoomID.forEach((event) => {
  //     if (isBefore(currentTime, event.start)) {
  //       if (isBefore(addMinutes(event.start, 15), currentTime)) {
  //         availableSoon.push(event);
  //       } else {
  //         available.push(event);
  //       }
  //     } else if (isBefore(currentTime, event.end)) {
  //       occupied.push(event);
  //     }
  //   });
    
  //   return{
  //     available,availableSoon,occupied
  //   }
  // }

  addEvents(meetingRoomID: string, obj:any) {
    if (!this.eventsByMeetingRoomID[meetingRoomID]) {
      this.eventsByMeetingRoomID[meetingRoomID] = [];
    }
    let newBookingEvent: CalendarSchedulerEvent = {
      id: Math.round(Math.random() * 10).toString(),
      start: startOfHour(addHours(new Date(this.concatDateTime(obj.date, obj.starttime)), 0)),
      end: addHours(startOfHour(addHours(new Date(this.concatDateTime(obj.date, obj.endtime)), 0)), 0),
      title: obj.room,
      content: obj.description,
      color: { primary: '#E0E0E0', secondary: '#EEEEEE' },
      status: 'ok' as CalendarSchedulerEventStatus,
      isClickable: true,
      isDisabled: false,
    };
    this.eventsByMeetingRoomID[meetingRoomID].push(newBookingEvent);
    localStorage.setItem(
      this.eventsByMeetingRoomIDKey,
      JSON.stringify(this.eventsByMeetingRoomID)
    )
  }
  concatDateTime(setDate,time){

  let date = parse(setDate, 'yyyy-MM-dd', new Date());

// Parse the time string into hours and minutes
const [hours, minutes] = time.split(':').map(Number);

// Set the hours and minutes for the Date object
return setMinutes(setHours(date, hours), minutes);
  }
}
