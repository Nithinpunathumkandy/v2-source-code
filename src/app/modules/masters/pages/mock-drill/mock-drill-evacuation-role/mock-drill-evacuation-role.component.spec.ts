import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillEvacuationRoleComponent } from './mock-drill-evacuation-role.component';

describe('MockDrillEvacuationRoleComponent', () => {
  let component: MockDrillEvacuationRoleComponent;
  let fixture: ComponentFixture<MockDrillEvacuationRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillEvacuationRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillEvacuationRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
