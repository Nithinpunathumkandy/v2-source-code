import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCyberIncidentIaModalComponent } from './add-cyber-incident-ia-modal.component';

describe('AddCyberIncidentIaModalComponent', () => {
  let component: AddCyberIncidentIaModalComponent;
  let fixture: ComponentFixture<AddCyberIncidentIaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCyberIncidentIaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCyberIncidentIaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
