import { Injectable } from '@angular/core';
import {
  CalendarSchedulerEvent,
  CalendarSchedulerEventStatus,
  CalendarSchedulerEventAction,
} from 'angular-calendar-scheduler';
import {
  addDays,
  startOfHour,
  addHours,
  subHours,
  setHours,
  subMinutes,
  addMinutes,
  parse,
  setMinutes,
} from 'date-fns';
import { of } from 'rxjs';

@Injectable()
export class AppService {
  private eventsByMeetingRoomIDKey = 'eventsByMeetingRoomID';
  eventsByMeetingRoomID: { [meetingRoomID: string]: CalendarSchedulerEvent[] } = {};

  constructor() {
    const storedEvents = localStorage.getItem(this.eventsByMeetingRoomIDKey);
    if (storedEvents) {
      this.eventsByMeetingRoomID = JSON.parse(storedEvents);
    }
  }
  getEvents(meetingRoomID:string) {
    return of(this.eventsByMeetingRoomID[meetingRoomID] || []);
  }

  addEvents(obj , meetingRoomID:string){
    if (!this.eventsByMeetingRoomID[meetingRoomID]) {
      this.eventsByMeetingRoomID[meetingRoomID] = [];
    }

    console.log('data' , obj);
    
    let newBookingEvent = {
      id: obj.description,
      start: startOfHour(addHours(new Date(this.concatDateTime(obj.date, obj.starttime)), 0)),
      end: addHours(startOfHour(addHours(new Date(this.concatDateTime(obj.date, obj.endtime)), 0)), 0),
      title: obj.room,
      content: obj.description,
      color: { primary: '#E0E0E0', secondary: '#EEEEEE' },
      status: 'ok' as CalendarSchedulerEventStatus,
      isClickable: true,
      isDisabled: false,
    };

    console.log('obj' , newBookingEvent)


    this.eventsByMeetingRoomID[meetingRoomID].push(newBookingEvent);
    localStorage.setItem(
      this.eventsByMeetingRoomIDKey,
      JSON.stringify(this.eventsByMeetingRoomID)
    );
  }

  concatDateTime(setDate, time) {
    let date = parse(setDate, 'yyyy-MM-dd', new Date());

    // Parse the time string into hours and minutes
    const [hours, minutes] = time.split(':').map(Number);

    // Set the hours and minutes for the Date object
    return setMinutes(setHours(date, hours), minutes);
  }

  getAllLocalStorageData(): { [key: string]: any } {
    const allData: { [key: string]: any } = {};
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          allData[key] = JSON.parse(value);
        }
      }
    }
  
    return allData;
  }

  categorizeEvents(events: { [room: string]:any }, startTime: Date, endTime: Date = addHours(startTime, 1)):any {
    const categorizedEvents:any = [];
  
    for (const room in events) {
      if (events.hasOwnProperty(room)) {
        events[room].forEach(event => {
          if (event.start && event.end) {
            const eventStartTime = new Date(event.start);
            const eventEndTime = new Date(event.end);
  
            if ((eventStartTime <= startTime && eventEndTime >= startTime) || (eventStartTime <= endTime && eventEndTime >= endTime)) {
              categorizedEvents.push({ ...event, availability: 'occupied' });
            } else if (eventEndTime.getTime() <= startTime.getTime() + 15 * 60 * 1000) {
              categorizedEvents.push({ ...event, availability: 'available soon' });
            } else {
              categorizedEvents.push({ ...event, availability: 'available' });
            }
          }
        });
      }
    }
  
    return categorizedEvents;
  }


}
