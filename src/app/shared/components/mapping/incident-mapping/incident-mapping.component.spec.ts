import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentMappingComponent } from './incident-mapping.component';

describe('IncidentMappingComponent', () => {
  let component: IncidentMappingComponent;
  let fixture: ComponentFixture<IncidentMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
