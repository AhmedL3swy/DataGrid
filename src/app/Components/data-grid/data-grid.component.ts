import { ActionType } from './../../types/action-config';
import { Component, Input } from '@angular/core';
import { DataGridConfig } from '../../types/data-grid-config';
import { ApiService } from '../../Services/fake-data-service.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [PaginatorComponent, CommonModule, FormsModule],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
})
export class DataGridComponent {
  @Input() dataGridConfig!: DataGridConfig;
  ActionType = ActionType;
  state = {
    displayedData: [] as any[],
    total: 0,
    limit: 5,
    skip: 0,
    singleEntity: null as any,
    multiEntity: [] as any[],
    multiMode: false,
    sortDirection: 'asc',
    currentSortColumn: '',
  };

  constructor(private dataService: ApiService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataService
      .getData(this.dataGridConfig.dataApi, this.constructParams())
      .subscribe((response: any) => {
        this.state.displayedData =
          response[this.dataGridConfig.apiResultKeyWords.data];
        this.state.total =
          response[this.dataGridConfig.apiResultKeyWords.total];
        console.log(this.state.displayedData);
      });
  }

  onPaginationChange(event: any) {
    this.state.limit = event.limit;
    this.state.skip = event.skip;
    this.getData();
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
    if (this.state.currentSortColumn === column.field['en']) {
      // Toggle sorting direction
      this.state.sortDirection =
        this.state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column to sort and reset sorting direction to ascending
      this.state.currentSortColumn = column.field['en'];
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
  }

  isSelectedEntity(entity: any): boolean {
    return this.state.multiEntity.includes(entity);
  }
}
