import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeHubMasterComponent } from './knowledge-hub-master.component';

describe('KnowledgeHubMasterComponent', () => {
  let component: KnowledgeHubMasterComponent;
  let fixture: ComponentFixture<KnowledgeHubMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeHubMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeHubMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
