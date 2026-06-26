import { Component } from '@angular/core';

// ════════════════════════════════════════════════════════
// App Component — Root Shell
// ════════════════════════════════════════════════════════
//
// This is the first component Angular renders.
// It acts as a "shell": it controls whether to show
// the Login screen or the main Employee table.
//
// The selector 'app-root' matches <app-root> in index.html.
// Angular bootstraps (starts) your app by rendering this
// component inside that <app-root> tag.

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // ── State ─────────────────────────────────────────────
  // isLoggedIn controls which screen is shown.
  // In Angular, a class property is like useState() in React.
  // When you change it, Angular re-renders the template.
  isLoggedIn = false;

  // ── Login Handler ──────────────────────────────────────
  // Called from the login form when user submits.
  onLogin(credentials: { username: string; password: string }): void {
    // Simplified auth: any non-empty credentials work.
    // In a real app, you'd call an API here.
    if (credentials.username.trim() && credentials.password.trim()) {
      this.isLoggedIn = true;
    }
  }

  // ── Logout Handler ─────────────────────────────────────
  onLogout(): void {
    this.isLoggedIn = false;
  }
}
