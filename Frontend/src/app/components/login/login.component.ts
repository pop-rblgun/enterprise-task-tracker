import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTabsModule],
  template: `
    <div class="login-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Task Tracker Enterprise</mat-card-title>
          <mat-card-subtitle>Manage your projects professionally</mat-card-subtitle>
        </mat-card-header>
        
        <mat-tab-group>
          <mat-tab label="Login">
            <form (submit)="onLogin()" class="auth-form">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" name="email" [(ngModel)]="loginData.email" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput type="password" name="password" [(ngModel)]="loginData.password" required>
              </mat-form-field>
              
              <button mat-raised-button color="primary" type="submit">LOGIN</button>
            </form>
          </mat-tab>
          
          <mat-tab label="Register">
            <form (submit)="onRegister()" class="auth-form">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput name="fullName" [(ngModel)]="registerData.fullName" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" name="reg-email" [(ngModel)]="registerData.email" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput type="password" name="reg-password" [(ngModel)]="registerData.password" required>
              </mat-form-field>
              
              <button mat-raised-button color="accent" type="submit">REGISTER</button>
            </form>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: radial-gradient(circle at top left, #ffffff, #f5f5f7);
    }
    .auth-card {
      width: 400px;
      padding: 32px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    }
    mat-card-title {
      font-weight: 700 !important;
      font-size: 1.5rem !important;
      letter-spacing: -0.03em;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 24px 0 0 0;
    }
    ::ng-deep .mat-mdc-tab-label-container {
      background: transparent !important;
    }
    ::ng-deep .mat-mdc-tab-header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    ::ng-deep .mdc-tab__text-label {
      color: #86868b !important;
      font-weight: 500;
    }
    ::ng-deep .mdc-tab--active .mdc-tab__text-label {
      color: #1d1d1f !important;
      font-weight: 600;
    }
    ::ng-deep .mdc-button {
      border-radius: 10px !important;
      padding: 24px 0 !important;
      font-weight: 600 !important;
      letter-spacing: -0.01em;
    }
    ::ng-deep .mat-mdc-unelevated-button, ::ng-deep .mat-mdc-raised-button {
      background-color: var(--primary-color) !important;
      color: white !important;
      box-shadow: 0 4px 14px rgba(0, 113, 227, 0.3) !important;
      transition: all 0.2s cubic-bezier(0.1, 0.7, 0.1, 1);
    }
    ::ng-deep .mat-mdc-unelevated-button:hover, ::ng-deep .mat-mdc-raised-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 113, 227, 0.4) !important;
    }
    ::ng-deep .mdc-text-field--outlined {
      --mdc-outlined-text-field-container-shape: 10px;
    }
  `]
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  registerData = { email: '', password: '', fullName: '' };

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login(this.loginData).subscribe(() => this.router.navigate(['/dashboard']));
  }

  onRegister() {
    this.auth.register(this.registerData).subscribe(() => this.router.navigate(['/dashboard']));
  }
}
