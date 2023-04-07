import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentPreviewModalComponent } from './incident-preview-modal.component';

describe('IncidentPreviewModalComponent', () => {
  let component: IncidentPreviewModalComponent;
  let fixture: ComponentFixture<IncidentPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentPreviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
