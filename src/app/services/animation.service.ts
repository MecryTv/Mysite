import { Injectable, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  private isBrowser: boolean;
  private observer: IntersectionObserver | null = null;
  private animatedElements: NodeListOf<Element> | null = null;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
  ) {
    // Prüfen, ob wir im Browser-Kontext sind
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Auf Navigationsereignisse reagieren
    if (this.isBrowser) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Wenn zur gleichen URL navigiert wird (z.B. durch Navbar-Links mit Ankern)
        setTimeout(() => this.resetAnimations(), 100);
      });
    }
  }

  /**
   * Initialisiert den Intersection Observer für Animationen
   * @param elementsSelector CSS-Selektor für zu animierende Elemente
   */
  initScrollAnimation(elementsSelector: string = '.fade-in, .slide-right, .slide-left, .scale-up'): void {
    // Führe nur im Browser-Kontext aus, nicht während des serverseitigen Renderings
    if (!this.isBrowser) {
      return;
    }
    
    this.ngZone.runOutsideAngular(() => {
      // Warte, bis DOM geladen ist
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupObserver(elementsSelector));
      } else {
        this.setupObserver(elementsSelector);
      }
    });
  }

  /**
   * Setzt alle Animationen zurück, damit sie erneut abgespielt werden können
   */
  resetAnimations(): void {
    if (!this.isBrowser || !this.animatedElements) {
      return;
    }
    
    // Observer trennen, um Neustart zu erzwingen
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Aktualisierte Elementliste holen (falls DOM-Änderungen stattgefunden haben)
    const elementsSelector = '.fade-in, .slide-right, .slide-left, .scale-up';
    this.animatedElements = document.querySelectorAll(elementsSelector);
    
    // Sichtbarkeitsklasse entfernen, um Animationen zurückzusetzen
    this.animatedElements.forEach(element => {
      // Kurzes Timeout für besseren Übergang
      setTimeout(() => {
        // Prüfen, ob im Viewport
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
        
        if (!isVisible) {
          element.classList.remove('visible');
        } else {
          element.classList.add('visible');
        }
      }, 50);
    });
    
    // Observer neu einrichten
    this.setupObserver(elementsSelector);
  }

  /**
   * Richtet den Intersection Observer ein
   */
  private setupObserver(elementsSelector: string): void {
    if (!this.isBrowser) {
      return; // Nicht auf dem Server ausführen
    }
    
    this.animatedElements = document.querySelectorAll(elementsSelector);
    
    // Sofort sichtbare Elemente animieren (beim ersten Laden)
    this.checkInitialVisibility(this.animatedElements);
    
    // Intersection Observer Optionen
    const observerOptions = {
      root: null, // Viewport als Referenz
      rootMargin: '0px',
      threshold: 0.15 // 15% des Elements muss sichtbar sein
    };
    
    // Observer erstellen
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Element wird im Viewport sichtbar
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } 
        // Element verlässt den Viewport
        else {
          entry.target.classList.remove('visible');
        }
      });
    }, observerOptions);
    
    // Alle Elemente beobachten
    if (this.observer && this.animatedElements) {
      this.animatedElements.forEach(element => {
        this.observer!.observe(element);
      });
    }
  }

  /**
   * Prüft, welche Elemente initial sichtbar sind und animiert diese
   */
  private checkInitialVisibility(elements: NodeListOf<Element>): void {
    if (!this.isBrowser) {
      return; // Nicht auf dem Server ausführen
    }
    
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      
      // Wenn Element im sichtbaren Bereich ist
      if (rect.top <= windowHeight * 0.85) {
        element.classList.add('visible');
      }
    });
  }
}
