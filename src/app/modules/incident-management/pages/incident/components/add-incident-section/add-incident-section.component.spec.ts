import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentSectionComponent } from './add-incident-section.component';

describe('AddIncidentSectionComponent', () => {
  let component: AddIncidentSectionComponent;
  let fixture: ComponentFixture<AddIncidentSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
