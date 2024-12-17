import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableSelectionComponent } from './expandable-selection.component';

describe('ExpandableSelectionComponent', () => {
  let component: ExpandableSelectionComponent;
  let fixture: ComponentFixture<ExpandableSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandableSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpandableSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
