import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpCallTreeFormComponent } from './bcp-call-tree-form.component';

describe('BcpCallTreeFormComponent', () => {
  let component: BcpCallTreeFormComponent;
  let fixture: ComponentFixture<BcpCallTreeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpCallTreeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpCallTreeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
