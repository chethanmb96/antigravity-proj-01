# Angular Employee CRUD — Learning Guide

> **Who this is for:** You know JavaScript. You're new to Angular.
> This guide explains every Angular concept used in this app with JS analogies.

---

## How This App Is Structured

```
employee-crud/src/app/
│
├── models/
│   └── employee.model.ts        ← TypeScript interface (data shape)
│
├── services/
│   └── employee.service.ts      ← Business logic + data storage
│
├── components/
│   ├── login/                   ← Login form (template-driven forms)
│   ├── employee-table/          ← Main table (displays data, buttons)
│   └── employee-form/           ← Add/Edit modal (reactive forms)
│
├── app.component.*              ← Root shell (login gate)
└── app.module.ts                ← Registration center
```

---

## Concept 1: NgModule — The Registration Center

**File:** [`app.module.ts`](./src/app/app.module.ts)

In Angular, NOTHING works unless it's registered. The `@NgModule` is your app's manifest.

```typescript
@NgModule({
  declarations: [          // Your components & pipes
    AppComponent,
    LoginComponent,
    EmployeeTableComponent,
    EmployeeFormComponent,
  ],
  imports: [               // External modules you need
    BrowserModule,         // → Must have (runs in browser)
    FormsModule,           // → Enables [(ngModel)]
    ReactiveFormsModule,   // → Enables FormGroup, FormBuilder
  ],
  bootstrap: [AppComponent]  // → First component to render
})
export class AppModule { }
```

**JS Analogy:** Think of it like a `manifest.json` in a browser extension, or the top-level `import` section of your entire app combined into one place.

---

## Concept 2: Components — The Building Blocks

**Files:** All files ending in `.component.ts`

A Component = TypeScript class + HTML template + CSS styles.

```typescript
@Component({
  selector: 'app-employee-table',      // ← Use as <app-employee-table>
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit {
  employees: Employee[] = [];  // ← This is "state"

  ngOnInit(): void {           // ← Runs once when component is ready
    this.loadEmployees();
  }
}
```

**JS Analogy:** Like a Web Component / Custom Element. The class holds the logic, and Angular renders the template automatically when state changes.

---

## Concept 3: Services & Dependency Injection

**File:** [`employee.service.ts`](./src/app/services/employee.service.ts)

A Service holds business logic (CRUD operations). Angular creates one instance and shares it everywhere — this is **Dependency Injection**.

```typescript
@Injectable({ providedIn: 'root' })  // Singleton — shared app-wide
export class EmployeeService {
  private employees: Employee[] = [];

  getAll(): Employee[] { return [...this.employees]; }
  add(emp): Employee   { /* ... */ }
  update(emp): boolean { /* ... */ }
  delete(id): boolean  { /* ... */ }
}
```

**Using it in a component:**
```typescript
constructor(private employeeService: EmployeeService) {}
// Angular automatically provides the EmployeeService instance ↑
```

**JS Analogy:** Like importing a module that has ONE shared instance:
```javascript
// employees.js (singleton module)
let employees = [];
export const getAll = () => [...employees];
export const add = (emp) => employees.push(emp);
```

---

## Concept 4: Template Syntax

| Angular Syntax | What it does | JS Equivalent |
|---|---|---|
| `{{ name }}` | Display a value | `element.textContent = name` |
| `[value]="data"` | Set a property (one-way in) | `element.value = data` |
| `(click)="fn()"` | Handle an event (one-way out) | `addEventListener('click', fn)` |
| `[(ngModel)]="x"` | Two-way binding | Set + listen simultaneously |
| `*ngFor="let x of xs"` | Loop | `xs.forEach(x => ...)` |
| `*ngIf="condition"` | Show/hide | `if (condition) { render }` |
| `[class.red]="bool"` | Conditional CSS class | `el.classList.toggle('red', bool)` |

---

## Concept 5: Two Types of Forms

