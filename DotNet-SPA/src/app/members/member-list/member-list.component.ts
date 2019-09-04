import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];

  constructor(private route: ActivatedRoute, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.users = data.users;
      }
    );
  }
}
