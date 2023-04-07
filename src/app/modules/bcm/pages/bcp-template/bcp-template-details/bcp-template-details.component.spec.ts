import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpTemplateDetailsComponent } from './bcp-template-details.component';

describe('BcpTemplateDetailsComponent', () => {
  let component: BcpTemplateDetailsComponent;
  let fixture: ComponentFixture<BcpTemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpTemplateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
