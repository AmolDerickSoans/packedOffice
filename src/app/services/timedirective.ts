import { Directive, HostListener, Injectable } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRoundToNearest15]',
})
@Injectable({
  providedIn: 'root',
})
export class RoundToNearest15Directive {
  constructor(private ngControl: NgControl) {}

  @HostListener('input')
  onInput() {
    const value = this.ngControl.value;
    if (!value) {
      return;
    }

    const [hours, minutes] = value.split(':').map(Number);
    const roundedMinutes = Math.round(minutes / 15) * 15;
    const roundedHours = hours + Math.floor(roundedMinutes / 60);
    const finalHours = roundedHours % 24;
    const finalMinutes = roundedMinutes % 60;
    const roundedValue = `${finalHours
      .toString()
      .padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
    this.ngControl.control.setValue(roundedValue, { emitEvent: false });
  }
}
