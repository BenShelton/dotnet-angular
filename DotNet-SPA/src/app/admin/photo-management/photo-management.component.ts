import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { AdminService } from 'src/app/services/admin.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  photos: Photo[];

  constructor(private adminService: AdminService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.adminService.getUnapprovedPhotos().subscribe((photos: Photo[]) => {
      this.photos = photos;
    }, error => {
      this.alertify.error(error);
    });
  }

  approvePhoto(id: number) {

  }

  declinePhoto(id: number) {

  }
}
