import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'richtext-property',
  templateUrl: './richtext-property.component.html',
  styleUrls: ['./richtext-property.component.css']
})
export class RichtextPropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;
  @Output() onRichtextSubmit = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  setModel(content) {
    this.model[this.view.name].value = content;
  }

  onSubmit() {
    this.onRichtextSubmit.emit();
  }
}