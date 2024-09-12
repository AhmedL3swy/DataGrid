import { DataGridService } from '../../Services/data-grid.service';
import { Action, ActionType } from './../../types/action-config';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  ActionDisplayType,
  DataGridConfig,
} from '../../types/data-grid-config';
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

  // providers: [DataGridService],
})
export class DataGridComponent {
  // #region Inputs
  @Input() dataGridConfig!: DataGridConfig;
  // #endregion
  //resetFlag: boolean = false;
  //#region Outputs

  // #endregion
  ActionType = ActionType;
  //#region State Variables
  state = {
    displayedData: [] as any[],
    total: 1,
    limit: 5,
    skip: 0,
    seletedEntity: null as any,
    multiEntity: [] as any[],
    multiMode: false as boolean,
    sortDirection: 'asc' as string,
    currentSortColumn: '' as string,
    uniqueKey: 'id' as string,
    isEmpty: false as boolean,
    isLoading: true as boolean,
    language: 'en' as string,
    searchValue: '' as string,
    displayType: 'ROW' as ActionDisplayType,
  };
  request = {
    page: 'skip',
    pageSize: 'limit',
    sort: 'sortBy',
    order: 'order',
    search: 'q',
  };
  result = {
    data: 'data',
    total: 'total',
  };
  paginatorOptions = [5, 10, 15, 20, 25, 50, 100];
  // #endregion
  dataGridCacheSate: {
    multiMode: boolean;
    multiEntity: any[];
  } = {
    multiMode: false,
    multiEntity: [],
  };
  // #region Constructor
  constructor(
    private dataService: ApiService,
    private dataGridService: DataGridService,
    private navigation: NavigationService,
    private translate: TranslateService
  ) {}
  // #endregion
  @ViewChild('search') search!: ElementRef;
  // #region LifeCycle Hooks
  ngOnInit() {
    this.translate.use(localStorage.getItem('lang') || 'en');
    //  Override default Values if provided!
    this.setPageSizeOptions();
    this.setDisplayType();
    this.setLimit();
    this.setrequest();
   // this.setresult();
    this.setUniqueKey();
    // Get The Data
    this.getData();

    // this.dataGridService.resetSignal.subscribe((value: boolean) => {
    //   if (value) {
    //     this.getData();
    //   }
    // });
    // this.dataGridService.resetPagSignal.subscribe((value: boolean) => {
    //   if (value) {
    //     this.state.skip = 0;
    //   }
    // });
  }
  getData() {
    this.dataService.searchEntity(this.dataGridConfig.dataApi, {}).subscribe(
      (response: any) => {
        this.state.displayedData = response[this.result.data];
        this.state.total = response[this.result.total];
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  toggleSingleActionStyle() {
    this.state.displayType =
      this.state.displayType === ActionDisplayType.HEADER
        ? ActionDisplayType.ROW
        : ActionDisplayType.HEADER;
  }
  private setDisplayType() {
    if (this.dataGridConfig.singleActionDisplay) {
      this.state.displayType = this.dataGridConfig.singleActionDisplay;
    }
  }
  isActionHeader(action: Action) {
    if (!action.actionDisplayType) return false;
    return action.actionDisplayType === ActionDisplayType.HEADER;
  }

  private setLimit() {
    this.state.limit = this.dataGridConfig.pageSizeOptions
      ? this.dataGridConfig.pageSizeOptions[0]
      : 5;
  }
  private setPageSizeOptions() {
    if (this.dataGridConfig.pageSizeOptions) {
      this.paginatorOptions = this.dataGridConfig.pageSizeOptions;
    }
  }

  private setrequest() {
    if (this.dataGridConfig.apiInputkeyWords) {
      this.request = {
        ...this.request,
        ...this.dataGridConfig.apiInputkeyWords,
      };
    }
  }

  // private setresult() {
  //   if (this.dataGridConfig.result) {
  //     this.result = {
  //       ...this.result,
  //       ...this.dataGridConfig.result,
  //     };
  //   }
  // }

  private setUniqueKey() {
    if (this.dataGridConfig.uniqueKey) {
      this.state.uniqueKey = this.dataGridConfig.uniqueKey;
    }
  }
  // #endregion

  //#region Navigation
  navigateToEmpty() {
    this.navigation.navigateTo('empty');
  }
  //#endregion

  // #region UI State Functions
  isEmpty(): boolean {
    if (this.state.displayedData === undefined) return false;
    else return this.state.displayedData.length === 0 && !this.state.isLoading;
  }
  isLoading(): boolean {
    return this.state.isLoading;
  }
  isHeaderDisplay = () => {
    if (!this.state.displayType) return false;
    return this.state.displayType === ActionDisplayType.HEADER;
  };
  isEnabledMultiAction(action: Action) {
    return action.type === ActionType.Multi && action.enabled;
  }
  isEnableSingleAction(action: Action) {
    return action.type === ActionType.Single && action.enabled;
  }
  // #endregion
  currentLocale(): string {
    return this.translate.currentLang;
  }
  onSearch(value: string) {
    // this.resetFlag = true;\
    this.dataGridService.emitResetPagSingal();
    if (value.length > 3 && value !== this.state.searchValue) {
      this.state.searchValue = value;
      this.state.skip = 0;
      this.getData();
    }
  }
  strip(value: string) {
    // trim spaces from left
    this.search.nativeElement.value = value.replace(/^\s+/, '');
  }
  onCancelSearch() {
    this.dataGridService.emitResetPagSingal();
    this.search.nativeElement.value = '';
    this.state.searchValue = '';
    this.getData();
  }
  toggleLang() {
    if (this.translate.currentLang == 'en') {
      this.translate.use('ar');
    } else {
      this.translate.use('en');
    }
    localStorage.setItem('lang', this.translate.currentLang);
  }

  isThereEnabledMultiActions(): boolean {
    if (!this.dataGridConfig.actions) return false;
    return this.dataGridConfig.actions.some(
      (action) => action.enabled && action.type === ActionType.Multi
    );
  }

  loadSate() {
    this.state.multiEntity = this.dataGridCacheSate.multiEntity;
    this.state.multiMode = this.dataGridCacheSate.multiMode;
    this.setMultiMode();
  }

  saveState() {
    this.dataGridCacheSate.multiEntity = this.state.multiEntity;
    this.dataGridCacheSate.multiMode = this.state.multiMode;
  }
  onPaginationChange(event: any) {
    this.state.limit = event.limit;
    this.state.skip = event.skip; //10
    this.getData();
  }
  localizeField(field: string,isMultiLang:boolean): string {
    if (!isMultiLang) return field;
    return this.currentLocale() + field.charAt(0).toUpperCase() + field.slice(1);
  }
  constructParams() {
    return new HttpParams()
      .set(this.request.page, this.state.skip)
      .set(this.request.pageSize, this.state.limit)
      .set(this.request.sort, this.state.currentSortColumn)
      .set(this.request.order, this.state.sortDirection)
      .set(this.request.search, this.state.searchValue);
  }

  onSort(column: any) {
    this.dataGridService.emitResetPagSingal();
    if (this.state.currentSortColumn === this.localizeField(column.field,column.isMultiLang)) {
      // Toggle sorting direction
      this.state.sortDirection =
        this.state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column to sort and reset sorting direction to ascending
      this.state.currentSortColumn = this.localizeField(
        column.field,
        column.isMultiLang
      );
      this.state.sortDirection = 'asc';
    }
    this.getData();
  }

  toggleSelectAll() {
    if (this.state.multiEntity.length === this.state.displayedData.length) {
      this.state.multiEntity = []; // Deselect all
      this.state.seletedEntity = null;
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
    if (!this.state.multiEntity) return false;
    return this.state.displayedData
      ? this.state.multiEntity.length === this.state.displayedData.length
      : false;
  }

  toggleSelectEntity(entity: any) {
    if (this.state.seletedEntity == entity) {
      this.state.seletedEntity = null;
    } else {
      this.state.seletedEntity = entity;
    }

    const index = this.state.multiEntity.indexOf(entity);
    if (index > -1) {
      this.state.multiEntity.splice(index, 1); // Deselect entity
    } else {
      this.state.multiEntity.push(entity); // Select entity
    }
    this.setMultiMode();
    this.saveState();

    if (this.state.multiEntity.length === 1) {
      this.state.seletedEntity = this.state.multiEntity[0];
    }
  }

  isSelectedEntity(entity: any): boolean {
    return this.state.multiEntity.some(
      (e: any) => e[this.state.uniqueKey] === entity[this.state.uniqueKey]
    );
  }
}
