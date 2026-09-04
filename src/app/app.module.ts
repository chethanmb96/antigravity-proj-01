import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MemberTableComponent } from './components/member-table/member-table.component';
import { MemberFormComponent } from './components/member-form/member-form.component';

// ════════════════════════════════════════════════════════
// App Module — The Application's "Table of Contents"
// ════════════════════════════════════════════════════════
//
// Every Angular app has at least one NgModule.
// Think of it as a configuration file that says:
//   "These are my components, these are my dependencies."
//
// ❓ Why do you need to declare components here?
//   Angular doesn't auto-discover your files.
//   If you create a component but forget to declare it,
//   Angular will throw an error like:
//   "Can't bind to 'xyz' since it isn't a known element."
//
// ── @NgModule Sections ────────────────────────────────
//
// declarations:
//   → Your components, directives, and pipes.
//   → Think: "These are the UI pieces I own."
//
// imports:
//   → External modules this app needs.
//   → BrowserModule     → Required to run in a browser
//   → FormsModule       → Enables [(ngModel)] (template-driven forms)
//   → ReactiveFormsModule → Enables FormGroup, FormBuilder, etc.
//   → HttpClientModule  → Enables HTTP client services
//
// providers:
//   → Services (MemberService uses providedIn:'root',
//     so we don't need to list it here)
//
// bootstrap:
//   → The ROOT component to start with (index.html's <app-root>)

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MemberTableComponent,
    MemberFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,          // For [(ngModel)] in login form
    ReactiveFormsModule,  // For FormBuilder in employee form
    HttpClientModule     // Enables HTTP client services
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
