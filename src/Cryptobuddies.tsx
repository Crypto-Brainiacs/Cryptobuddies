import { useEffect } from "react";
import Leftbar from "./partials/leftbar";
import Addpost from "./partials/addpost";
import postListings from "./partials/postsListings";
import Search from "./partials/search";
import Trends from "./partials/trends";

function Crypto-buddies(props: any) {
  useEffect(() => {
    props.fetchAllposts();
  }, [""]);
  return (
    <>
      <div className="Crypto-buddies-main">
        <Leftbar signout={props.logoutButton}></Leftbar>
        <div className="center">
          <Addpost
            handleNewpostDescriptionChange={
              props.handleNewpostDescriptionChange
            }
            handleNewpostNameChange={props.handleNewpostNameChange}
            addNewpost={props.addNewpost}
            fetchAllposts={props.fetchAllposts}
            refresh={props.refresh}
            username={props.username}
            profileimage={props.profileimage}
          ></Addpost>
          <postListings
            posts={props.posts}
            like={props.like}
            handleCommentChange={props.handleCommentChange}
            addComment={props.addComment}
          ></postListings>
        </div>
        <div className="rightbar">
          <Search></Search>
          <Trends></Trends>
        </div>
      </div>
    </>
  );
}

export default Crypto-buddies;
