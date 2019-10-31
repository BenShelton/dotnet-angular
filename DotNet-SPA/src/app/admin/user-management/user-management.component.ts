import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe((users: User[]) => {
      this.users = users;
    }, error => {
      console.log(error);
      this.alertifyService.error(error);
    });
  }

  editRolesModal(user: User) {
    const initialState = {
      user,
      roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  private getRolesArray(user: User) {
    const userRoles = user.roles;
    const roles = [
      { name: 'Admin', value: 'Admin', checked: false },
      { name: 'Moderator', value: 'Moderator', checked: false },
      { name: 'Member', value: 'Member', checked: false },
      { name: 'VIP', value: 'VIP', checked: false }
    ];

    for (const userRole of userRoles) {
      roles.find(r => r.value === userRole).checked = true;
    }
    return roles;
  }
}
