import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-anniversary-popup',
  standalone: true,
  templateUrl: './anniversary-popup.component.html',
  styles: [`
    /* Smooth fade-in */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fadeIn { animation: fadeIn 1s ease forwards; }

    /* Popup scale-up */
    @keyframes popup { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
    .animate-popup { animation: popup 0.8s ease forwards; }

    /* Glowing text */
    @keyframes textGlow { from { text-shadow: 0 0 10px rgba(173,216,230,0.7); } to { text-shadow: 0 0 25px rgba(173,216,230,1); } }
    .animate-textGlow { animation: textGlow 2s ease-in-out infinite alternate; }

    /* Pulsing heart */
    @keyframes heartPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.25); } }
    .animate-heartPulse { animation: heartPulse 1.3s ease-in-out infinite; }

    /* Gradient background animation */
    @keyframes gradientMove { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
    .animate-gradientMove { animation: gradientMove 12s ease-in-out infinite; }

    /* Floating octopuses */
    .octo {
      position: absolute;
      bottom: -3rem;
      font-size: 2rem; /* smaller for mobile */
      opacity: 0.8;
      animation: floatUp 7s linear infinite;
    }

    @keyframes floatUp {
      0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
      25% { transform: translateY(-25vh) translateX(10px) scale(1.1); }
      50% { transform: translateY(-50vh) translateX(-10px) scale(1.15); opacity: 1; }
      75% { transform: translateY(-75vh) translateX(15px) scale(1.1); }
      100% { transform: translateY(-120vh) translateX(0) scale(1.2); opacity: 0; }
    }
  `]
})
export class AnniversaryPopupComponent {
  @Output() closed = new EventEmitter<void>();
  visible = true;

  close() {
    this.visible = false;
    this.closed.emit();
  }
}
