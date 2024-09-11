import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-legend-card',
  templateUrl: './legend-card.component.html',
  styleUrls: ['./legend-card.component.css']
})
export class LegendCardComponent {
  isCollapsed = false;

  @ViewChild('card', { static: false }) card!: ElementRef;

  toggleCard(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  @HostListener('cdkDragEnded', ['$event'])
  onDragEnded(event: CdkDragEnd): void {
    const cardElement = this.card.nativeElement;
    const navbarHeight = 80; // Height of your navbar
    const viewportHeight = window.innerHeight;

    // Get the card's bounding rectangle
    const cardRect = cardElement.getBoundingClientRect();
    const navbarRect = document.querySelector('.navbar')?.getBoundingClientRect();

    // Ensure the card stays within the visible viewport
    if (cardRect.top < navbarHeight) {
      cardElement.style.top = `${navbarHeight}px`;
    }
    if (cardRect.bottom > viewportHeight) {
      cardElement.style.top = `${viewportHeight - cardRect.height}px`;
    }
  }
}
