import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  showStubLogin = environment.enableStubLogin;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');

    if (!password || !passwordConfirm) {
      return null;
    }

    return password.value === passwordConfirm.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    const req = {
      username: this.registerForm.get('username')?.value ?? '',
      password: this.registerForm.get('password')?.value ?? '',
      passwordConfirm: this.registerForm.get('passwordConfirm')?.value ?? ''
    };

    // For now, show a message that registration endpoint is not yet available
    this.errorMessage = 'Registratie-endpoint is nog niet beschikbaar op de server. Gebruik de test-accounts voor nu.';
    this.isLoading = false;

    // TODO: Uncomment when BingoServer has /auth/register endpoint
    // this.authService.register(req).subscribe({
    //   next: () => {
    //     this.router.navigate(['/']);
    //   },
    //   error: (err) => {
    //     this.errorMessage = 'Registratie mislukt. Controleer je gegevens.';
    //     this.isLoading = false;
    //     console.error('Registration error:', err);
    //   }
    // });
  }

  /**
   * Temporary: stub login for offline development.
   */
  stubLogin(username: string): void {
    this.authService.stubLogin(username);
    this.router.navigate(['/']);
  }

  /**
   * Check if password fields have error for form-level validator
   */
  get passwordsMatch(): boolean {
    return !this.registerForm.hasError('passwordMismatch');
  }
}

