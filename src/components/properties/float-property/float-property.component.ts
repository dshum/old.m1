import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'float-property',
  templateUrl: './float-property.component.html',
  styleUrls: ['./float-property.component.css']
})
export class FloatPropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;

  constructor() { }

  ngOnInit() {
  }

}
