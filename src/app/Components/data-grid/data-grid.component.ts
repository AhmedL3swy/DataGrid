import { NestedSearch, PaginatorOptions, RangeSearch } from './../../types/data-grid-config';
import { DataGridService } from '../../Services/data-grid.service';
import { Action, ActionType } from './../../types/action-config';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  ActionDisplayType,
  DataGridConfig,
  GridState,
} from '../../types/data-grid-config';
import { ApiService } from '../../Services/fake-data-service.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../Services/navigation.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [PaginatorComponent, CommonModule, FormsModule, TranslateModule],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],

  // providers: [DataGridService],
})
export class DataGridComponent {
  // #region I/O
  @Input() dataGridConfig!: DataGridConfig;
  // #endregion

  ActionType = ActionType;
  nameSearchvalue: string = '';
  categorySearchValue: string = '';
  startDate: string = '';
  endDate: string = '';

  //#region State Management Object
  state: GridState = {
    displayedData: [],
    total: 1,
    pageSize: 5,
    pageNumber: 1,
    selectedEntity: null,
    multiEntity: [],
    multiMode: false,
    sortDirection: 'asc',
    currentSortColumn: '',
    uniqueKey: 'id',
    isEmpty: false,
    isLoading: true,
    language: 'en',
    searchValue: '',
    displayType: ActionDisplayType.ROW,
  };
  // Dictionary for resuest and result keys
  request = {
    pageNumber: 'pageNumber',
    pageSize: 'pageSize',
    sort: 'sortBy',
    sortDirection: 'sortDirection',
    search: 'search',
    rangeSearch: 'rangeSearch',
    include: 'include',
    nestedSearch: 'nestedSearch',
    searchKeyWord: 'searchKeyWord',
  };
  result = {
    data: 'data',
    total: 'total',
  };
  // #endregion
  // Other Helper Objects
  searchObj: any = {};
  rangeSearchObj : RangeSearch[] = [
    {
      field: '',
      start: '',
      end: '',
    },
  ];
  nestedSearchObj : NestedSearch[] = [
    {
      relativePath: 'Category.EnName',
      value: '',
    },
  ];
  paginatorOptions: PaginatorOptions = [5, 10, 15, 20, 25, 50, 100];
  searchKeyWord :string = '';
  // #endregion

  // #region FIlter
  filter: any[] = [];

  // #endregion
  // #region Constructor
  constructor(
    private dataService: ApiService,
    private navigation: NavigationService,
    private translate: TranslateService
  ) {}
  // #endregion

  @ViewChild('search') search!: ElementRef;
  @ViewChild('searchField') searchField!: ElementRef;
  @ViewChild('fromDate') fromDate!: ElementRef;
  @ViewChild('toDate') toDate!: ElementRef;
  @ViewChild('category') category!: ElementRef;
  // #region LifeCycle Hooks
  searchSubject: Subject<string> = new Subject<string>();
  ngOnInit() {
    this.translate.use(localStorage.getItem('lang') || 'en');
    document.addEventListener('keyup', (event: any) => {
      if (event.key === 'Enter') {
        this.onSearch(this.search.nativeElement.value);
      }
      if (event.key === 'Escape') {
        this.onCancelSearch();
      }
    });
    // this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm) => {
    //   this.searchKeyWord = searchTerm;
    //   if (
    //     !this.isEmptyDate(this.fromDate.nativeElement.value) ||
    //     !this.isEmptyDate(this.toDate.nativeElement.value)
    //   ) {
    //     this.onDateSearch();
    //   }
    //   this.restCurrentPage();
    //   this.emptySelected();
    //   this.getData();
    // });
  }

  // #endregion

