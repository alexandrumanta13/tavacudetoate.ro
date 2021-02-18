import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDiscountComponent } from './popup-discount.component';

describe('PopupDiscountComponent', () => {
  let component: PopupDiscountComponent;
  let fixture: ComponentFixture<PopupDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
