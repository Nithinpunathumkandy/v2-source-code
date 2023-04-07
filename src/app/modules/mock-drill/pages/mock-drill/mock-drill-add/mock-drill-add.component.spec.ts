import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillAddComponent } from './mock-drill-add.component';

describe('MockDrillAddComponent', () => {
  let component: MockDrillAddComponent;
  let fixture: ComponentFixture<MockDrillAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
