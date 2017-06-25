import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import '../../../assets/js/calendarview/jquery.calendar.js';

declare var jQuery: any;

@Component({
  selector: 'date-property',
  templateUrl: './date-property.component.html',
  styleUrls: ['./date-property.component.css']
})
export class DatePropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;
  @Input() date: string;

  constructor() { }

  ngOnInit() {
    this.setDate();
  }

  ngAfterViewInit() {
    let self = this;

    jQuery('#'+this.view.name+'_date').val(this.date);

    jQuery('#'+this.view.name+'_date').calendar({
      dateFormat: '%Y-%m-%d',
      selectHandler: function() {
        self.date = this.date.print(this.dateFormat);
        self.setDate();
      }
    });
  }

  setDate() {
    try {
      let date = new Date(this.date);

      this.model[this.view.name].value = date.toISOString();
    } catch (err) {}
  }
}
