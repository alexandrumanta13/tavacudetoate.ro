import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductQuickviewComponent } from './product-quickview.component';

describe('ProductQuickviewComponent', () => {
  let component: ProductQuickviewComponent;
  let fixture: ComponentFixture<ProductQuickviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductQuickviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductQuickviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
