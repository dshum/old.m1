import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'file-property',
  templateUrl: './file-property.component.html',
  styleUrls: ['./file-property.component.css']
})
export class FilePropertyComponent implements OnInit {

  @Input() mode: string;
  @Input() view: any;
  @Input() model: any;

  constructor() { }

  ngOnInit() {
  }

  selectFile(event) {
    let name = event.target.getAttribute('name');
    let fileInput = jQuery(':file[name="'+name+'"]');

    fileInput.click();
  }

  changeFile(event) {
    let name = event.target.getAttribute('name');
    let path = event.target.files[0] ? event.target.files[0].name : 'Выберите файл';

    this.model[this.view.name].value = event.target.files[0];

    jQuery('.file[name="'+name+'"]').html(path);
  }

  resetFile(event) {
    let name = event.target.getAttribute('name');
        
    jQuery('.file[name="'+name+'"]').html('Выберите файл');
    jQuery(':file[name="'+name+'"]').val('');

    this.model[this.view.name].value = null;
  }
}