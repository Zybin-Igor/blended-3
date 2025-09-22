import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";

import CreateForm from "../CreatePostForm/CreatePostForm";
import { Post } from "../../types/post";
import EditPostForm from "../EditPostForm/EditPostForm";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isEditPost, setIsEditPost] = useState<boolean>(false);
  const [editPost, setEditPost] = useState<Post | null>(null);

  const [debouncedQuery] = useDebounce(query, 500);

  const onChange = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const { data } = useQuery({
    queryKey: ["posts", debouncedQuery, page],
    queryFn: () => fetchPosts(debouncedQuery, page),
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const togleCreatePost = () => {
    setIsCreatePost(!isCreatePost);
  };

  const toggleEditPost = (postToEdit?: Post) => {
    if (postToEdit) {
      setEditPost(postToEdit);
    }
    setIsEditPost(!isEditPost);
  };

  const posts = data?.posts ?? [];
  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / 8) : 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onChange={onChange} />
        {totalPages > 1 && (
          <Pagination onPageChange={setPage} totalPages={totalPages} currentPage={page} />
        )}
        <button
          className={css.button}
          onClick={() => {
            toggleModal();
            togleCreatePost();
          }}
        >
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          {isCreatePost && (
            <CreateForm
              onClose={() => {
                toggleModal();
                togleCreatePost();
              }}
            />
          )}
          {isEditPost && editPost && (
            <EditPostForm
              initialValues={editPost}
              onClose={() => {
                toggleModal();
                toggleEditPost();
                setEditPost(null);
              }}
            />
          )}
        </Modal>
      )}
      {/* <Modal></Modal> */}
      {posts.length > 0 && (
        <PostList posts={posts} toggleModal={toggleModal} toggleEditPost={toggleEditPost} />
      )}
    </div>
  );
}
