import { Component, Input } from '@angular/core';
import { DataGridConfig } from '../../types/data-grid-config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridStateService } from '../../Services/grid-state.service';
@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss',
})
export class DataGridComponent {
  // Constructor
  @Input() GridConfig!: DataGridConfig;
  constructor(private selectionSate: GridStateService) {}
  //NgOnInit
  ngOnInit(): void {
    this.maxPage = Math.ceil(this.GridConfig.data.length / this.pageSize);
    this.PagintedData = this.GridConfig.data.slice(
      this.currentPage - 1,
      this.pageSize
    );
    this.selectedEntitiesSet = this.selectionSate.GetState();
  }

  // #region Pagination
  PagintedData: any;
  currentPage: number = 1;
  pageSize: number = 10;
  maxPage: number = 1;
  Paginate(): void {
    this.PagintedData = this.GridConfig.data.slice(
      (this.currentPage - 1) * this.pageSize,
      this.pageSize * this.currentPage
    );
  }
  ChangePageSize(): void {
    this.maxPage = Math.ceil(this.GridConfig.data.length / this.pageSize);
    this.Paginate();
  }
  ChangeCurrentPage(): void {
    if (this.currentPage > this.maxPage) {
      this.currentPage = this.maxPage;
      this.Paginate();
    }
    // handle if negative using elseif
    else if (this.currentPage < 1) {
      this.currentPage = 1;
      this.Paginate();
    } else {
      this.Paginate();
    }
  }
  next() {
    this.currentPage += 1;
    this.Paginate();
  }
  prev() {
    this.currentPage -= 1;
    this.Paginate();
  }
  //#endregion

  //#region Delete Logic
  PendingDelting: any;
  DeleteConfirmed() {
    if (this.MultiMode) {
      this.DeleteSelectedEntities();
    } else {
      this.GridConfig.data = this.GridConfig.data.filter(
        (x) => x !== this.PendingDelting
      );
    }

    this.ChangePageSize();
    this.Paginate();
    this.CloseModal();
  }
  showDelete: boolean = false;
  Delete(entity: any) {
    this.MultiMode = false;
    this.PendingDelting = entity;
    this.showDelete = true;
  }
  CloseModal() {
    this.showDelete = false;
  }
  //#endregion Delete Logic

  //#region Edit
  editEntity: any;
  editedEntity: any;
  showEdit: any;

  Edit(entity: any) {
    this.editedEntity = entity;
    this.editEntity = { ...entity };
    this.showEdit = true;
  }
  SaveEntity() {
    this.GridConfig.data = this.GridConfig.data.map((x) =>
      x === this.editedEntity ? this.editEntity : x
    );
    this.ChangePageSize();
    this.Paginate();
    this.CloseEditModal();
  }
  CloseEditModal() {
    this.showEdit = false;
  }
  //#endregion

  //#region Sort
  sortColumn: string = '';
  sortDirection: string = 'asc';
  currentSortColumn: any = '';
  Sort(column: any) {
    this.currentSortColumn = column.field;
    // Reverse Sort Direction
    if (this.sortColumn === column.field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.field;
      this.sortDirection = 'asc';
    }
    //
    this.GridConfig.data = this.GridConfig.data.sort((a, b) => {
      // Swap if > and Assending reverse otherwise
      if (a[this.sortColumn] > b[this.sortColumn]) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      // Dont swap if < and Ascedning
      else if (a[this.sortColumn] < b[this.sortColumn]) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      // if Equal Do Nothing
      else {
        return 0;
      }
    });
    this.Paginate();
  }
  //#endregion

  //#region Multi Operations
  showBulk: boolean = false;
  showBulkModal() {
    this.showBulk = true;
  }
  closeBulkModal() {
    this.showBulk = false;
  }
  selectedEntitiesSet = new Set<any>();
  MultiMode: boolean = false;
  ToggleSelectEntity(entity: any) {
    if (this.selectedEntitiesSet.has(entity)) {
      this.selectedEntitiesSet.delete(entity);
    } else {
      this.selectedEntitiesSet.add(entity);
    }
    this.SaveSelectionState();
    this.selectionSate.SaveState(this.selectedEntitiesSet);
  }
  isSelectedEntity(entity: any) {
    return this.selectedEntitiesSet.has(entity);
  }
  ToggleSelectAll() {
    if (this.selectedEntitiesSet.size === this.GridConfig.data.length) {
      this.selectedEntitiesSet.clear();
    } else {
      this.GridConfig.data.forEach((x) => this.selectedEntitiesSet.add(x));
    }
    this.SaveSelectionState();
    this.selectionSate.SaveState(this.selectedEntitiesSet);

  }
  isAllSelected() {
    return this.selectedEntitiesSet.size === this.GridConfig.data.length;
  }
  DeleteSelectedEntities() {
    this.GridConfig.data = this.GridConfig.data.filter(
      (x) => !this.selectedEntitiesSet.has(x)
    );
    this.ChangePageSize();
    this.Paginate();
    this.selectedEntitiesSet.clear();
  }
  DeleteAll() {
    this.MultiMode = true;
    this.showDelete = true;
  }
  SaveSelectionState() {
    localStorage.setItem(
      'selectedEntities',
      JSON.stringify(Array.from(this.selectedEntitiesSet))
    );
  }
  LoadSelectionSate() {
    const savedSet = new Set(
      JSON.parse(localStorage.getItem('selectedEntities') || '')
    );
  }
  ConvertToArray() {
    return Array.from(this.selectedEntitiesSet);
  }
  //#endregion

  //#region Search
  searchText: string = '';
  Search() {
    const SearchableFields = this.GridConfig.columns
      .filter((x) => x.searchable)
      .map((x) => x.field);
    //Search
    this.PagintedData = this.GridConfig.data.filter((x) => {
      let isMatch = false;
      SearchableFields.forEach((field) => {
        if (
          x[field]
            .toString()
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        ) {
          isMatch = true;
        }
      });
      return isMatch;
    });

    this.ChangePageSize();
  }

  //#endregion
}
