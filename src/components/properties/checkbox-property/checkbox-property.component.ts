import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'checkbox-property',
  templateUrl: './checkbox-property.component.html',
  styleUrls: ['./checkbox-property.component.css']
})
export class CheckboxPropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;

  constructor() { }

  ngOnInit() {
  }

}
