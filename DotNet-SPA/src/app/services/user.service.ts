import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient) { }

  getUsers(
    page: number,
    itemsPerPage: number,
    userParams = { minAge: 18, maxAge: 99, gender: '', orderBy: 'lastActive' },
    likesParam?: 'Likers' | 'Likees'
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult = new PaginatedResult<User[]>();
    let params: HttpParams = new HttpParams()
      .append('pageNumber', String(page))
      .append('pageSize', String(itemsPerPage))
      .append('minAge', String(userParams.minAge))
      .append('maxAge', String(userParams.maxAge))
      .append('gender', userParams.gender)
      .append('orderBy', userParams.orderBy);

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    } else if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this.http.get<User[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          const paginatedHeaders = response.headers.get('Pagination');
          if (paginatedHeaders) {
            paginatedResult.pagination = JSON.parse(paginatedHeaders);
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + id + '/like/' + recipientId, {});
  }

  getMessages(
    id: number,
    page: number,
    itemsPerPage: number,
    messageContainer: 'Inbox' | 'Outbox' | 'Unread'
  ) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    const params = new HttpParams()
      .append('pageNumber', String(page))
      .append('pageSize', String(itemsPerPage))
      .append('MessageContainer', messageContainer);

    return this.http.get<Message[]>(this.baseUrl + id + '/messages', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          const paginatedHeaders = response.headers.get('Pagination');
          if (paginatedHeaders) {
            paginatedResult.pagination = JSON.parse(paginatedHeaders);
          }
          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + id + '/messages', message);
  }

  deleteMessage(id: number, messageId: number) {
    return this.http.post(this.baseUrl + id + '/messages/' + messageId, {});
  }
}
