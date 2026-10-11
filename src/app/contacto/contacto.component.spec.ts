import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContactoComponent } from './contacto.component';

describe('ContactoComponent', () => {
  it('renders its standalone page', async () => {
    await TestBed.configureTestingModule({ imports: [ContactoComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(ContactoComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')).toBeTruthy();
  });
});
