import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsAddComponent } from './findings-add.component';

describe('FindingsAddComponent', () => {
  let component: FindingsAddComponent;
  let fixture: ComponentFixture<FindingsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
