import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestChildDataComponent } from './request-child-data.component';

describe('RequestChildDataComponent', () => {
  let component: RequestChildDataComponent;
  let fixture: ComponentFixture<RequestChildDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestChildDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestChildDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
