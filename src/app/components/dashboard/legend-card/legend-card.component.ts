import { Component } from '@angular/core';

@Component({
  selector: 'app-legend-card',
  templateUrl: './legend-card.component.html',
  styleUrl: './legend-card.component.css'
})
export class LegendCardComponent {
  isCollapsed = false; 

  toggleCard(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
