import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IPost } from '@app/models/IPost';
import { PostService } from '@app/services/post.service';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements OnInit, OnDestroy {
  public posts: IPost[] = [];
  private unsubscribe$ = new Subject<void>();

  private readonly postService = inject(PostService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    interval(1000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('complete interval');
        },
      });

    this.postService
      .getPostsWithCategory()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.posts = data || [];
          this.cdr.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
