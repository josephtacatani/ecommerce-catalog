import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from 'src/app/core/user.model';
import { selectError, selectLoading, selectSuccessMessage, selectUsers } from 'src/app/state/users/users.reducer';
import * as UserActions from '../../../state/users/users.actions';
import { UserFormComponent } from './user-form/user-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,  // Import MatTableModule for displaying tables
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule
  ],
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  message$: Observable<string | null>;

  searchControl: FormControl = new FormControl('');
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = ['user_img','first_name', 'last_name', 'username', 'contact_number', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: Store, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.users$ = this.store.select(selectUsers);
    this.isLoading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.message$ = this.store.select(selectSuccessMessage);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUsers());

    

    // Load users and set them in the data source
    this.users$.subscribe(users => {
      console.log(users);
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;  // Connect paginator to table data
    });

    // Filter the table when the search control changes
    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });

    this.message$.subscribe(message => {
      if (message) {
        this.showSnackbar(message);
      }
    });
  }

  openAddUserModal(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Dispatching createUser action with data:", result);
        this.store.dispatch(UserActions.createUser({ userData: result }));
      }

      else{
        console.log("Dispatching createUser action with data:", result);
      }
    });
  }

    // Open modal to edit an existing user
    openEditUserModal(user: User): void {
      const dialogRef = this.dialog.open(UserFormComponent, {
        width: '600px',
        data: user  // Pass user data to pre-fill the form
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(UserActions.updateUser({ userId: user.user_id, userData: result }));
        }
      });
    }

  onDeleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.store.dispatch(UserActions.deleteUser({ userId }));
    }
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
}
