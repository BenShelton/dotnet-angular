import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenPath = 'token';
  userPath = 'user';
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;

  constructor(private http: HttpClient) { }

  loadTokens() {
    const token = localStorage.getItem(this.tokenPath);
    const user = localStorage.getItem(this.userPath);
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  unloadTokens() {
    localStorage.removeItem(this.tokenPath);
    localStorage.removeItem(this.userPath);
    this.decodedToken = null;
    this.currentUser = null;
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          if (response) {
            localStorage.setItem(this.tokenPath, response.token);
            localStorage.setItem(this.userPath, JSON.stringify(response.user));
            this.decodedToken = this.jwtHelper.decodeToken(response.token);
            this.currentUser = response.user;
          }
        })
      );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }

  loggedIn() {
    const token = localStorage.getItem(this.tokenPath);
    return !this.jwtHelper.isTokenExpired(token);
  }
}
