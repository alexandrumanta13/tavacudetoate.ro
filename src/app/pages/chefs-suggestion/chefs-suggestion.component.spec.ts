import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefsSuggestionComponent } from './chefs-suggestion.component';

describe('ChefsSuggestionComponent', () => {
  let component: ChefsSuggestionComponent;
  let fixture: ComponentFixture<ChefsSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChefsSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChefsSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
