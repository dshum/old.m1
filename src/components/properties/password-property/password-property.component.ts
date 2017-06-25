import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'password-property',
  templateUrl: './password-property.component.html',
  styleUrls: ['./password-property.component.css']
})
export class PasswordPropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;

  constructor() { }

  ngOnInit() {
  }

}
