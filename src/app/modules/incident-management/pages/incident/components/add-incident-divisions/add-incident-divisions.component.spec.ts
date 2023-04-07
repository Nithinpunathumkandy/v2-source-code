import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentDivisionsComponent } from './add-incident-divisions.component';

describe('AddIncidentDivisionsComponent', () => {
  let component: AddIncidentDivisionsComponent;
  let fixture: ComponentFixture<AddIncidentDivisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentDivisionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentDivisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
