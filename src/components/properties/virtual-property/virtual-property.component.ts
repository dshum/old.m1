import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'virtual-property',
  templateUrl: './virtual-property.component.html',
  styleUrls: ['./virtual-property.component.css']
})
export class VirtualPropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;

  constructor() { }

  ngOnInit() {
  }

}
