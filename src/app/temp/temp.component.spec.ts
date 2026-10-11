import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TempComponent } from './temp.component';

describe('TempComponent', () => {
  it('renders its standalone page', async () => {
    await TestBed.configureTestingModule({ imports: [TempComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(TempComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')).toBeTruthy();
  });
});
