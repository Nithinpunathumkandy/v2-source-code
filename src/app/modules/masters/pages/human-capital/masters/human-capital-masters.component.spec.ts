import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanCapitalMastersComponent } from './human-capital-masters.component';

describe('HumanCapitalMastersComponent', () => {
  let component: HumanCapitalMastersComponent;
  let fixture: ComponentFixture<HumanCapitalMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanCapitalMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanCapitalMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
