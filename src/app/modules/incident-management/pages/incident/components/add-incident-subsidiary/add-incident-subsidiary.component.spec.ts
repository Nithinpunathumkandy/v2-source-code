import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentSubsidiaryComponent } from './add-incident-subsidiary.component';

describe('AddIncidentSubsidiaryComponent', () => {
  let component: AddIncidentSubsidiaryComponent;
  let fixture: ComponentFixture<AddIncidentSubsidiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentSubsidiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
