import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentTemplateDetailsLoaderComponent } from './incident-template-details-loader.component';

describe('IncidentTemplateDetailsLoaderComponent', () => {
  let component: IncidentTemplateDetailsLoaderComponent;
  let fixture: ComponentFixture<IncidentTemplateDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentTemplateDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentTemplateDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
