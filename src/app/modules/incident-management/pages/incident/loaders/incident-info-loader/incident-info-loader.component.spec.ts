import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentInfoLoaderComponent } from './incident-info-loader.component';

describe('IncidentInfoLoaderComponent', () => {
  let component: IncidentInfoLoaderComponent;
  let fixture: ComponentFixture<IncidentInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
