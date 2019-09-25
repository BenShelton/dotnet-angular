import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';

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
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  loadTokens() {
    const token = localStorage.getItem(this.tokenPath);
    const user = localStorage.getItem(this.userPath);
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.currentUser = JSON.parse(user);
      this.photoUrl.next(this.currentUser.photoUrl);
    }
  }

  unloadTokens() {
    this.photoUrl.next('../../assets/user.png');
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
            this.changeMemberPhoto(this.currentUser.photoUrl);
          }
        })
      );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem(this.tokenPath);
    return !this.jwtHelper.isTokenExpired(token);
  }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
    this.currentUser.photoUrl = photoUrl;
    localStorage.setItem(this.userPath, JSON.stringify(this.currentUser));
  }
}
