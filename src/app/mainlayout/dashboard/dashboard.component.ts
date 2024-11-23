import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/state/auth/auth.actions';
import { selectLoggedusers } from 'src/app/state/users/users.reducer';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/user.model';
import * as UserActions from '../../state/users/users.actions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterModule, // Import RouterModule for navigation
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    loggeduser$: Observable<User | null>;

    constructor(private store: Store){
      this.loggeduser$ = this.store.select(selectLoggedusers);
      this.loggeduser$.subscribe((user) => {
        if (user) {
          // Store the User object in local storage
          localStorage.setItem('loggedUser', JSON.stringify(user))
        } else {
          // Optionally remove the User object from local storage if not logged in
          localStorage.removeItem('loggedUser');
        }
      });
    }


    ngOnInit(): void {
      this.store.dispatch(UserActions.loadLoggedUser())
    }
  

  logout(){
    this.store.dispatch(AuthActions.logout())
  }

}
