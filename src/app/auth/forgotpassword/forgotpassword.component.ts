import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { AuthActions } from '../../state/auth/auth.actions';
import { selectChangePasswordFailure, selectChangePasswordMessage, selectErrorMessage, selectIsAuthenticated, selectVerificationFailureMessage, selectVerificationOTP, selectVerificationSuccessMessage } from '../../state/auth/auth.reducer';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthRequestInterface, ChangePasswordRequestInterface, ForgotPasswordRequestInterface } from 'src/app/core/auth.model';
import { Router, RouterModule } from '@angular/router';
import { selectSuccessMessage } from 'src/app/state/users/users.reducer';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  otpLoginForm: FormGroup;

  errorMessage$: Observable<string | null>; // Observable for error message
  otp$: Observable<string | null>;
  messageSuccess$: Observable<string | null>;
  changePasswordMessage$: Observable<string | null>;
  changePasswordFailure$: Observable<string | null>

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
   
  ) {
    // Use the `selectErrorMessage` selector to access error message from the store
    this.errorMessage$ = this.store.select(selectVerificationFailureMessage);
    this.messageSuccess$ = this.store.select(selectVerificationSuccessMessage);
    this.otp$ = this.store.select(selectVerificationOTP);
    this.changePasswordMessage$ = this.store.select(selectChangePasswordMessage);
    this.changePasswordFailure$ = this.store.select(selectChangePasswordFailure);

    // Initialize the form group with controls for username and password
    this.loginForm = this.fb.group({
      username: ['', Validators.required]
    });

    this.otpLoginForm = this.fb.group({
        newPassword: ['', Validators.required],
        otp: ['']
        
    });



  }

  ngOnInit(): void {
      this.otp$.subscribe((otp)=>{
        if(otp){
            this.otpLoginForm.patchValue({otp})
        }
      })
  }

  // Dispatch login action on form submission
  verifyOTP() {
    if (this.loginForm.valid) {
      const data: ForgotPasswordRequestInterface = this.loginForm.value;
      this.store.dispatch(AuthActions.verifyUsername({ data }));
    }
  }

  changePassword(){
    if (this.otpLoginForm.valid){
        const data: ChangePasswordRequestInterface = this.otpLoginForm.value;
        console.log('datas',data);
        this.store.dispatch(AuthActions.changePassword({data}))
    }
  }



}
