import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentLocationComponent } from './add-incident-location.component';

describe('AddIncidentLocationComponent', () => {
  let component: AddIncidentLocationComponent;
  let fixture: ComponentFixture<AddIncidentLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
