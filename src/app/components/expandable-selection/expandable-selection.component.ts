import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgIf, NgFor, NgStyle } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true, // Указываем, что компонент standalone
  selector: 'app-expandable-selection',
  templateUrl: './expandable-selection.component.html',
  styleUrls: ['./expandable-selection.component.scss'],
  imports: [NgIf, NgFor, MatCheckboxModule, FormsModule, NgStyle], // Импортируем необходимые модули
})
export class ExpandableSelectionComponent implements OnInit, OnDestroy{
  @ViewChild('expandableSelection') expandableSelection!: ElementRef; // Референс к корневому элементу


  isOpen = false; // Состояние видимости списка
  categories = [
    {
      name: 'Продажи',
      isOpen: false,
      stages: [
        { name: 'Неразобранное', color: '#99CCFD', selected: false }, // ярко-синий
        { name: 'Переговоры', color: '#FFFF99', selected: false },    // ярко-жёлтый
        { name: 'Принимают решение', color: '#FFCC66', selected: false }, // ярко-оранжевый
        { name: 'Успешно', color: '#CCFF66', selected: false },       // ярко-зелёный
      ],
    },
    {
      name: 'Сотрудники',
      isOpen: false,
      stages: [
        { name: 'Неразобранное', color: '#99CCFD', selected: false },
        { name: 'Переговоры', color: '#FFFF99', selected: false },
        { name: 'Принимают решение', color: '#FFCC66', selected: false },
        { name: 'Успешно', color: '#CCFF66', selected: false },
      ],
    },
    {
      name: 'Партнеры',
      isOpen: false,
      stages: [
        { name: 'Неразобранное', color: '#99CCFD', selected: false },
        { name: 'Переговоры', color: '#FFFF99', selected: false },
        { name: 'Принимают решение', color: '#FFCC66', selected: false },
        { name: 'Успешно', color: '#CCFF66', selected: false },
      ],
    },
    {
      name: 'Ивент',
      isOpen: false,
      stages: [
        { name: 'Неразобранное', color: '#99CCFD', selected: false },
        { name: 'Переговоры', color: '#FFFF99', selected: false },
        { name: 'Принимают решение', color: '#FFCC66', selected: false },
        { name: 'Успешно', color: '#CCFF66', selected: false },
      ],
    },
    {
      name: 'Входящие обращения',
      isOpen: false,
      stages: [
        { name: 'Неразобранное', color: '#99CCFD', selected: false },
        { name: 'Переговоры', color: '#FFFF99', selected: false },
        { name: 'Принимают решение', color: '#FFCC66', selected: false },
        { name: 'Успешно', color: '#CCFF66', selected: false },
      ],
    },
  ];

  private subscription: Subscription = new Subscription();

  constructor(private stateService: StateService, private elementRef: ElementRef) {}
  ngOnInit() {
    this.subscription.add(
      this.stateService.loadState().subscribe((state) => {
        if (state) {
          this.categories = state;
        }
      })
    );
  }

  get selectedFunnels(): number {
    return this.categories.filter((category) =>
      category.stages.some((stage) => stage.selected)
    ).length;
  }

  get selectedStages(): number {
    return this.categories.reduce((total, category) => {
      return total + category.stages.filter((stage) => stage.selected).length;
    }, 0);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  toggleCategory(category: any) {
    category.isOpen = !category.isOpen;
    this.saveState();
  }

  onStageSelectionChange() {
    this.saveState();
  }

  toggleSelectAllCategories(): void {
    const selectAll = !this.isAllSelectedAll();
    this.categories.forEach((category) =>
      category.stages.forEach((stage) => (stage.selected = selectAll))
    );
    this.saveState();
  }

  saveState(): void {
    this.stateService.saveState(this.categories).subscribe({
      next: () => console.log('State saved'),
      error: (err) => console.error('Error saving state:', err),
    });
  }

  //HostListener для предотвращения закрытия при клике на чекбоксы
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false; // Закрываем всё при клике вне компонента
    }
  }


  isAllSelectedAll(): boolean {
    return this.categories.every((category) =>
      category.stages.every((stage) => stage.selected)
    );
  }

  isPartialSelectedAll(): boolean {
    const totalStages = this.categories.flatMap((c) => c.stages).length;
    const selectedStages = this.categories.flatMap((c) =>
      c.stages.filter((stage) => stage.selected)
    ).length;

    return selectedStages > 0 && selectedStages < totalStages;
  }


  ngOnDestroy() {
    this.saveState();
    this.subscription.unsubscribe();
  }
}
