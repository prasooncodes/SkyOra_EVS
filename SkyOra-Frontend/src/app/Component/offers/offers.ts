import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Offer {
  icon: string;
  title: string;
  desc: string;
  code: string;
}
@Component({
  selector: 'app-offers',
  imports: [FormsModule, CommonModule],
  templateUrl: './offers.html',
  styleUrl: './offers.css',
})
export class   Offers implements OnInit {
   activeTab: string = 'flights';

  // ऑफर्स का डेटा ऑब्जेक्ट
  allOffers: { [key: string]: Offer[] } = {
    flights: [
      { icon: '✈️', title: 'Travel Sale', desc: 'Up to 20% off with code:', code: 'TRAVEL20' },
      { icon: '📅', title: 'Weekend', desc: 'Up to 15% off with code:', code: 'WEEKEND' },
      { icon: '🚀', title: 'FLYMORE', desc: 'Up to 15% off with code:', code: 'FLYMORE' }
    ],
    special: [
      { icon: '🌟', title: 'Student Fare', desc: 'Extra baggage with code:', code: 'STUDENT' }
    ],
    bank: [
      { icon: '💳', title: 'HDFC Bank', desc: 'Flat 10% off with code:', code: 'HDFCFEST' }
    ],
    hotel: [
      { icon: '🏨', title: 'Luxury Stay', desc: 'Flat 25% off with code:', code: 'STAY25' }
    ]
  };

  constructor() { }

  ngOnInit(): void { }

  // टैब बदलने का फंक्शन
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  // वर्तमान में एक्टिव ऑफर्स प्राप्त करें
  get currentOffers(): Offer[] {
    return this.allOffers[this.activeTab];
  }
}
