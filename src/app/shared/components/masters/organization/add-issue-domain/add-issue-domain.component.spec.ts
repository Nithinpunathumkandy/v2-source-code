import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssueDomainComponent } from './add-issue-domain.component';

describe('AddIssueDomainComponent', () => {
  let component: AddIssueDomainComponent;
  let fixture: ComponentFixture<AddIssueDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIssueDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIssueDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
