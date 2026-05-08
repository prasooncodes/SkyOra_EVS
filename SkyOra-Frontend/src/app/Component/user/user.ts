import { Component, OnInit } from '@angular/core';
import { UserServices } from '../../services/user';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  users: any[] = [];

  constructor(private userService: UserServices, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Users fetched successfully:', this.users);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }
}