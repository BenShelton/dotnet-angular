import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from 'src/app/models/user';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.user = data.user;
      }
    );

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.galleryImages = this.getImages();
  }

  getImages() {
    return this.user.photos.map(photo => ({
      small: photo.url,
      medium: photo.url,
      large: photo.url,
      description: photo.description
    }));
  }
}
