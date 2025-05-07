import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;
  submitted = false;
  success = false;
  error = false;

  constructor(
    private fb: FormBuilder,
    private animationService: AnimationService,
    private elementRef: ElementRef
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Initialize EmailJS with your user ID
    // Registriere dich auf https://www.emailjs.com/ und ersetze 'YOUR_EMAILJS_PUBLIC_KEY' mit deinem Public Key
    emailjs.init('d4AbRNES6dMaQfsSb');
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

  // Getter für einfachen Zugriff auf Formularfelder im Template
  get f() { 
    return this.contactForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.contactForm.invalid) {
      return;
    }
    
    const templateParams = {
      name: this.contactForm.value.name || '',
      email: this.contactForm.value.email || '',
      subject: this.contactForm.value.subject || '',
      message: this.contactForm.value.message || ''
    };
    
    // Sende E-Mail mit EmailJS
    // Ersetze 'YOUR_SERVICE_ID' und 'YOUR_TEMPLATE_ID' mit deinen IDs von EmailJS
    // Diese IDs findest du im EmailJS Dashboard nach dem Einrichten eines Services und Templates
    emailjs.send('service_qsc5tth', 'template_a6gp2pj', templateParams)
      .then((response) => {
        console.log('E-Mail erfolgreich gesendet!', response);
        this.success = true;
        this.error = false;
        this.contactForm.reset();
        this.submitted = false;
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          this.success = false;
        }, 5000);
      }, (err) => {
        console.error('Fehler beim Senden der E-Mail:', err);
        this.error = true;
        this.success = false;
      });
  }
}