  // #region Initialization And APi Calls
  constructParams() {
    const ApiObject = {
      [this.request.pageNumber]: this.state.pageNumber,
      [this.request.pageSize]: this.state.pageSize,
      [this.request.sort]:
        this.state.currentSortColumn.charAt(0).toUpperCase() +
        this.state.currentSortColumn.slice(1),
      [this.request.sortDirection]: this.state.sortDirection === 'asc' ? 1 : 0,
      searchName: this.nameSearchvalue,
      searchCategoryName: this.categorySearchValue,
      startEndDate:this.startDate+"|"+this.endDate,

      //   [this.request.search]: this.searchObj,
      //   [this.request.rangeSearch]: this.rangeSearchObj.map((range) => {
      //     return {
      //       field: range.field.charAt(0).toUpperCase() + range.field.slice(1),
      //       start: range.start,
      //       end: range.end,
      //     };
      //   }),
      //   [this.request.include]: 'Category',
      //   [this.request.nestedSearch]: this.nestedSearchObj.map((nested) => {
      //     return {
      //       relativePath: nested.relativePath,
      //       value: nested.value,
      //     };
      //   }),
      //   [this.request.searchKeyWord]: this.searchKeyWord,
      // };
    };
    // console.log(ApiObject);
    return ApiObject;
  }

