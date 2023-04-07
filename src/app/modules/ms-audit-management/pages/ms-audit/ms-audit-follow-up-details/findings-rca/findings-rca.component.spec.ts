import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsRcaComponent } from './findings-rca.component';

describe('FindingsRcaComponent', () => {
  let component: FindingsRcaComponent;
  let fixture: ComponentFixture<FindingsRcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingsRcaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsRcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
