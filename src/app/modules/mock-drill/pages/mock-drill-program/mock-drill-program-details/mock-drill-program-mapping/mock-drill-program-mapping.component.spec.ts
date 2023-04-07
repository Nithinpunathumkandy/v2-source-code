import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillProgramMappingComponent } from './mock-drill-program-mapping.component';

describe('MockDrillProgramMappingComponent', () => {
  let component: MockDrillProgramMappingComponent;
  let fixture: ComponentFixture<MockDrillProgramMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillProgramMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillProgramMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
