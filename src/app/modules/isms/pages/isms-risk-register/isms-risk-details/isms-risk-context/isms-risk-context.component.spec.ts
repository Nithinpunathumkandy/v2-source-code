import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskContextComponent } from './isms-risk-context.component';

describe('IsmsRiskContextComponent', () => {
  let component: IsmsRiskContextComponent;
  let fixture: ComponentFixture<IsmsRiskContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskContextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
