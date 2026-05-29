import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-addons',
  imports: [RouterLink],
  templateUrl: './addons.html',
  styleUrl: './addons.css',
})
export class Addons {
  openInfo: Record<string, boolean> = {};

  toggleInfo(key: string) {
    this.openInfo[key] = !this.openInfo[key];
  }

  isOpen(key: string) {
    return !!this.openInfo[key];
  }
}
