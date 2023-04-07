import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillPreplanComponent } from './mock-drill-preplan.component';

describe('MockDrillPreplanComponent', () => {
  let component: MockDrillPreplanComponent;
  let fixture: ComponentFixture<MockDrillPreplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillPreplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillPreplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
