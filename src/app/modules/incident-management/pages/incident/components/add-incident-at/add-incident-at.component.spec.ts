import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentAtComponent } from './add-incident-at.component';

describe('AddIncidentAtComponent', () => {
  let component: AddIncidentAtComponent;
  let fixture: ComponentFixture<AddIncidentAtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentAtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentAtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
