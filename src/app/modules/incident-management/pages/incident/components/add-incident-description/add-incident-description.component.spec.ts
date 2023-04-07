import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentDescriptionComponent } from './add-incident-description.component';

describe('AddIncidentDescriptionComponent', () => {
  let component: AddIncidentDescriptionComponent;
  let fixture: ComponentFixture<AddIncidentDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
