import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "../../types/post";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";

interface PostListProps {
  posts: Post[];
  toggleEditPost: (post:Post)=>void
  toggleModal: ()=> void
}

export default function PostList({ posts, toggleModal, toggleEditPost }: PostListProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post deleted!!");
    },
  });
  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li className={css.listItem} key={post.id}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button className={css.edit} onClick={()=>{
              toggleModal()
              toggleEditPost(post)
            }}>Edit</button>
            <button className={css.delete} onClick={() => mutate(post.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
