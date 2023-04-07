import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpDetailsComponent } from './bcp-details.component';

describe('BcpDetailsComponent', () => {
  let component: BcpDetailsComponent;
  let fixture: ComponentFixture<BcpDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
