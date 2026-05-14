// src/app/Component/user/user.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserServices } from '../../services/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Ensure FormsModule is imported

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  users: any[] = [];
  editingUser: any = null; // Stores the user currently being edited

  constructor(private userService: UserServices, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error:', error)
    });
  }

  // ✅ Open Edit Mode
  openEdit(user: any) {
    // Create a copy so changes don't reflect in the list until saved
    this.editingUser = { ...user }; 
  }

  // ✅ Close Edit Mode
  closeEdit() {
    this.editingUser = null;
  }

  // ✅ Save Changes
  onSave() {
    if (this.editingUser) {
      const id = this.editingUser.UserId || this.editingUser.userId;
      const data = {
        name: this.editingUser.Name || this.editingUser.name,
        age: Number(this.editingUser.Age ?? this.editingUser.age),
        gender: this.editingUser.Gender || this.editingUser.gender || 'User',
        role: this.editingUser.Role || this.editingUser.role || 'User',
        email: this.editingUser.Email || this.editingUser.email || '',
        ...(this.editingUser.password ? { password: this.editingUser.password } : {}),
      };

      this.userService.editUser(id, data).subscribe({
        next: () => {
          alert("Traveler updated successfully!");
          this.closeEdit();
          this.loadUsers(); // Refresh the grid
        },
        error: (err) => alert("Update failed. Check console.")
      });
    }
  }

  onDeleteUser(id: number, name: string) {
    // Native browser confirmation dialog
    if (confirm(`Are you sure you want to delete traveler ${name}? This action is permanent.`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully.');
          // Locally filter out the deleted user to refresh UI without a full reload
          this.users = this.users.filter(user => (user.UserId || user.userId) !== id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Failed to delete user. Please try again.');
        }
      });
    }
  }
}
