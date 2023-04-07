import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDomainMasterComponent } from './issue-domain-master.component';

describe('IssueDomainMasterComponent', () => {
  let component: IssueDomainMasterComponent;
  let fixture: ComponentFixture<IssueDomainMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueDomainMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDomainMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
