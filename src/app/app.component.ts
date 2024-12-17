import { Component } from '@angular/core';
import { ExpandableSelectionComponent } from './components/expandable-selection/expandable-selection.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<app-expandable-selection></app-expandable-selection>`,
  imports: [ExpandableSelectionComponent],
})
export class AppComponent {
  defaultPrimaryColor = '#fafafa';
  defaultAccentColor = '#000000';

}
