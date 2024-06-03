import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Button,
  Input,
  LinearProgress,
  Typography,
  TextField,
  // InputLabel,
  // Select,
  // FormControl,
} from "@material-ui/core";
import "../styles/RegisterPage.css"
import { addSong, getSongURL, uploadSongToStorage } from "../api/song";
import useForm from "../hooks/useForm";
import {
  handleError,
  isValidURL,
  capitalize,
  createNamesArray,
} from "../utils/common";
import { findArtistByUserId } from "../api/artist";

function UploadPage() {
  const auth = getAuth();
	const user = auth.currentUser;

  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(true);
  const [artistName, setArtistName] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  // const [artists, setArtists] = useState([]);
  const [formData, handleChange, formRef, clearForm] = useForm({
    name: "",
    artist: "",
    imageUrl: "",
    url: "",
    file: null,
  });

  // useEffect(() => {
  // }, []);

  async function findArtist() {
    try{
      const artistData = await findArtistByUserId(user.uid);
      setArtistName(artistData.name)
      // console.log(artistData);
      return "Success";
    }
    catch{
      setDisplay(false);
      return setMessage({
        type: "error",
        text: "You are not a registered Artist",
      });
    }
  }
  
  findArtist();

  const handleAddSongForm = async (event) => {
    event.preventDefault();
    setMessage({ type: "intial", text: "" });
    const name = capitalize(formData.name);
    const names = createNamesArray(formData.name);
    const { imageUrl, url, artist } = formData;
    const data = {
      imageUrl,
      artist,
      url,
      name,
      names,
    };

    // validations
    if (!data.url && !formData.file) {
      return setMessage({
        type: "error",
        text: "Either song URL should be provided or song should be uploaded",
      });
    } else if (data.imageUrl && !isValidURL(data.imageUrl)) {
      return setMessage({
        type: "error",
        text: "Invliad image URL",
      });
    } else if (data.url && !isValidURL(data.url)) {
      return setMessage({
        type: "error",
        text: "Invliad audio URL",
      });
    } else if (formData.file && !formData.file?.type?.startsWith("audio")) {
      return setMessage({
        type: "error",
        text: "File must be of type audio",
      });
    }

    setLoading(true);
    if (formData.file) {
      const uploadTask = uploadSongToStorage(formData.file);

      uploadTask.on(
        "state_change",
        ({ bytesTransferred, totalBytes }) => {
          setProgress(Math.round((bytesTransferred / totalBytes) * 100));
        },
        handleError,
        () => {
          getSongURL(uploadTask.snapshot.ref)
            .then(async (url) => {
              console.log(url);
              data.url = url; // adding the recived Url
              data.userId = user.uid; // Adding the userId with the artistForm;
              data.artist = artistName;
              await addSong(data).catch(handleError);
              setMessage({
                type: "textsecondary",
                text: "Song added",
              });
              clearForm();
            })
            .catch(handleError);
        }
      ); // end of UploadTask
    } else if (data.url) {
      await addSong(data).catch(handleError);
      setMessage({
        type: "textsecondary",
        text: "Song added",
      });
      clearForm();
    }
    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="registerpage">
      {display && 
      (<form
        ref={formRef}
        onSubmit={handleAddSongForm}
        className="register__form"
        autoComplete="off"
      >
        <Typography align="center" variant="h5">
          Add New Song to Ivory
        </Typography>
        <div className="register__fromGroup">
          <TextField
            name="name"
            value={formData.name}
            onChange={handleChange}
            label="Song Name"
            required
            fullWidth
            color="primary"
          />
        </div>
        {/* <div className="register__fromGroup" style={{ paddingTop: "0.5rem" }}>
          <FormControl fullWidth>
            <InputLabel htmlFor="artist" color="primary">
              Artist
            </InputLabel>
            <Select
              native
              name="artist"
              onChange={handleChange}
              value={formData.artist}
              color="primary"
              fullWidth
              required
            >
              <option key="lasdf" value="" disabled />
              {artists.map((artist) => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </Select>
          </FormControl>
        </div> */}
        <div className="register__formGroup">
          <TextField
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            label="Image Url"
            required
            fullWidth
            color="primary"
          />
        </div>
        {/* <div className="register__formGroup">
          <TextField
            name="url"
            value={formData.url}
            onChange={handleChange}
            label="Audio Url(Not needed if uploading Song)"
            fullWidth
            color="primary"
          />
        </div> */}
        <div className="register__formGroup">
          <Input
            name="file"
            type="file"
            accept="audio/mp3,audio/*;"
            color="primary"
            onChange={handleChange}
          />
        </div>
        <div className="register__formGroup">
          <LinearProgress
            value={progress}
            variant="determinate"
            color="primary"
          />
        </div>
        {message.text && (
          <div
            className="register__formGroup register__formMessage"
            style={{ backgroundColor: "#121212" }}
          >
            <Typography color={message.type} variant="subtitle1">
              <strong>{message.text}</strong>
            </Typography>
          </div>
        )}
        <br></br>
        <div className="registerpage__buttonGroup">
          <Button
            onClick={() => {
              setMessage({ type: "", message: "" });
              clearForm();
              setProgress(0);
            }}
            type="button"
            className="registerpage__button"
            variant="contained"
            color="default"
          >
            Clear
          </Button>
          &nbsp; &nbsp;
          <Button
            disabled={loading}
            type="submit"
            className="registerpage__button"
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </div>
      </form>)}
      {!display && (<h1>{message.text}</h1>)}
    </div>
  );
}

export default UploadPage;