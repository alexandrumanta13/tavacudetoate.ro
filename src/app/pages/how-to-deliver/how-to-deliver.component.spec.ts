import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToDeliverComponent } from './how-to-deliver.component';

describe('HowToDeliverComponent', () => {
  let component: HowToDeliverComponent;
  let fixture: ComponentFixture<HowToDeliverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToDeliverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToDeliverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
