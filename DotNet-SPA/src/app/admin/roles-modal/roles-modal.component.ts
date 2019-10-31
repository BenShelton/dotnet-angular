import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  user: User;
  roles: { name: string; value: string; checked: boolean }[];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }
}
