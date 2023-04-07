import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillTypesComponent } from './mock-drill-types.component';

describe('MockDrillTypesComponent', () => {
  let component: MockDrillTypesComponent;
  let fixture: ComponentFixture<MockDrillTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
