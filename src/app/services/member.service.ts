import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Member } from '../models/member.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  getAll(): Observable<Member[]> {
    return from(
      this.supabase
        .from('employees')
        .select('*')
        .order('id', { ascending: true })
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }

          return (data || []).map((row: any) => this.mapMember(row));
        })
    );
  }

  add(memberData: Omit<Member, 'id'>): Observable<Member> {
    return from(
      this.supabase
        .from('employees')
        .insert(this.toSupabasePayload(memberData))
        .select('*')
        .single()
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }

          return this.mapMember(data);
        })
    );
  }

  update(updated: Member): Observable<Member> {
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

          return this.mapMember(data);
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

  private mapMember(row: any): Member {
    return {
      id: row.id,
      firstName: row.first_name ?? row.firstName,
      lastName: row.last_name ?? row.lastName,
      email: row.email,
      salary: row.salary,
      date: row.date
    };
  }

  private toSupabasePayload(member: Partial<Member>): Record<string, unknown> {
    return {
      first_name: member.firstName,
      last_name: member.lastName,
      email: member.email,
      salary: member.salary,
      date: member.date
    };
  }
}

// Alias for backwards compatibility
export { MemberService as EmployeeService };
