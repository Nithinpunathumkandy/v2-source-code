import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentSubSectionComponent } from './add-incident-sub-section.component';

describe('AddIncidentSubSectionComponent', () => {
  let component: AddIncidentSubSectionComponent;
  let fixture: ComponentFixture<AddIncidentSubSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentSubSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentSubSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
