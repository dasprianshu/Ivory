import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { findArtistByUserId } from "../api/artist";

import { Typography, Button } from "@material-ui/core";
import "../styles/ProfilePage.css";


function ProfilePage() {
	const [artistName, setArtistName] = useState(""); 
	const [artistDesc, setArtistDesc] = useState(""); 
	const [artistImage, setArtistImage] = useState(""); 

	const [isArtist, setIsArtist] = useState(false); 
	// const [artist, setArtist] = useState(null);
	const navigate = useNavigate();
	// const lorem = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";
	const auth = getAuth();
	const user = auth.currentUser;
	
	async function findArtist() {
    try{
      const dbData = await findArtistByUserId(user.uid);
			setIsArtist(dbData);
			setArtistName(dbData.name);
			setArtistImage(dbData.imageUrl);
			setArtistDesc(dbData.description);
      return "Success";
    }
    catch{
      return "error";
    }
  }
  
  findArtist();


  return ( 
    <div className="profilepage">
      {user ? (
        <div className="profilepage__header">
					<div className="profilepage__headerInfo">
	          <img src={isArtist ? artistImage : user.photoURL} alt="" 
						className={isArtist ? "profilepage__image is_artist" : "profilepage__image"} />

	          <div className="profilepage__headerInfoText">
	            <Typography variant="h4">{isArtist ? artistName : user.displayName}</Typography>
	            {/* <Typography  color="secondary">{isArtist ? "Artist Email" : user.email}</Typography> */}
							{isArtist && (<Typography variant="subtitles" >{artistDesc}</Typography>)}
	          </div>
					</div>
					{/* <br></br>
					<div className="profilepage__headerInfo">
						<Button
	            variant="outlined"
	            color="secondary"
	            size="small"
	          >
							<Typography variant="subtitles" >{isArtist ? "Edit artist profile" : "Edit user profile"}</Typography>
						</Button>
					</div> */}
					<br></br>
					
						<div className="profilepage__headerInfo">
							<br></br>
							{ !isArtist 
							?(<Button
		            variant="contained"
		            color="secondary"
								className="profilepage__joinArtistButton rainbow"
								onClick={() => {navigate("/register-as-an-artist")}}
		          >
								<Typography variant="subtitles" >Register as an artist</Typography>
							</Button>)

							:(<Button
		            variant="contained"
		            color="secondary"
								className="profilepage__joinArtistButton rainbow"
								onClick={() => {navigate("/uploading")}}
		          >
								<Typography variant="subtitles" >Upload Song</Typography>
							</Button>)
							}
						</div>

        </div>
      ) : (
				<Typography variant="h4">You are not signed in</Typography>
			)}

    </div>
   );
}

export default ProfilePage;