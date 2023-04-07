import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpBiaDetailsComponent } from './bcp-bia-details.component';

describe('BcpBiaDetailsComponent', () => {
  let component: BcpBiaDetailsComponent;
  let fixture: ComponentFixture<BcpBiaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpBiaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpBiaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
