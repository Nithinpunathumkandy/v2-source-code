import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsEditRiskComponent } from './isms-edit-risk.component';

describe('IsmsEditRiskComponent', () => {
  let component: IsmsEditRiskComponent;
  let fixture: ComponentFixture<IsmsEditRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsEditRiskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsEditRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
