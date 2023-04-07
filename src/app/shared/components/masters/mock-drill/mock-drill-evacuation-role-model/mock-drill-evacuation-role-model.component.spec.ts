import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillEvacuationRoleModelComponent } from './mock-drill-evacuation-role-model.component';

describe('MockDrillEvacuationRoleModelComponent', () => {
  let component: MockDrillEvacuationRoleModelComponent;
  let fixture: ComponentFixture<MockDrillEvacuationRoleModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillEvacuationRoleModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillEvacuationRoleModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
