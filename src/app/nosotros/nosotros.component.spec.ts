import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NosotrosComponent } from './nosotros.component';

describe('NosotrosComponent', () => {
  it('renders its standalone page', async () => {
    await TestBed.configureTestingModule({ imports: [NosotrosComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(NosotrosComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')).toBeTruthy();
  });
});
