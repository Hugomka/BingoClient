import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'stubLogin',
      'isLoggedIn',
      'logout'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(true);
  });

  it('should enable submit button when form is valid', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(false);
  });

  it('should call authService.login on form submit', () => {
    authService.login.and.returnValue(of(void 0));
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    });
  });

  it('should navigate to / on successful login', () => {
    authService.login.and.returnValue(of(void 0));
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error message on login failure', () => {
    const error = new Error('Login failed');
    authService.login.and.returnValue(throwError(() => error));
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'wrongpassword'
    });
    component.onSubmit();
    expect(component.errorMessage).toBe(
      'Login failed. Please check your credentials.'
    );
  });

  it('should call authService.stubLogin on stub button click', () => {
    component.stubLogin('TestUser');
    expect(authService.stubLogin).toHaveBeenCalledWith('TestUser');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});

