import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl + 'admin/';

  constructor(private http: HttpClient) {}

  getUsersWithRoles() {
    return this.http.get(this.baseUrl + 'usersWithRoles');
  }

  updateUserRoles(user: User, roles: {}) {
    return this.http.post(this.baseUrl + 'editRoles/' + user.userName, roles);
  }

  getUnapprovedPhotos() {
    return this.http.get(this.baseUrl + 'photosForModeration');
  }

  approvePhoto(id: number) {
    return this.http.post(this.baseUrl + 'photos/' + id + '/approve', {});
  }

  declinePhoto(id: number) {
    return this.http.post(this.baseUrl  + 'photos/' + id + '/decline', {});
  }
}
