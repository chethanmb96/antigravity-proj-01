import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Employee } from '../models/employee.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  getAll(): Observable<Employee[]> {
    return from(
      this.supabase
        .from('employees')
        .select('*')
        .order('id', { ascending: true })
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }

          return (data || []).map((row: any) => this.mapEmployee(row));
        })
    );
  }

  add(employeeData: Omit<Employee, 'id'>): Observable<Employee> {
    return from(
      this.supabase
        .from('employees')
        .insert(this.toSupabasePayload(employeeData))
        .select('*')
        .single()
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }

          return this.mapEmployee(data);
        })
    );
  }

  update(updated: Employee): Observable<Employee> {
    return from(
      this.supabase
        .from('employees')
        .update(this.toSupabasePayload(updated))
        .eq('id', updated.id)
        .select('*')
        .single()
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }

          return this.mapEmployee(data);
        })
    );
  }

  delete(id: number): Observable<void> {
    return from(
      this.supabase
        .from('employees')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            throw error;
          }
        })
    );
  }

  private mapEmployee(row: any): Employee {
    return {
      id: row.id,
      firstName: row.first_name ?? row.firstName,
      lastName: row.last_name ?? row.lastName,
      email: row.email,
      salary: row.salary,
      date: row.date
    };
  }

  private toSupabasePayload(employee: Partial<Employee>): Record<string, unknown> {
    return {
      first_name: employee.firstName,
      last_name: employee.lastName,
      email: employee.email,
      salary: employee.salary,
      date: employee.date
    };
  }
}
