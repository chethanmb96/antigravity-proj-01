import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Member } from '../../models/member.model';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit, OnChanges {

  @Input() memberToEdit: Member | null = null;
  @Input() set employeeToEdit(val: Member | null) {
    this.memberToEdit = val;
  }
  get employeeToEdit(): Member | null {
    return this.memberToEdit;
  }

  @Output() save = new EventEmitter<Omit<Member, 'id'> | Member>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  get isEditing(): boolean {
    return this.memberToEdit !== null;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['memberToEdit'] || changes['employeeToEdit']) && this.form) {
      this.buildForm();
    }
  }

  private buildForm(): void {
    const mem = this.memberToEdit;

    this.form = this.fb.group({
      firstName: [mem?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName:  [mem?.lastName  || '', [Validators.required, Validators.minLength(2)]],
      email:     [mem?.email     || '', [Validators.required, Validators.email]],
      salary:    [mem?.salary    || '', [Validators.required, Validators.min(1)]],
      date:      [mem?.date      || new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.isEditing && this.memberToEdit) {
      this.save.emit({ ...formValue, id: this.memberToEdit.id });
    } else {
      this.save.emit(formValue);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

// Alias for backwards compatibility
export { MemberFormComponent as EmployeeFormComponent };
