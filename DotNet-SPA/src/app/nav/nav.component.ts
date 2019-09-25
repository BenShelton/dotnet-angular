import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private router: Router, public authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login(): void {
    this.authService.login(this.model)
      .subscribe(() => {
        this.alertify.success('Logged in successfully');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.router.navigate(['/members']);
      });
  }

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logout(): void {
    this.authService.unloadTokens();
    this.alertify.message('Logged out');
    this.router.navigate(['/home']);
  }
}
