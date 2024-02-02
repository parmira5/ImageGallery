import * as React from "react";
import styles from "./ImageGallery.module.scss";
import { cloneDeep, find } from "@microsoft/sp-lodash-subset";

import { ALL } from "./strings";
import { Post } from "../../../models/Post";
import { PostsRepository } from "../../../models/PostsRepository";
import { CommentsRepository } from "../../../models/CommentsRepository";
import { ICommentsServerObj } from "../../../models/ICommentsServerObj";

import { imageService } from "../../../services/imageService";
import { userService } from "../../../services/userService";
import { configService } from "../../../services/configService";

import { AdminConfig } from "./AdminConfig/AdminConfig";
import { ImageViewer } from "./ImageViewer/ImageViewer";
import { ImageGrid } from "./ImageGrid/ImageGrid";
import { GalleryHeader } from "./GalleryHeader/GalleryHeader";

const ImageGallery = (): JSX.Element => {
  const [posts, setPosts] = React.useState<PostsRepository>(new PostsRepository());
  const [selectedPost, setSelectedPost] = React.useState<Post>(new Post());
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(ALL);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = React.useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = React.useState(false);
  const [isCommentsDisabled, setIsCommentsDisabled] = React.useState(true);
  const { getNext, hasNext, results } = posts;

  React.useEffect(() => {
    (async () => {
      const _posts = await getPosts(selectedCategory);
      await configService.getConfig();
      if (!configService.commentsDisabled) {
        setIsCommentsDisabled(configService.commentsDisabled);
        getCommentCounts(_posts.results.map((post) => post.id)).catch(console.error);
      }
      userService.currentUserHasFullControlOnImageList().then(setIsAdmin).catch(console.error);
      imageService.getCategories().then(setCategories).catch(console.error);
    })();
  }, []);

  categories;
  isAdmin;

  return (
    <div className={styles.appWrapper}>
      <GalleryHeader
        onSettingsButtonClick={toggleAdminPanel}
        onSubmitPhotoButtonClick={() => {
          console.log("submit");
        }}
      />
      <div className={styles.imageGallery}>
        <ImageGrid posts={posts} onClickItem={handleClickImage} onClickMore={handleLoadMore} />
        <ImageViewer
          isOpen={isImageViewerOpen}
          onDismiss={toggleImagePanel}
          selectedPost={selectedPost}
          hideComments={isCommentsDisabled}
        />
        <AdminConfig isOpen={isAdminPanelOpen} onDismiss={toggleAdminPanel} />
      </div>
    </div>
  );

  async function getCommentCounts(postIds: number[]): Promise<void> {
    const commentCounts = await imageService.batchGetCommentCount(postIds);
    setPosts((prev) => {
      const posts = cloneDeep(prev);
      posts.results = setCommentCount(posts.results, commentCounts);
      return posts;
    });
  }

  async function getPosts(selectedCategory: string): Promise<PostsRepository> {
    const _posts: PostsRepository =
      selectedCategory === ALL ? await imageService.getImages() : await imageService.getImages(selectedCategory);
    setPosts(_posts);
    return _posts;
  }

  // function handleCategoryClick(item: PivotItem): void {
  //   if (item.props && item.props.itemKey) {
  //     setSelectedCategory(item.props.itemKey);
  //     getPosts(item.props.itemKey).catch(console.error);
  //     if (!isCommentsDisabled) {
  //       getCommentCounts(results.map((post) => post.id)).catch(console.error);
  //     }
  //   }
  // }

  function handleClickImage(post: Post): void {
    toggleImagePanel();
    setSelectedCategory("ALL");
    setSelectedPost(post);
  }

  async function handleLoadMore(): Promise<void> {
    if (hasNext && getNext) {
      const nextSet = await getNext();
      if (nextSet) {
        const _postRepo = new PostsRepository(nextSet);
        if (!isCommentsDisabled) {
          const commentCounts = await imageService.batchGetCommentCount(_postRepo.results.map((post) => post.id));
          const updatedPosts = setCommentCount(_postRepo.results, commentCounts);
          setPosts((prev) => ({ ..._postRepo, results: [...prev.results, ...updatedPosts] }));
        } else {
          setPosts((prev) => ({ ..._postRepo, results: [...prev.results, ..._postRepo.results] }));
        }
      }
    }
  }

  function setCommentCount(posts: Post[], commentCounts: ICommentsServerObj[]): Post[] {
    return posts.map((post) => {
      post.comments = new CommentsRepository(
        find(commentCounts, (commentRepo: ICommentsServerObj) => commentRepo.value[0]?.itemId === post.id)
      );
      return post;
    });
  }

  function toggleAdminPanel(): void {
    setIsAdminPanelOpen((prev) => !prev);
  }

  function toggleImagePanel(): void {
    if (isImageViewerOpen && !isCommentsDisabled) getCommentCounts(results.map((post) => post.id)).catch(console.error);
    setIsImageViewerOpen((prev) => !prev);
  }
};

export default ImageGallery;
