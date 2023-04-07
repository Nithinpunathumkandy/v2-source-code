import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCountTypeComponent } from './incident-count-type.component';

describe('IncidentCountTypeComponent', () => {
  let component: IncidentCountTypeComponent;
  let fixture: ComponentFixture<IncidentCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
