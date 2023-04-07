import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsListComponent } from './findings-list.component';

describe('FindingsListComponent', () => {
  let component: FindingsListComponent;
  let fixture: ComponentFixture<FindingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
