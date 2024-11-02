import { useSelector } from "react-redux";

import PostItem from "./Post-Item";

const PostList = () => {
  const { posts } = useSelector((state) => state.post);
  return (
    <div>
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
