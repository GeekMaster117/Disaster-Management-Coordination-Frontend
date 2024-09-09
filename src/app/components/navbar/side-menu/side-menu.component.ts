import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  @Output() close = new EventEmitter<void>();
  sideMenuOpen = false;

  toggleMenu(): void {
    this.sideMenuOpen = !this.sideMenuOpen;
  }

  closeMenu(): void {
    this.sideMenuOpen = false;
    this.close.emit();
  }
}
