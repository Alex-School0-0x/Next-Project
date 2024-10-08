import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogEntry } from '../../../../models/log-models';


type SeverityLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

@Component({
  selector: 'app-show-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './show-logs.component.html',
  styleUrls: ['./show-logs.component.css']
})
export class ShowLogsComponent implements OnInit {
  private dataService = inject(DataService)
  logs: LogEntry[] = []; // Logs stored as LogEntry objects
  filteredLogs: LogEntry[] = []; // Logs after applying checkbox filters

  logFileTypes: string[] = []; 
  selectedLogFileType: string = ''; 

  severityLevels: SeverityLevel[] = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']; // Updated severity level names
  selectedFetchSeverityLevel: SeverityLevel = 'DEBUG'; // Dropdown for fetching logs
  selectedFilterSeverityLevels: SeverityLevel[] = []; // Checkboxes for filtering fetched logs

  startLine: number = 1;
  lineCount: number = 5;
  reverseLogs: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.fetchLogFileTypes(); // Fetch log file types on component initialization
  }

  fetchLogFileTypes(): void {
    this.dataService.getLogFileTypes().subscribe({
      next: (fileTypes: string[]) => {
        this.logFileTypes = fileTypes;
        this.selectedLogFileType = this.logFileTypes[0]; // Set the default selection to the first type
      },
      error: () => {
        this.errorMessage = 'Failed to load log file types';
      }
    });
  }

  // Fetch logs based on the selected severity level and other params
  fetchLogs(): void {
    this.isLoading = true;
    this.errorMessage = null;
  
    this.dataService.getLogs(this.selectedFetchSeverityLevel, this.selectedLogFileType, this.startLine, this.lineCount, this.reverseLogs).subscribe({
      next: (data: LogEntry[]) => {
        this.logs = data;
        this.applySeverityFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error fetching logs';
        this.isLoading = false;
      },
    });
  }

  // Apply the filter using the selected severity levels from checkboxes
  applySeverityFilter(): void {
    if (this.selectedFilterSeverityLevels.length === 0) {
      this.filteredLogs = this.logs; // No filter applied if no checkboxes are selected
    } else {
      this.filteredLogs = this.logs.filter(log => {
        return this.selectedFilterSeverityLevels.includes(log.severity);
      });
    }
  }

  // Handle checkbox change for severity level filtering
  onSeverityFilterChange(event: Event, severity: SeverityLevel): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.selectedFilterSeverityLevels.includes(severity)) {
        this.selectedFilterSeverityLevels.push(severity);
      }
    } else {
      this.selectedFilterSeverityLevels = this.selectedFilterSeverityLevels.filter(level => level !== severity);
    }
    this.applySeverityFilter(); // Apply the filter whenever a checkbox is changed
  }

  onUpdateLines(): void {
    if (this.startLine < 1) {
      this.startLine = 1;
    }

    if (this.lineCount > 0) {
      this.fetchLogs();
    } else {
      this.errorMessage = 'Limit must be greater than 0.';
    }
  }

  onPageChange(isNext: boolean): void {
    if (isNext) {
      this.startLine += this.lineCount;
    } else if (this.startLine > 1) {
      this.startLine = Math.max(1, this.startLine - this.lineCount);
    }

    this.fetchLogs();
  }
}
