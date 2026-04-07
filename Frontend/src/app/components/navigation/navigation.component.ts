import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule],
  template: `
    <mat-toolbar color="primary" class="main-toolbar">
      <span class="logo" routerLink="/dashboard">TASK TRACKER <span class="enterprise">ENTERPRISE</span></span>
      
      <span class="spacer"></span>
      
      <div *ngIf="auth.currentUser() as user" class="user-controls">
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
          <mat-icon>account_circle</mat-icon>
          {{user.fullName}}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="auth.logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .main-toolbar {
      display: flex;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1000;
    }
    .logo {
      font-weight: 800;
      letter-spacing: 1px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .enterprise {
      font-size: 10px;
      background: white;
      color: #3f51b5;
      padding: 2px 6px;
      border-radius: 4px;
      vertical-align: middle;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .user-btn {
      font-weight: 500;
    }
  `]
})
export class NavigationComponent {
  constructor(public auth: AuthService) {}
}
