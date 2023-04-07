import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportByCategoryComponent } from './report-by-category.component';

describe('ReportByCategoryComponent', () => {
  let component: ReportByCategoryComponent;
  let fixture: ComponentFixture<ReportByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportByCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
