import { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { FaComment, FaRecycle, FaRepost, FaThumbsUp } from "react-icons/fa";

import { Web3AuthCore } from "@web3auth/core";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";
import Cryptobuddies from "./Cryptobuddies";

import RPC from "./evm";
import { APP_CONSTANTS } from "./constants";

import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const clientId = APP_CONSTANTS.CLIENT_ID; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [posts, setposts] = useState<Array<any> | null>(null);
  const [comment, setComment] = useState<string | "">("");
  const [userName, setUserName] = useState<string | "">("");
  const [profileImage, setProfileImage] = useState<string | "">("");
  const [newpostName, setNewpostName] = useState<string | "">("");
  const [newpostDescription, setNewpostDescription] = useState<string | "">(
    ""
  );
  const refreshTime = APP_CONSTANTS.REACT_APP_REFRESH_TIMER * 1000
  const [coinbaseAdapter, configureAdapter] =
    useState<CoinbaseAdapter | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3AuthCore({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x3e9",
            rpcTarget: APP_CONSTANTS.RPC_TARGET, // This is the mainnet RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            network: "testnet",
            uxMode: "popup",
            whiteLabel: {
              name: "Crypto-buddies ",
              logoLight: APP_CONSTANTS.APP_LOGO,
              logoDark: APP_CONSTANTS.APP_LOGO,
              defaultLanguage: "en",
              dark: true, // whether to enable dark mode. defaultValue: false
            },
            loginConfig: {
              // Add login configs corresponding to the providers on modal
              // Crypto-buddies login
              jwt: {
                name: "Custom Auth Login",
                verifier: APP_CONSTANTS.ADAPTER_Crypto-buddies_CLIENT_VERIFIER, // Please create a verifier on the developer dashboard and pass the name here
                typeOfLogin: "Crypto-buddies", // Pass on the login provider of the verifier you've created
                clientId: APP_CONSTANTS.ADAPTER_Crypto-buddies_CLIENT_ID, // Pass on the clientId of the login provider here - Please note this differs from the Web3Auth ClientID. This is the JWT Client ID
              },
              // Add other login providers here
            },
          },
        });
        const coinbaseAdapter = new CoinbaseAdapter({
          clientId: CLIENT_ID,
          sessionTime: 31536000, // 1 year in seconds
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x3e9",
            rpcTarget: APP_CONSTANTS.RPC_TARGET, // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          web3AuthNetwork: "KLAY",
        });
        web3auth.configureAdapter(coinbaseAdapter);


        await web3auth.configureAdapter(openloginAdapter);
        web3auth.configureAdapter(coinbaseAdapter);
        setWeb3auth(web3auth);

        await web3auth.init();
        if (web3auth.provider) {
          await setProvider(web3auth.provider);

          let user = await web3auth.getUserInfo();
          console.log('user ', user)
          if(user.name && user.name !== null &&  user.name !== " " &&  user.name !== "")
            setUserName(user.name)

          if(user.profileImage && user.profileImage !== null &&  user.profileImage !== " " &&  user.profileImage !== "")
            setProfileImage(user.profileImage)
        }

        
        
        await fetchAllposts();
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);
  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }

    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "jwt",
        extraLoginOptions: {
          domain: APP_CONSTANTS.AUTH0_DOMAIN, // Please append "https://" before your domain
          verifierIdField: "sub",
        },
      }
    );
    
    setProvider(web3authProvider);

    if(web3authProvider){
      
      let user = await web3auth.getUserInfo();
      
      if(user.name && user.name !== null &&  user.name !== " " &&  user.name !== "")
        setUserName(user.name)

      if(user.profileImage && user.profileImage !== null &&  user.profileImage !== " " &&  user.profileImage !== "")
        setProfileImage(user.profileImage)
    }
    
  };
  /*
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    return userAccount;
  };
  */
  const refresh = (e: any) => {
    e.preventDefault();
    fetchAllposts();
  };

  const fetchAllposts = async () => {
    console.log("fetchallpostsrunning");

    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    try {
      let fetchedposts = await rpc.getAllposts();
      let posts = [...fetchedposts];
      setposts(posts.reverse());

    } catch (error) {
      console.log("error in fetching posts", error);
    }
  };

  const like = async (postIndex: any) => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    try {
      const rpc = new RPC(provider);
      await rpc.sendlikeTransaction(postIndex);

      fetchAllposts();
    } catch (error) {
      console.log("failed to execute like transaction", error);
    }
  };

  const addNewpost = (e: any) => {
    e.preventDefault();
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    try {
      const rpc = new RPC(provider);
      toast.success("post added successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      rpc.sendWritepostTransaction(newpostName, newpostDescription);
      setTimeout(function () {
        fetchAllposts();
      }, refreshTime);

      fetchAllposts();
    } catch (error) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_LEFT,
      });
      console.log("failed to execute new post transaction", error);
    }
  };

  const addComment = async (event: any, postIndex: any) => {
    event.preventDefault();
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    try {
      const rpc = new RPC(provider);

      toast.success("Comment added successfully - refresh after 30 sec", {
        position: toast.POSITION.TOP_CENTER,
      });
      await rpc.sendAddCommentTransaction(postIndex, comment);
      fetchAllposts();
    } catch (error) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_LEFT,
      });
      console.log("failed to execute add comment transaction", error);
    }
  };

  // Event handlers
  const handleCommentChange = async (event: any) => {
    setComment(event.target.value);
  };

  const handleNewpostNameChange = async (event: any) => {
    setNewpostName(event.target.value);
  };

  const handleNewpostDescriptionChange = async (event: any) => {
    setNewpostDescription(event.target.value);
  };

  const loggedInView = (
    <>
      <button className="button" onClick={logout}>
        Logout
      </button>
      <div>
        <h1>New post</h1>
        <Card>
          <Card.Body>
            <Card.Title>What are you thinking? post it out!</Card.Title>
            <Card.Text></Card.Text>

            <Form.Control
              as="input"
              onChange={handleNewpostNameChange}
              placeholder="post Name"
            />
            <br></br>
            <br></br>
            <Form.Control
              as="textarea"
              onChange={handleNewpostDescriptionChange}
              placeholder="Description"
            />
            <br></br>

            <FaRepost onClick={addNewpost} />
          </Card.Body>
        </Card>
      </div>

      <div>
        <h1>
          All posts <FaRecycle onClick={fetchAllposts} />
        </h1>
        {(posts || []).map((post: any, i) => (
          <div key={i}>
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <FaThumbsUp onClick={(event) => like(i)} /> {post.name}
                  </Card.Title>
                  <p>Total likes: {post.likes}</p>
                  <p>posted by: {post.fromAddress}</p>
                  <Card.Text>{post.description}</Card.Text>

                  <div>
                    <h3>All Comments</h3>
                    {post.comments.map((comment: any, j: any) => (
                      <div key={j}>
                        Comment {j + 1}: {comment}
                      </div>
                    ))}
                    <h3>New Comment</h3>
                    <span>
                      <Form.Control
                        as="input"
                        onChange={handleCommentChange}
                        placeholder="Your comment..."
                      />
                    </span>
                    &nbsp;
                    <span>
                      <FaComment onClick={(event) => addComment(event, i)} />
                    </span>
                  </div>
                </Card.Body>
                <a
                  href={
                    APP_CONSTANTS.OPENSEA_ASSETS_URL +
                    "/" +
                    APP_CONSTANTS.CONTRACT_ADDRESS +
                    "/" +
                    i
                  }
                  target="_blank"
                >
                  Buy Now
                </a>
              </Card>
            </div>
          </div>
        ))}
      </div>

      <div></div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <>
      <div className="login-account">
        <button className="Crypto-buddies-bg btn" onClick={login}>
          <img src="images/Crypto-buddies-white.png" alt=""></img>
          Login to your Crypto-buddies account
        </button>
      </div>
    </>
  );

  return (
    <div className="grid">
      {provider ? (
        <Crypto-buddies
          logoutButton={logout}
          handleNewpostDescriptionChange={handleNewpostDescriptionChange}
          handleNewpostNameChange={handleNewpostNameChange}
          addNewpost={addNewpost}
          fetchAllposts={fetchAllposts}
          posts={posts}
          like={like}
          handleCommentChange={handleCommentChange}
          addComment={addComment}
          refresh={refresh}
          username={userName}
          profileimage={profileImage}
        />
      ) : (
        unloggedInView
      )}{" "}
      <ToastContainer />
    </div>

    // <div className="grid">{provider
    //   ? loggedInView
    //   : unloggedInView}</div>

    // {/* <div className="grid">{loggedInView}</div> */}
  );
}

export default App;
