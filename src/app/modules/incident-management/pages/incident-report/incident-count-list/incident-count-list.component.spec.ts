import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCountListComponent } from './incident-count-list.component';

describe('IncidentCountListComponent', () => {
  let component: IncidentCountListComponent;
  let fixture: ComponentFixture<IncidentCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
