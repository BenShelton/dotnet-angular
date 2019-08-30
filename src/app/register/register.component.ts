import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any;
  model: any = {};

  constructor() { }

  ngOnInit() {
  }

  register(): void {
    console.log(this.model);
  }

  cancel(): void {
    console.log('Cancelled');
  }

}
