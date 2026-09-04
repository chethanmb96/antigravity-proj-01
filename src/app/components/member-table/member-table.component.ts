import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member.model';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-member-table',
  templateUrl: './member-table.component.html',
  styleUrls: ['./member-table.component.css']
})
export class MemberTableComponent implements OnInit {

  // ── Component State ─────────────────────────────────────
  members: Member[] = [];
  showModal = false;
  memberToEdit: Member | null = null;
  isLoading = false;

  // Backwards compatibility getter/setters
  get employees(): Member[] {
    return this.members;
  }
  set employees(val: Member[]) {
    this.members = val;
  }
  get employeeToEdit(): Member | null {
    return this.memberToEdit;
  }
  set employeeToEdit(val: Member | null) {
    this.memberToEdit = val;
  }

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  // ── Load Members (GET) ───────────────────────────────
  loadMembers(): void {
    this.isLoading = true;
    this.memberService.getAll().subscribe({
      next: (data) => {
        this.members = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load members:', err);
        this.isLoading = false;
      }
    });
  }

  // Backwards compatibility method
  loadEmployees(): void {
    this.loadMembers();
  }

  // ── Open "Add New" Modal ──────────────────────────────
  openAddModal(): void {
    this.memberToEdit = null;
    this.showModal = true;
  }

  // ── Open "Edit" Modal ─────────────────────────────────
  openEditModal(member: Member): void {
    this.memberToEdit = { ...member };
    this.showModal = true;
  }

  // ── Close Modal ───────────────────────────────────────
  closeModal(): void {
    this.showModal = false;
    this.memberToEdit = null;
  }

  // ── Handle Save (Add or Update) ───────────────────────
  onSave(data: Omit<Member, 'id'> | Member): void {
    this.isLoading = true;

    if ('id' in data) {
      this.memberService.update(data as Member).subscribe({
        next: () => {
          this.loadMembers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to update member:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.memberService.add(data).subscribe({
        next: () => {
          this.loadMembers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to add member:', err);
          this.isLoading = false;
        }
      });
    }
  }

  // ── Handle Delete (DELETE) ─────────────────────────────
  onDelete(member: Member): void {
    if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
      this.isLoading = true;
      this.memberService.delete(member.id).subscribe({
        next: () => {
          this.loadMembers();
        },
        error: (err) => {
          console.error('Failed to delete member:', err);
          this.isLoading = false;
        }
      });
    }
  }
}

// Alias for backwards compatibility
export { MemberTableComponent as EmployeeTableComponent };
