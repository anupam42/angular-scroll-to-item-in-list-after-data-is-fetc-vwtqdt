import { Component, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  users: any;
  @ViewChildren('user', { read: ElementRef })
  renderedUsers: QueryList<ElementRef>;
  timeoutId = new Subject();
  selectedId = 7;

  constructor(private http: HttpClient) {}

  public getData():void {
    this.http
      .get('https://jsonplaceholder.typicode.com/users')
      .subscribe((users) => {
        this.users = users;
        let index = this.users.map((e) => e.id).indexOf(this.selectedId);
        this.scrollTo(index);
      });
  }

  public scrollTo(i: number): void {
    console.log(typeof this.renderedUsers.toArray());

    //this one with setTimeout()

    // this.timeoutId = setTimeout(() => {
    //   const userToScrollOn = this.renderedUsers.toArray();
    //   console.log(userToScrollOn);
    //   userToScrollOn[i].nativeElement.scrollIntoView({
    //     behavior: 'smooth',
    //   });
    // }, 1000);

    //this one with rxjs interval()

    interval(1000)
      .pipe(take(1), takeUntil(this.timeoutId))
      .subscribe(() => {
        const userToScrollOn = this.renderedUsers.toArray();
        userToScrollOn[i].nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
      });
  }

  public ngOnDestroy() {
    this.timeoutId.next(undefined);
    this.timeoutId.complete();
  }
}
