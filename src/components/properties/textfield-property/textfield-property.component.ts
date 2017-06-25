import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpService } from '../../http.service';

declare var jQuery:any;

@Component({
  selector: 'textfield-property',
  templateUrl: './textfield-property.component.html',
  styleUrls: ['./textfield-property.component.css']
})
export class TextfieldPropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;

  value = null;

  constructor(
    public http: HttpService
  ) { }

  ngOnInit() {
    if (this.view.isMainProperty) {
      this.model[this.view.name] = {
        value: (this.view.value ? this.view.value.id : null)
      };
    }
  }

  ngAfterViewInit() {
    if (this.view.isMainProperty) {
      let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
      let token = loggedUser && loggedUser.token;
      let self = this;

      jQuery('#'+this.view.name+'_autocomplete').autocomplete({
        serviceUrl: this.http.url('/elements/autocomplete'),
        ajaxSettings: {
          headers: this.http.authHeader()
        },
        params: {
          item: this.view.relatedClass
        },
        onSelect: function (suggestion) {
          self.model[self.view.name].value = suggestion.id;
          self.value = suggestion.value;
          self.view.value = {
            name: suggestion.value,
            classId: suggestion.classId
          };
        },
        appendTo: jQuery('span.autocomplete-container[name="'+this.view.name+'_auto"]'),
        maxHeight: 400,
        minChars: 0
      });
    }
  }

  reset() {
    this.view.value = null;
    this.model[this.view.name].value = null;
    this.value = null;
  }

}