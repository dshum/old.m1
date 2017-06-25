import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'textarea-property',
  templateUrl: './textarea-property.component.html',
  styleUrls: ['./textarea-property.component.css']
})
export class TextareaPropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;

  constructor() { }

  ngOnInit() {
  }

  nl2br(text) {
    return text ? text.replace(/\n/g, "<br />") : '';
  }
}