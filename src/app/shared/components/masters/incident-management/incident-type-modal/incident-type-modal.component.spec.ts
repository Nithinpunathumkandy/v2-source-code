import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentTypeModalComponent } from './incident-type-modal.component';

describe('IncidentTypeModalComponent', () => {
  let component: IncidentTypeModalComponent;
  let fixture: ComponentFixture<IncidentTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
