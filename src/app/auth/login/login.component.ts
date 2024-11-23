import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { AuthActions } from '../../state/auth/auth.actions';
import { selectErrorMessage, selectIsAuthenticated } from '../../state/auth/auth.reducer';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthRequestInterface } from 'src/app/core/auth.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,           // For using reactive forms
    MatCardModule,                 // For card layout
    MatFormFieldModule,            // For form fields
    MatInputModule,                // For input fields
    MatButtonModule,               // For buttons
    MatIconModule,                 // For icons, if needed
    MatProgressSpinnerModule,       // For showing loading spinner, if desired
    RouterModule

  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage$: Observable<string | null>; // Observable for error message

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize the form group with controls for username and password
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Use the `selectErrorMessage` selector to access error message from the store
    this.errorMessage$ = this.store.select(selectErrorMessage);
  }

  // Dispatch login action on form submission
  onLogin() {
    if (this.loginForm.valid) {
      const credentials: AuthRequestInterface = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ credentials }));
    }
  }

  ngOnInit() {
    this.store.select(selectIsAuthenticated).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/']); // Redirect to the dashboard route after login
      }
    });
  }
}
