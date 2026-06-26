import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

// ════════════════════════════════════════════════════════
// Employee Service (HTTP & RxJS Observables Version)
// ════════════════════════════════════════════════════════
//
// We have upgraded this service to make real HTTP requests using
// Angular's HttpClient. Instead of synchronous operations,
// every method now returns an RxJS Observable.
//
// ❓ What is an Observable?
//   An Observable is a representation of a stream of data that arrives
//   asynchronously. You can think of it like a "lazy Promise" that can
//   emit multiple values over time (though HTTP requests only emit once).
//
// ❓ How does it compare to Promises?
//   - Promises: Run immediately upon creation, cannot be cancelled,
//     and always return a single value.
//   - Observables: Do NOT run until you .subscribe() to them (lazy),
//     can be cancelled (unsubscribed), and offer powerful operators
//     (like map, filter, debounceTime) via RxJS.
//
// React/JS Analogy:
//   In React, you might use:
//     const response = await fetch('/api/employees');
//     const data = await response.json();
//   In Angular, we return an Observable and the component subscribes to it.

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  // The base URL for our local JSON REST API server
  private apiUrl = 'http://localhost:3000/employees';

  // HTTP Options (Headers)
  // Used to tell the server we are sending JSON data in POST and PUT requests.
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // ── Dependency Injection ───────────────────────────────
  // We inject Angular's HttpClient service here.
  // Angular automatically provides this because we imported HttpClientModule.
  constructor(private http: HttpClient) {}

  // ── Get All Employees (GET) ────────────────────────────
  // Sends a GET request to 'api/employees'.
  // Returns an Observable emitting the array of employees.
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  // ── Add New Employee (POST) ─────────────────────────────
  // Sends a POST request to 'api/employees' with the employee payload.
  // The server (InMemoryDataService) automatically assigns a new ID.
  // Returns an Observable emitting the created employee object (with ID).
  add(employeeData: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employeeData, this.httpOptions);
  }

  // ── Update Employee (PUT) ──────────────────────────────
  // Sends a PUT request to 'api/employees' with the updated employee object.
  // By REST standards, the server matches the record by ID.
  // Returns an Observable emitting the response.
  update(updated: Employee): Observable<any> {
    return this.http.put(this.apiUrl, updated, this.httpOptions);
  }

  // ── Delete Employee (DELETE) ───────────────────────────
  // Sends a DELETE request to 'api/employees/:id'.
  // Returns an Observable emitting the response.
  delete(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions);
  }
}
