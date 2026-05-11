import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactus.html',
  styleUrl: './contactus.css',
})
export class Contactus {
  selectedCity: string = 'Delhi';
  phoneNumber: string = '+91 9606 11 21 31';

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  updatePhone() {
    const numbers: any = {
      'Delhi': '+91 9606 11 21 31',
      'Mumbai': '+91 9606 22 21 31',
      'Bangalore': '+91 9606 80 21 31',
      'Chennai': '+91 9606 44 21 31',
      'Kolkata': '+91 9606 33 21 31',
      'Hyderabad': '+91 9606 40 21 31',
      'Pune': '+91 9606 20 21 31',
      'Ahmedabad': '+91 9606 79 21 31',
      'Jaipur': '+91 9606 141 21 31',
      'Surat': '+91 9606 261 21 31',
      'Lucknow': '+91 9606 522 21 31',
      'Kanpur': '+91 9606 512 21 31',
      'Nagpur': '+91 9606 712 21 31',
      'Indore': '+91 9606 731 21 31',
      'Thane': '+91 9606 22 21 31',
      'Bhopal': '+91 9606 755 21 31',
      'Visakhapatnam': '+91 9606 891 21 31',
      'Patna': '+91 9606 612 21 31',
      'Vadodara': '+91 9606 265 21 31',
      'Ghaziabad': '+91 9606 120 21 31'
    };
    this.phoneNumber = numbers[this.selectedCity];
  }

  sendEmail() {
    if (this.contactForm.name && this.contactForm.email && this.contactForm.subject && this.contactForm.message) {
      // Here you would typically send the email to your backend
      console.log('Sending email:', this.contactForm);

      // For now, just show a success message
      alert('Thank you for your message! We\'ll get back to you soon.');

      // Reset the form
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    }
  }
}

