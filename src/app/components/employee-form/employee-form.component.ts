import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';

// ════════════════════════════════════════════════════════
// Employee Form Component
// ════════════════════════════════════════════════════════
//
// This component is a MODAL DIALOG for both Add and Edit.
// It uses @Input and @Output to communicate with its parent.
//
// ❓ What are @Input and @Output?
//
//   @Input  = data flowing INTO this component (parent → child)
//   @Output = events flowing OUT of this component (child → parent)
//
// JS Analogy:
//   Like passing props and callbacks in vanilla JS:
//
//   // Parent passes data and a callback:
//   <EmployeeForm
//     employee={editingEmployee}          ← @Input
//     onSave={(data) => handleSave(data)} ← @Output (EventEmitter)
//   />
//
// ❓ What is Reactive Forms?
//   Instead of reading form values from the DOM manually
//   (document.getElementById('name').value),
//   Angular keeps a JavaScript object synchronized with
//   the form fields automatically.

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit, OnChanges {

  // ── @Input: Data flowing INTO this component ──────────
  // Parent passes the employee to edit (null = adding new)
  @Input() employeeToEdit: Employee | null = null;

  // ── @Output: Events flowing OUT to the parent ─────────
  // EventEmitter is like calling a callback function.
  // emit(data) = calling onSave(data) in the parent.
  @Output() save = new EventEmitter<Omit<Employee, 'id'> | Employee>();
  @Output() cancel = new EventEmitter<void>();

  // ── The Form Group ────────────────────────────────────
  // This object mirrors the HTML form.
  // fb.group() creates a FormGroup with FormControls inside.
  form!: FormGroup;

  // ── Computed Property: Are we editing? ────────────────
  get isEditing(): boolean {
    return this.employeeToEdit !== null;
  }

  // FormBuilder is injected via Dependency Injection.
  // JS Analogy: Angular is calling new FormBuilder() for you
  // and passing it to the constructor automatically.
  constructor(private fb: FormBuilder) {}

  // ngOnInit runs once after the component is created.
  // JS Analogy: componentDidMount, DOMContentLoaded
  ngOnInit(): void {
    this.buildForm();
  }

  // ngOnChanges runs whenever an @Input property changes.
  // JS Analogy: componentDidUpdate (React) or watching a prop
  // When parent changes employeeToEdit, we rebuild the form.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeToEdit'] && this.form) {
      this.buildForm();
    }
  }

  // ── Build / Reset the Form ────────────────────────────
  private buildForm(): void {
    // If editing, pre-fill with existing data. If adding, use empty defaults.
    const emp = this.employeeToEdit;

    this.form = this.fb.group({
      firstName: [emp?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName:  [emp?.lastName  || '', [Validators.required, Validators.minLength(2)]],
      email:     [emp?.email     || '', [Validators.required, Validators.email]],
      salary:    [emp?.salary    || '', [Validators.required, Validators.min(1)]],
      date:      [emp?.date      || new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  // ── Submit Handler ────────────────────────────────────
  // Called when form is submitted (via (ngSubmit) in template)
  onSubmit(): void {
    if (this.form.invalid) return;  // Guard: don't submit if invalid

    const formValue = this.form.value;

    if (this.isEditing && this.employeeToEdit) {
      // Editing: include the original ID
      this.save.emit({ ...formValue, id: this.employeeToEdit.id });
    } else {
      // Adding: no ID (service will generate one)
      this.save.emit(formValue);
    }
  }

  // ── Cancel Handler ────────────────────────────────────
  onCancel(): void {
    this.cancel.emit();  // Tell parent to close the modal
  }
}
