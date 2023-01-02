function Addpost(props: any) {
  return (
    <>
      <div className="add-post">
        <img src={props.profileimage} alt=""></img>
        <div className="post-form">
          <form action="">
            <input
              onChange={props.handleNewpostNameChange}
              placeholder="Add your post name"
            />
            <textarea
              name=""
              id=""
              rows={3}
              placeholder="Description"
              onChange={props.handleNewpostDescriptionChange}
            ></textarea>
            <button
              className="button btn Crypto-buddies-bg"
              onClick={props.addNewpost}
            >
              post
            </button>
            <button className="button btn Crypto-buddies-bg" onClick={props.refresh}>
              Refresh
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Addpost;
