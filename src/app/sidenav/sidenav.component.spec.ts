import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SidenavComponent } from './sidenav.component';
import { LoginService } from '../servicios/login.service';
import { CartStateService } from '../core/cart-state.service';
describe('Public navigation', () => {
  it('closes the mobile menu and returns focus on Escape', async () => {
    await TestBed.configureTestingModule({ imports: [SidenavComponent], providers: [provideRouter([]), { provide: LoginService, useValue: { loggedIn: signal(false) } }, { provide: CartStateService, useValue: { count: signal(2) } }] }).compileComponents();
    const fixture = TestBed.createComponent(SidenavComponent); fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;
    button.click(); fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    fixture.nativeElement.querySelector('header').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('.cart-link').getAttribute('aria-label')).toContain('2');
  });
});
