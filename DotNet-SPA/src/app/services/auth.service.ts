import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenPath = 'token';
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  loadToken() {
    const token = localStorage.getItem(this.tokenPath);
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          if (response) {
            localStorage.setItem(this.tokenPath, response.token);
            this.decodedToken = this.jwtHelper.decodeToken(response.token);
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
