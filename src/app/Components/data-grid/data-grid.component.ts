import { CachingService } from './../../Services/caching-service.service';
import { ActionType } from './../../types/action-config';
import { Component, Input } from '@angular/core';
import { DataGridConfig } from '../../types/data-grid-config';
import { ApiService } from '../../Services/fake-data-service.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { NavigationService } from '../../Services/navigation.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [PaginatorComponent, CommonModule, FormsModule, TranslateModule],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  providers: [CachingService],
})
export class DataGridComponent {
  navigateToEmpty() {
    this.navigation.navigateTo('empty');
  }
  @Input() dataGridConfig!: DataGridConfig;
  ActionType = ActionType;
  state = {
    displayedData: [] as any[],
    total: 0,
    limit: 5,
    skip: 0,
    singleEntity: null as any,
    multiEntity: [] as any[],
    multiMode: false as boolean,
    sortDirection: 'asc' as string,
    currentSortColumn: '' as string,
    uniqueKey: 'id' as string,
  };
  isEmpty:boolean=false;
  isLoading:boolean=false;
  language: string = 'en';

  constructor(
    private dataService: ApiService,
    private cachingService: CachingService,
    private navigation: NavigationService,
    private translate: TranslateService
  ) {
    translate.use('en');
  }
  currentLocale(): string {
    return this.translate.currentLang;
  }
  toggleLang() {
    if (this.translate.currentLang == 'en') {
      this.translate.use('ar');
    } else {
      this.translate.use('en');
    }
    localStorage.setItem('lang', this.translate.currentLang);
  }
  ngOnInit() {
    this.state.uniqueKey = this.dataGridConfig.uniqueKey;
    this.getData();
    if (this.cachingService.dataGridSate.multiMode) {
      this.loadSate();
    }
    // Language
    this.translate.use(localStorage.getItem('lang') || 'en');
  }
  isThereEnabledMultiActions(): boolean {
    return this.dataGridConfig.actions.some(
      (action) => action.enabled && action.type === ActionType.Multi
    );
  }
  getData() {
    this.dataService
      .getData(this.dataGridConfig.dataApi, this.constructParams())
      .subscribe((response: any) => {
        this.state.displayedData =
          response[this.dataGridConfig.apiResultKeyWords.data];
        this.state.total =
          response[this.dataGridConfig.apiResultKeyWords.total];
        // Keep Track of Selected from the Caching Service
      });
  }
  loadSate() {
    this.state.multiEntity = this.cachingService.dataGridSate.multiEntity;
    this.state.multiMode = this.cachingService.dataGridSate.multiMode;
    this.setMultiMode();
  }
  saveState() {
    this.cachingService.dataGridSate.multiEntity = this.state.multiEntity;
    this.cachingService.dataGridSate.multiMode = this.state.multiMode;
  }
  onPaginationChange(event: any) {
    this.state.limit = event.limit;
    this.state.skip = event.skip;
    this.getData();
  }
  localizeField(field: string): string {
        //  if (field === 'title') return 'category'; // for test

    if (this.currentLocale() != 'en') {
      return this.currentLocale() + field.toUpperCase();
    } 
    return field;
  }
  constructParams() {
    return new HttpParams()
      .set(this.dataGridConfig.apiInputkeyWords.page, this.state.skip)
      .set(this.dataGridConfig.apiInputkeyWords.pageSize, this.state.limit)
      .set(
        this.dataGridConfig.apiInputkeyWords.sort,
        this.state.currentSortColumn
      )
      .set(
        this.dataGridConfig.apiInputkeyWords.order,
        this.state.sortDirection
      );
  }

  onSort(column: any) {
    if (this.state.currentSortColumn === this.localizeField(column.field) ){
      // Toggle sorting direction
      this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column to sort and reset sorting direction to ascending
      this.state.currentSortColumn = this.localizeField(column.field);
      this.state.sortDirection = 'asc';
    }
    this.getData();
  }

  toggleSelectAll() {
    if (this.state.multiEntity.length === this.state.displayedData.length) {
      this.state.multiEntity = []; // Deselect all
    } else {
      this.state.multiEntity = [...this.state.displayedData]; // Select all
    }
    this.setMultiMode();
    this.saveState();
  }

  setMultiMode() {
    this.state.multiMode = this.state.multiEntity.length > 1;
  }

  isAllSelected(): boolean {
    return this.state.multiEntity.length === this.state.displayedData.length;
  }

  toggleSelectEntity(entity: any) {
    const index = this.state.multiEntity.indexOf(entity);
    if (index > -1) {
      this.state.multiEntity.splice(index, 1); // Deselect entity
    } else {
      this.state.multiEntity.push(entity); // Select entity
    }
    this.setMultiMode();
    this.saveState();
  }

  isSelectedEntity(entity: any): boolean {
    return this.state.multiEntity.some(
      (e: any) => e[this.state.uniqueKey] === entity[this.state.uniqueKey]
    );
  }
}
