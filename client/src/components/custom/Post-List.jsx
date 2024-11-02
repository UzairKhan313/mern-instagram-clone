// import PostItem from "./Post-Item";

const PostList = () => {
  return (
    <div>
      {[1, 2, 3, 4, 5, 6].map((post, index) => (
        <div key={index}>{post}</div>
        // <PostItem key={index} />
      ))}
    </div>
  );
};

export default PostList;
