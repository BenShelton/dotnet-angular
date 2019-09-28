import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 5;
  likesParam: 'Likers' | 'Likees' = 'Likers';

  constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}

  resolve(): Observable<User[]> {
    return this.userService.getUsers(this.pageNumber, this.pageSize, undefined, this.likesParam).pipe(
      catchError(error => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
