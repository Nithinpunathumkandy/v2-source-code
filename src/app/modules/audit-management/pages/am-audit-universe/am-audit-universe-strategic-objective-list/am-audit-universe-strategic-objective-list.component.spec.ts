import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditUniverseStrategicObjectiveListComponent } from './am-audit-universe-strategic-objective-list.component';

describe('AmAuditUniverseStrategicObjectiveListComponent', () => {
  let component: AmAuditUniverseStrategicObjectiveListComponent;
  let fixture: ComponentFixture<AmAuditUniverseStrategicObjectiveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditUniverseStrategicObjectiveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditUniverseStrategicObjectiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
