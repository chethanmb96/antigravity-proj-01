import { Component, EventEmitter, Output } from '@angular/core';

// ════════════════════════════════════════════════════════
// Login Component
// ════════════════════════════════════════════════════════
//
// A simple login form. Uses Template-driven forms here
// (simpler for basic forms) instead of Reactive Forms.
//
// ❓ Template-driven vs Reactive Forms?
//
//   Template-driven:
//     → Form logic lives in the HTML template (ngModel)
//     → Good for simple forms
//     → Less TypeScript code
//
//   Reactive Forms:
//     → Form logic lives in the component class (FormGroup)
//     → Good for complex forms with dynamic fields
//     → More TypeScript code, more control
//
// We use Template-driven here (via #loginForm="ngForm")
// to show you both approaches across this app.

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // @Output: EventEmitter lets this component "talk back"
  // to its parent (AppComponent).
  // When the user logs in, we emit the credentials.
  // The parent listens with (login)="onLogin($event)".
  @Output() login = new EventEmitter<{ username: string; password: string }>();

  // These properties are bound to the form inputs via [(ngModel)]
  // ngModel is TWO-WAY binding: HTML ↔ TypeScript property
  // Changing the input updates the property, and vice versa.
  username = '';
  password = '';

  // Error message shown when login fails
  errorMessage = '';

  onSubmit(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }
    this.errorMessage = '';
    // Emit the credentials up to the parent component
    this.login.emit({ username: this.username, password: this.password });
  }
}
