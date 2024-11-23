import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './state/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
  
})
export class AppComponent implements OnInit{
    constructor(private store: Store) {}

    ngOnInit() {
        // Check for a token in localStorage and dispatch an action to set the user as authenticated
        const token = localStorage.getItem('authToken');
        if (token) {
          // Dispatch a custom action with a placeholder message to set the user as logged in
          this.store.dispatch(AuthActions.loginSuccess({ 
            response: { 
              data: { 
                message: 'Token restored from localStorage',  // Placeholder message
                token: token,                                 // Token from localStorage
                user: null                                    // User info is unknown here, so set as null
              } 
            }
          }));
        }
      }
}
