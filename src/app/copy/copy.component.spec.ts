import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CopyComponent } from './copy.component';

describe('CopyComponent', () => {
  it('renders its standalone page', async () => {
    await TestBed.configureTestingModule({ imports: [CopyComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(CopyComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')).toBeTruthy();
  });
});
