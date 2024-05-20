import { getAuth } from "firebase/auth";
import { useState } from "react";

import { Typography, Button } from "@material-ui/core";
import "../styles/ProfilePage.css";


function ProfilePage() {
	const [isArtist, setIsArtist] = useState(false);
	// const [artist, setArtist] = useState(null);
	const lorem = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";
	const auth = getAuth();
	const user = auth.currentUser;
	if (user) {
		console.log(user); //<<<<<<<<<<<<<<<<<<
	} else {
	}
  return ( 
    <div className="profilepage">
      {user ? (
        <div className="profilepage__header">
					<div className="profilepage__headerInfo">
	          <img src={isArtist ? "https://png.pngtree.com/element_our/sm/20180515/sm_5afb09a19b08d.jpg" : user.photoURL} alt="" 
						className={isArtist ? "profilepage__image is_artist" : "profilepage__image"} />

	          <div className="profilepage__headerInfoText">
	            <Typography variant="h4">{isArtist ? "Artist Name" : user.displayName}</Typography>
	            <Typography  color="secondary">{isArtist ? "Artist Email" : user.email}</Typography>
							{isArtist && (<Typography variant="subtitles" >{lorem}</Typography>)}
	          </div>
					</div>
					<br></br>
					<div className="profilepage__headerInfo">
						<Button
	            variant="outlined"
	            color="secondary"
	            size="small"
	          >
							<Typography variant="subtitles" >{isArtist ? "Edit artist profile" : "Edit user profile"}</Typography>
						</Button>
					</div>
					<br></br>
					<br></br>
					<div className="profilepage__headerInfo">
						<Button
	            variant="contained"
	            color="secondary"
							className="profilepage__joinArtistButton rainbow"
	          >
							<Typography variant="subtitles" >Register as an artist</Typography>
						</Button>
					</div>
        </div>
      ) : (
				<Typography variant="h4">You are not signed in</Typography>
			)}

    </div>
   );
}

export default ProfilePage;