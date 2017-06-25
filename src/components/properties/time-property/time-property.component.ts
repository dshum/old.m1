import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'time-property',
  templateUrl: './time-property.component.html',
  styleUrls: ['./time-property.component.css']
})
export class TimePropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;
  @Input() time: string;
  @Input() hours: string;
  @Input() minutes: string;
  @Input() seconds: string;

  constructor() { }

  ngOnInit() {
    this.setTime();
  }

  setTime() {
    try {
      let date = new Date();

      date.setHours(+this.hours, +this.minutes, +this.seconds);

      this.model[this.view.name].value = date.toTimeString();
    } catch (err) {}
  }
}
