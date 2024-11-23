import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../state/auth/auth.actions';
import { selectRegisterSuccessMessage, selectRegisterError, selectIsSubmitting } from '../../state/auth/auth.reducer';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerSuccessMessage$: Observable<string | null>;
  registerError$: Observable<string | null>;
  isSubmitting$: Observable<boolean>;

  constructor(private fb: FormBuilder, private store: Store) {
    // Initialize form controls with validation
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact_number: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      address: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      access_level: ['admin', Validators.required],
    });

    // Selectors to retrieve registration status and messages from the store
    this.registerSuccessMessage$ = this.store.select(selectRegisterSuccessMessage);
    this.registerError$ = this.store.select(selectRegisterError);
    this.isSubmitting$ = this.store.select(selectIsSubmitting);
  }

  // Method to handle registration form submission
  onRegister() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.store.dispatch(AuthActions.register({ data: formData }));
    }
  }
}
