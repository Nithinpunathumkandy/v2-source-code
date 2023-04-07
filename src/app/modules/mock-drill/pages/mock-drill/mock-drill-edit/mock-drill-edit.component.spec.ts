import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillEditComponent } from './mock-drill-edit.component';

describe('MockDrillEditComponent', () => {
  let component: MockDrillEditComponent;
  let fixture: ComponentFixture<MockDrillEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
