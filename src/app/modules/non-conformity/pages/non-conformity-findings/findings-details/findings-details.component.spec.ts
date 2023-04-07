import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsDetailsComponent } from './findings-details.component';

describe('FindingsDetailsComponent', () => {
  let component: FindingsDetailsComponent;
  let fixture: ComponentFixture<FindingsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