  getData() {
    console.log(this.constructParams());
    this.dataService
      .searchEntity(this.dataGridConfig.dataApi, this.constructParams())
      .subscribe(
        (response: any) => {
          this.state.displayedData = response[this.result.data];
          this.state.total = response[this.result.total];
          this.state.isEmpty = this.state.total === 0;
          if (this.filter.length === 0) {
            this.filter = [
              ...new Set(
                this.state.displayedData!.map(
                  (item: any) => item.enCategoryName
                )
              ),
            ] as string[];
          }

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
  // #endregion

  //#region Helper Functions
  navigateToEmpty() {
    this.navigation.navigateTo('empty');
  }
  //#endregion

  // #region UI
  restCurrentPage() {
    this.state.pageNumber = 1;
  }
  isActionHeader(action: Action) {
    if (!action.actionDisplayType) return false;
    return action.actionDisplayType === ActionDisplayType.HEADER;
  }
  isEmpty(): boolean {
    return this.state.isEmpty;
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
  isThereEnabledMultiActions(): boolean {
    if (!this.dataGridConfig.actions) return false;
    return this.dataGridConfig.actions.some(
      (action) => action.enabled && action.type === ActionType.Multi
    );
  }
  // #endregion

  // #region Search
  onSearch(value: string) {
    // this.MakeSearchFieldsNUll();
    // const SearchField = this.searchField.nativeElement.value;
    // const SearchObj = {
    //   [SearchField]: value,
    // };
    // this.searchObj = SearchObj;
    // // (this.searchObj as any)[SearchField] = value;
    // if (value===this.searchKeyWord ) return;
   // this.searchSubject.next(value);
    // this.searchKeyWord = value;
    // if (
    //   !this.isEmptyDate(this.fromDate.nativeElement.value) ||
    //   !this.isEmptyDate(this.toDate.nativeElement.value)
    // ) {
    //   this.onDateSearch();
    // }
    this.restCurrentPage();
    this.emptySelected();
    this.getData();
  }
  // MakeSearchFieldsNUll() {
  //   Object.keys(this.searchObj).forEach((key) => {
  //     (this.searchObj as any)[key] = null;
  //   });
  // }
  strip(value: string) {
    this.search.nativeElement.value = value.replace(/^\s+/, '');
  }
  onCancelSearch() {
    this.search.nativeElement.value = '';
    this.onCancelDateSearch();
    this.restCurrentPage();
    this.searchKeyWord = '';
    this.getData();
  }

  // #endregion
  onDateSearch() {
    const fromDate = this.fromDate.nativeElement.value;
    const toDate = this.toDate.nativeElement.value;
    if (!this.isValidDate(fromDate) || !this.isValidDate(toDate)) {
      alert('Please enter valid date Range');
      return;
    } else {
      this.rangeSearchObj = [
        {
          field: 'AddedDate',
          start: fromDate,
          end: toDate,
        },
      ];
    }
    this.restCurrentPage();
    this.getData();
  }

  isValidDate(date: string) {
    return date.match(/^\d{4}-\d{2}-\d{2}$/);
  }
  isEmptyDate(date: string) {
    return date === '';
  }
  onCancelDateSearch() {
    this.fromDate.nativeElement.value = '';
    this.toDate.nativeElement.value = '';
    this.restCurrentPage();
    this.rangeSearchObj = [];
  }
  isDateDisabled() {
    return false;
  }
  // #region Pagination
  onPaginationChange(event: any) {
    this.state.pageSize = event.pageSize;
    this.state.pageNumber = event.pageNumber;
    this.getData();
  }
  onFilter(option: any) {
    this.restCurrentPage();
    this.nestedSearchObj = [
      {
        relativePath: 'Category.EnName',
        value: option,
      },
    ];

    this.getData();
  }
  onCancelFilter() {
    this.restCurrentPage();
    this.nestedSearchObj = [];
    this.getData();
  }
  // #endregion

  // #region Multi Actions and Selection
  toggleSelectAll() {
    if (this.state.multiEntity.length >= this.state.displayedData.length) {
      this.state.multiEntity = [];
      this.state.selectedEntity = null;
    } else {
      this.state.multiEntity = [...this.state.displayedData];
    }
    this.setMultiMode();
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
    // if (this.state.selectedEntity == entity) {
    //   this.state.selectedEntity = null;
    // }
    const index = this.state.multiEntity.indexOf(entity);
    if (index > -1) {
      this.state.multiEntity.splice(index, 1);
    } else {
      this.state.multiEntity.push(entity);
    }
    this.state.selectedEntity = this.state.multiEntity[0];
    this.setMultiMode();
  }
  isSelectedEntity(entity: any): boolean {
    return this.state.multiEntity.some(
      (e: any) => e[this.state.uniqueKey] === entity[this.state.uniqueKey]
    );
  }
  emptySelected() {
    this.state.multiEntity = [];
    this.state.selectedEntity = null;
    this.setMultiMode();
  }
  // #endregion

  // #region Localization
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
  localizeField(field: string, isMultiLang: boolean): string {
    if (!isMultiLang) return field;
    return (
      this.currentLocale() + field.charAt(0).toUpperCase() + field.slice(1)
    );
  }
  // #endregion

  // #region Sorting
  onSort(column: any) {
    // this.dataGridService.emitResetPagSingal();
    if (
      this.state.currentSortColumn ===
      this.localizeField(column.field, column.isMultiLang)
    ) {
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
    this.restCurrentPage();
  }
  // #endregion

  // // #region Overridable Functions
  // private setDisplayType() {
  //   if (this.dataGridConfig.singleActionDisplay) {
  //     this.state.displayType = this.dataGridConfig.singleActionDisplay;
  //   }
  // }

  // private setpageSize() {
  //   this.state.pageSize = this.dataGridConfig.pageSizeOptions
  //     ? this.dataGridConfig.pageSizeOptions[0]
  //     : 5;
  // }
  // private setPageSizeOptions() {
  //   if (this.dataGridConfig.pageSizeOptions) {
  //     this.paginatorOptions = this.dataGridConfig.pageSizeOptions;
  //   }
  // }

  // private setrequest() {
  //   if (this.dataGridConfig.apiInputkeyWords) {
  //     this.request = {
  //       ...this.request,
  //       ...this.dataGridConfig.apiInputkeyWords,
  //     };
  //   }
  // }
  // private setresult() {
  //   if (this.dataGridConfig.apiResultKeyWords) {
  //     this.result = {
  //       ...this.result,
  //       ...this.dataGridConfig.apiResultKeyWords,
  //     };
  //   }
  // }

  // private setUniqueKey() {
  //   if (this.dataGridConfig.uniqueKey) {
  //     this.state.uniqueKey = this.dataGridConfig.uniqueKey;
  //   }
  // }
  // // #endregion
}
