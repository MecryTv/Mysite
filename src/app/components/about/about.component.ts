import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, AfterViewInit {

  constructor(
    private animationService: AnimationService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Initialisierung kann hier stattfinden
  }

  ngAfterViewInit(): void {
    // Warte auf DOM-Rendering und initialisiere Animationen
    this.initAnimations();
  }

  /**
   * Initialisiert die Scroll-Animationen für diese Komponente
   */
  private initAnimations(): void {
    // Selektor für alle animierbaren Elemente in dieser Komponente
    const selector = '.fade-in, .slide-right, .slide-left, .scale-up';
    
    // Animationen über den Service starten
    this.animationService.initScrollAnimation(selector);
  }
}
