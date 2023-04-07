import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsDetailsInfoComponent } from './findings-details-info.component';

describe('FindingsDetailsInfoComponent', () => {
  let component: FindingsDetailsInfoComponent;
  let fixture: ComponentFixture<FindingsDetailsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingsDetailsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
