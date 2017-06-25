import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import '../../../assets/js/calendarview/jquery.calendar.js';

declare var jQuery:any;

@Component({
  selector: 'datetime-property',
  templateUrl: './datetime-property.component.html',
  styleUrls: ['./datetime-property.component.css']
})
export class DatetimePropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;
  @Input() datetime: string;
  @Input() date: string;
  @Input() hours: string;
  @Input() minutes: string;
  @Input() seconds: string;

  constructor() { }

  ngOnInit() {
    this.setDatetime();
  }

  ngAfterViewInit() {
    let self = this;

    jQuery('#'+this.view.name+'_date').val(this.date);

    jQuery('#'+this.view.name+'_date').calendar({
      dateFormat: '%Y-%m-%d',
      selectHandler: function() {
        self.date = this.date.print(this.dateFormat);
        self.setDatetime();
      }
    });
  }

  setDatetime() {
    try {
      this.model[this.view.name] = {
        date: this.date,
        hours: this.hours,
        minutes: this.minutes,
        seconds: this.seconds
      };
    } catch (err) {}
  }
}
