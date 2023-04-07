import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillComponent } from './mock-drill.component';

describe('MockDrillComponent', () => {
  let component: MockDrillComponent;
  let fixture: ComponentFixture<MockDrillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