### Template-Driven (Login Form)
Logic lives in the HTML template. Uses `[(ngModel)]`.

```html
<input name="email" [(ngModel)]="email" required />
```

Good for: simple forms, less code.

### Reactive Forms (Employee Form)
Logic lives in the TypeScript class. Uses `FormGroup`.

```typescript
this.form = this.fb.group({
  firstName: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
});
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="firstName" />
</form>
```

Good for: complex forms, dynamic fields, programmatic control.

---

## Concept 6: @Input and @Output — Component Communication

**File:** [`employee-form.component.ts`](./src/app/components/employee-form/employee-form.component.ts)

Components communicate through `@Input` (parent → child) and `@Output` (child → parent).

```typescript
// EmployeeFormComponent (CHILD)
@Input() employeeToEdit: Employee | null = null;   // Receives data
@Output() save = new EventEmitter<Employee>();       // Sends data out
@Output() cancel = new EventEmitter<void>();
```

```html
<!-- EmployeeTableComponent template (PARENT) -->
<app-employee-form
  [employeeToEdit]="selectedEmployee"    ← @Input: pass data in
  (save)="onSave($event)"               ← @Output: listen for events
  (cancel)="closeModal()"               ← @Output: listen for events
></app-employee-form>
```

**JS Analogy:**
```javascript
// Passing data and callbacks as "props" in vanilla JS
function renderForm({ employee, onSave, onCancel }) { ... }
renderForm({
  employee: selectedEmployee,
  onSave: (data) => handleSave(data),
  onCancel: () => closeModal()
});
```

---

## Data Flow Diagram

```
AppComponent (isLoggedIn state)
│
├── LoginComponent
│     (login) EventEmitter → AppComponent.onLogin()
│
└── EmployeeTableComponent
      employees: Employee[]
      showModal: boolean
      │
      └── EmployeeFormComponent (shown when showModal = true)
            [employeeToEdit] @Input ← from table
            (save)  @Output  →      table.onSave()
            (cancel)@Output  →      table.closeModal()
                    ↓
              EmployeeService.add() / .update()
                    ↓
              localStorage (persisted)
```

---

## The CRUD Flow

### Create
1. Click **Add Employee** → `openAddModal()` → `showModal = true`
2. `<app-employee-form>` appears with empty form
3. User fills form, submits → child emits `(save)` with form data
4. Parent calls `employeeService.add(data)` → saved to localStorage
5. `loadEmployees()` → table refreshes

### Read
- `ngOnInit()` → `loadEmployees()` → `employeeService.getAll()` → table renders

### Update
1. Click **Edit** → `openEditModal(employee)` → passes employee to form
2. Form pre-fills via `patchValue()` (Reactive Forms)
3. User edits, submits → child emits with updated data (includes `id`)
4. Parent calls `employeeService.update(data)`

### Delete
1. Click **Delete** → `onDelete(employee)` → `confirm()` dialog
2. `employeeService.delete(employee.id)` → removes from array + localStorage

---

## Run the App

```bash
cd C:\Users\cheth\.gemini\antigravity-ide\scratch\employee-crud
ng serve
# Open http://localhost:4200
# Login with any username and password
```

---

## Key Files to Study (in order)

1. [`employee.model.ts`](./src/app/models/employee.model.ts) — Start here (just a TypeScript interface)
2. [`employee.service.ts`](./src/app/services/employee.service.ts) — The data layer
3. [`app.module.ts`](./src/app/app.module.ts) — Understand the registration
4. [`login.component.*`](./src/app/components/login/) — Template-driven forms + @Output
5. [`employee-table.component.*`](./src/app/components/employee-table/) — *ngFor, event handling
6. [`employee-form.component.*`](./src/app/components/employee-form/) — Reactive Forms + @Input/@Output
7. [`app.component.*`](./src/app/app.component.*) — Root shell + *ngIf

Happy coding! 🚀
