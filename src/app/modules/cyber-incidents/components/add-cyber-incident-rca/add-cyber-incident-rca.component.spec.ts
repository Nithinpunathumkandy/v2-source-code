import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCyberIncidentRcaComponent } from './add-cyber-incident-rca.component';

describe('AddCyberIncidentRcaComponent', () => {
  let component: AddCyberIncidentRcaComponent;
  let fixture: ComponentFixture<AddCyberIncidentRcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCyberIncidentRcaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCyberIncidentRcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
