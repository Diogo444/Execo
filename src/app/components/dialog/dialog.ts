import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type DialogData = {
  message: string;
  data: JsonValue;
};

type JsonEntry = {
  key: string;
  value: JsonValue;
};

@Component({
  selector: 'app-dialog',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatIconModule, NgTemplateOutlet],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  data = inject<DialogData>(MAT_DIALOG_DATA);

  get rootValue(): JsonValue {
    return this.data.data ?? null;
  }

  get itemCount(): number {
    return this.countItems(this.rootValue);
  }

  get rootType(): string {
    return this.getValueType(this.rootValue);
  }

  getValueType(value: JsonValue): string {
    if (Array.isArray(value)) {
      return 'array';
    }

    if (value === null) {
      return 'null';
    }

    return typeof value;
  }

  isArray(value: JsonValue): value is JsonValue[] {
    return Array.isArray(value);
  }

  isObject(value: JsonValue): value is { [key: string]: JsonValue } {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  isPrimitive(value: JsonValue): value is string | number | boolean | null {
    return !this.isArray(value) && !this.isObject(value);
  }

  objectEntries(value: JsonValue): JsonEntry[] {
    if (!this.isObject(value)) {
      return [];
    }

    return Object.entries(value).map(([key, entryValue]) => ({
      key,
      value: entryValue,
    }));
  }

  arrayLabel(value: JsonValue): string {
    return this.isArray(value) ? `${value.length} élément${value.length > 1 ? 's' : ''}` : '';
  }

  objectLabel(value: JsonValue): string {
    const count = this.objectEntries(value).length;
    return `${count} champ${count > 1 ? 's' : ''}`;
  }

  formatPrimitive(value: JsonValue): string {
    if (value === null) {
      return 'null';
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }

    return String(value);
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByKey(_: number, entry: JsonEntry): string {
    return entry.key;
  }

  private countItems(value: JsonValue): number {
    if (this.isArray(value)) {
      return value.length;
    }

    if (this.isObject(value)) {
      return Object.keys(value).length;
    }

    return value === null ? 0 : 1;
  }
}
