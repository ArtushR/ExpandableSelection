import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private dbName = 'ExpandableSelectionDB'; // Название базы данных
  private storeName = 'SelectionStore'; // Название хранилища
  private db$: Observable<IDBPDatabase>;

  constructor() {
    // Создаем observable для подключения к базе данных
    this.db$ = from(
      openDB(this.dbName, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('SelectionStore')) {
            db.createObjectStore('SelectionStore');
          }
        },
      })
    );
  }

  // Метод для сохранения состояния в IndexedDB
  saveState(state: any): Observable<void> {
    return new Observable((observer) => {
      this.db$.subscribe({
        next: (db) => {
          db.put(this.storeName, state, 'categories')
            .then(() => {
              observer.next();
              observer.complete();
            })
            .catch((err) => {
              observer.error(err);
            });
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }


  loadState(): Observable<any> {
    return new Observable((observer) => {
      this.db$.subscribe({
        next: (db) => {
          db.get(this.storeName, 'categories')
            .then((data) => {
              observer.next(data);
              observer.complete();
            })
            .catch((err) => {
              observer.error(err);
            });
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }

  /// RxJs использован в демонстративных целях, данную задачу легко можно было выполнить и с async/await, к примеру


  // Метод для сохранения состояния в IndexedDB

  // async saveState(state: any): Promise<void> {
  //   try {
  //     const db = await this.db$;
  //     await db.put(this.storeName, state, 'categories');
  //   } catch (error) {
  //     console.error('Error saving state:', error);
  //     throw error;
  //   }
  // }

  // загрузка сохраненных данных из IndexedDB

  // async loadState(): Promise<any> {
  //   try {
  //     const db = await this.db$;
  //     const data = await db.get(this.storeName, 'categories');
  //     return data;
  //   } catch (error) {
  //     console.error('Error loading state:', error);
  //     throw error;
  //   }
  // }
}
