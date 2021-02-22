import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandyBarComponent } from './candy-bar.component';

describe('CandyBarComponent', () => {
  let component: CandyBarComponent;
  let fixture: ComponentFixture<CandyBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandyBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandyBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
