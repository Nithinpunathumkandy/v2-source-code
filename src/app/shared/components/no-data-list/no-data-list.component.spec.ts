import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataListComponent } from './no-data-list.component';

describe('NoDataListComponent', () => {
  let component: NoDataListComponent;
  let fixture: ComponentFixture<NoDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoDataListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
