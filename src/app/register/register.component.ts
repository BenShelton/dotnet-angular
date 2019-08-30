import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  register(): void {
    this.authService.register(this.model)
      .subscribe(() => {
        console.log('Registration successful');
      }, error => {
        console.log(error);
      });
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }

}
