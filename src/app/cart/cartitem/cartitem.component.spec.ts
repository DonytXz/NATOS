import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CartitemComponent } from './cartitem.component';

describe('CartitemComponent', () => {
  let component: CartitemComponent;
  let fixture: ComponentFixture<CartitemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ CartitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartitemComponent);
    component = fixture.componentInstance;
    component.cartItem = {
      id: 1,
      name: 'Test item',
      quantity: 1,
      price: 1,
      total: 1
    };
    vi.spyOn(window, 'prompt').mockReturnValue('test@example.com');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
