import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillListComponent } from './mock-drill-list.component';

describe('MockDrillListComponent', () => {
  let component: MockDrillListComponent;
  let fixture: ComponentFixture<MockDrillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
