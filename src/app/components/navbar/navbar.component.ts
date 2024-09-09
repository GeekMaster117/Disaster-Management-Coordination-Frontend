import { Component, ViewChild } from '@angular/core';
import { SideMenuComponent } from './side-menu/side-menu.component'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild(SideMenuComponent) sideMenu!: SideMenuComponent;

  onSideMenuClose(): void {
  }
}
