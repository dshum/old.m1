import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'image-property',
  templateUrl: './image-property.component.html',
  styleUrls: ['./image-property.component.css']
})
export class ImagePropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;

  constructor() { }

  ngOnInit() {
    this.model[this.view.name] = {};
  }

  selectFile(event) {
    let name = this.view.name;
    let fileInput = jQuery(':file[name="'+name+'"]');

    fileInput.click();
  }

  changeFile(event) {
    let name = this.view.name;
    let path = event.target.files[0] ? event.target.files[0].name : 'Выберите файл';

    this.model[this.view.name].value = event.target.files[0];
    this.model[this.view.name].drop = false;

    jQuery('.file[name="'+name+'"]').html(path);
  }

  resetFile(event) {
    let name = this.view.name;
        
    jQuery('.file[name="'+name+'"]').html('Выберите файл');
    jQuery(':file[name="'+name+'"]').val('');

    this.model[this.view.name] = {};
  }
}