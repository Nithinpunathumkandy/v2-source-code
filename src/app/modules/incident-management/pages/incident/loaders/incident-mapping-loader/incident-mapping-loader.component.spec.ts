import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentMappingLoaderComponent } from './incident-mapping-loader.component';

describe('IncidentMappingLoaderComponent', () => {
  let component: IncidentMappingLoaderComponent;
  let fixture: ComponentFixture<IncidentMappingLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentMappingLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentMappingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
