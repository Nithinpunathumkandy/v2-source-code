import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentTemplateDetailsComponent } from './incident-template-details.component';

describe('IncidentTemplateDetailsComponent', () => {
  let component: IncidentTemplateDetailsComponent;
  let fixture: ComponentFixture<IncidentTemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentTemplateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
