import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByAuditorDetailsComponent } from './by-auditor-details.component';

describe('ByAuditorDetailsComponent', () => {
  let component: ByAuditorDetailsComponent;
  let fixture: ComponentFixture<ByAuditorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByAuditorDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByAuditorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
