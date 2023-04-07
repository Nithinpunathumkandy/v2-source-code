import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhReportsComponent } from './kh-reports.component';

describe('KhReportsComponent', () => {
  let component: KhReportsComponent;
  let fixture: ComponentFixture<KhReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
