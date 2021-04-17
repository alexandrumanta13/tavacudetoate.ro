import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EasterComponent } from './easter.component';

describe('EasterComponent', () => {
  let component: EasterComponent;
  let fixture: ComponentFixture<EasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
