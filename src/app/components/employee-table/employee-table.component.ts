import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

// ════════════════════════════════════════════════════════
// Employee Table Component (Asynchronous Subscription Version)
// ════════════════════════════════════════════════════════
//
// This component has been updated to handle asynchronous data
// streams using RxJS Observables.
//
// ❓ How does subscription work here?
//   Instead of assigning the result of a method directly:
//     this.employees = this.employeeService.getAll(); // (Sync)
//   We subscribe to the stream:
//     this.employeeService.getAll().subscribe(data => this.employees = data); // (Async)
//
// ❓ Why is it like this?
//   Network requests take time. Subscribing tells Angular:
//   "When the data eventually arrives from the API, run this callback
//   function to update the UI."
//
// React/JS Analogy:
//   Similar to:
//     fetch('/api/employees')
//       .then(res => res.json())
//       .then(data => setEmployees(data))

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit {

  // ── Component State ─────────────────────────────────────
  employees: Employee[] = [];              // Array of employees loaded from API
  showModal = false;                       // Controls visibility of the Add/Edit modal
  employeeToEdit: Employee | null = null;  // The employee model to edit (null = Add mode)
  
  // Loading state to show a spinner/message during API requests
  isLoading = false;

  constructor(private employeeService: EmployeeService) {}

  // ── Lifecycle Hook ────────────────────────────────────
  ngOnInit(): void {
    this.loadEmployees();
  }

  // ── Load Employees (GET) ───────────────────────────────
  // Subscribes to the getAll() Observable.
  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load employees:', err);
        this.isLoading = false;
      }
    });
  }

  // ── Open "Add New" Modal ──────────────────────────────
  openAddModal(): void {
    this.employeeToEdit = null;
    this.showModal = true;
  }

  // ── Open "Edit" Modal ─────────────────────────────────
  openEditModal(employee: Employee): void {
    this.employeeToEdit = { ...employee };
    this.showModal = true;
  }

  // ── Close Modal ───────────────────────────────────────
  closeModal(): void {
    this.showModal = false;
    this.employeeToEdit = null;
  }

  // ── Handle Save (Add or Update) ───────────────────────
  // Called when the child form emits the (save) event.
  // Handles the asynchronous response and reloads the table.
  onSave(data: Omit<Employee, 'id'> | Employee): void {
    this.isLoading = true;
    
    if ('id' in data) {
      // Has an ID → Update existing (PUT)
      this.employeeService.update(data as Employee).subscribe({
        next: () => {
          this.loadEmployees();  // Refresh the table
          this.closeModal();     // Close the modal dialog
        },
        error: (err) => {
          console.error('Failed to update employee:', err);
          this.isLoading = false;
        }
      });
    } else {
      // No ID → Add new (POST)
      this.employeeService.add(data).subscribe({
        next: () => {
          this.loadEmployees();  // Refresh the table
          this.closeModal();     // Close the modal dialog
        },
        error: (err) => {
          console.error('Failed to add employee:', err);
          this.isLoading = false;
        }
      });
    }
  }

  // ── Handle Delete (DELETE) ─────────────────────────────
  // Asks for confirmation, then calls the delete service.
  onDelete(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.isLoading = true;
      this.employeeService.delete(employee.id).subscribe({
        next: () => {
          this.loadEmployees();  // Refresh the table
        },
        error: (err) => {
          console.error('Failed to delete employee:', err);
          this.isLoading = false;
        }
      });
    }
  }
}
