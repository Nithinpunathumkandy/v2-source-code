import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCyberIncidentClassificationModalComponent } from './add-cyber-incident-classification-modal.component';

describe('AddCyberIncidentClassificationModalComponent', () => {
  let component: AddCyberIncidentClassificationModalComponent;
  let fixture: ComponentFixture<AddCyberIncidentClassificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCyberIncidentClassificationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCyberIncidentClassificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
