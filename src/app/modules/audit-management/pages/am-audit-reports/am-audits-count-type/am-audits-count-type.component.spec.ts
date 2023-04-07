import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditsCountTypeComponent } from './am-audits-count-type.component';

describe('AmAuditsCountTypeComponent', () => {
  let component: AmAuditsCountTypeComponent;
  let fixture: ComponentFixture<AmAuditsCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditsCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditsCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
