import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'integer-property',
  templateUrl: './integer-property.component.html',
  styleUrls: ['./integer-property.component.css']
})
export class IntegerPropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;

  constructor() { }

  ngOnInit() {
  }

}
