import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IPost } from '@app/models/IPost';
import { PostService } from '@app/services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit, OnDestroy {
  public posts: IPost[] = [];
  private postsSubscription!: Subscription;

  private readonly postService = inject(PostService);

  ngOnInit(): void {
    this.postsSubscription = this.postService.getPostsWithCategory().subscribe({
      next: (data) => {
        this.posts = data || [];
      },
    });
  }

  ngOnDestroy(): void {
    this.postsSubscription && this.postsSubscription.unsubscribe();
  }
}
