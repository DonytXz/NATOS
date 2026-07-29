import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarimasComponent } from './tarimas.component';

describe('TarimasComponent', () => {
  let component: TarimasComponent;
  let fixture: ComponentFixture<TarimasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarimasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarimasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
