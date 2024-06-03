import { getAuth } from "firebase/auth";
import "../styles/RegisterPage.css";
import { useEffect, useState } from "react";

import { Input, Typography, TextField, Button, LinearProgress } from "@material-ui/core";
import {
  addArtist,
  getArtistImageURL,
  getArtists,
  uploadArtistToStorage,
} from "../api/artist";
import useForm from "../hooks/useForm";
import {
  capitalizeAllWords,
  createNamesArrayWithCaptitalizedWords,
  handleError,
  isValidURL,
} from "../utils/common";

function RegisterPage() {
  const auth = getAuth();
	const user = auth.currentUser;

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [artists, setArtists] = useState([]);
  const [formData, handleChange, formRef, clearForm] = useForm({
    name: "",
    description: "",
    imageUrl: "",
    image: null,
  });

  useEffect(() => {
    const unsubscribe = getArtists((snapshot) => {
      setArtists(snapshot.docs.map((doc) => doc.data().name));
    });
    return unsubscribe;
  }, []);

  const handleAddArtistForm = async (e) => {
    e.preventDefault();
    setMessage({ type: "", message: "" });
    const name = capitalizeAllWords(formData.name);
    const names = createNamesArrayWithCaptitalizedWords(formData.name);
    const { description, imageUrl } = formData;
    const data = { description, name, names, imageUrl };

    // validations
    if (artists.includes(name)) {
      return setMessage({
        type: "error",
        text: `${name} already exists in DB`,
      });
    } else if (!data.imageUrl && !formData.image) {
      return setMessage({
        type: "error",
        text: "Either image URL should be provided or Image should be uploaded",
      });
    } else if (data.imageUrl && !isValidURL(data.imageUrl)) {
      return setMessage({
        type: "error",
        text: "Invliad image URL",
      });
    } else if (formData.image && !formData.image?.type.startsWith("image")) {
      return setMessage({
        type: "error",
        text: "File must be of type image",
      });
    }

    setLoading(true);
    if (formData.image) {
      const uploadTask = uploadArtistToStorage(formData.image);

      uploadTask.on(
        "state_change",
        ({ bytesTransferred, totalBytes }) => {
          setProgress(Math.round((bytesTransferred / totalBytes) * 100));
        },
        handleError,
        () => {
          getArtistImageURL(uploadTask.snapshot.ref)
            .then(async (url) => {
              console.log(url);
              data.imageUrl = url; // adding the recived Url
              data.userId = user.uid; // Adding the userId with the artistForm;
              await addArtist(data).catch(handleError);
              setMessage({
                type: "textPrimary",
                text: "You are added as an Artist !!",
              });
              clearForm();
            })
            .catch(handleError);
        }
      ); // end of UploadTask
    } else if (data.imageUrl) {
      await addArtist(data).catch(handleError);
      setMessage({
        type: "textPrimary",
        text: "You are added as an Artist !!",
      });
      clearForm();
    } else
      setMessage({
        type: "error",
        text: "Image should be uploaded",
      });

    setLoading(false);
  };

  return ( 
    <div className="registerpage">
      <form
        ref={formRef}
        onSubmit={handleAddArtistForm}
        className="register__form"
        autoComplete="off"
      >
        <Typography align="center" variant="h5">
          Register as an Artist
        </Typography>
        <br></br>
        <div className="register__formGroup">
          <TextField
            name="name"
            onChange={handleChange}
            label="Your full name"
            required
            fullWidth
            color="secondary"
          />
        </div>
        {/* <br></br> */}
        <div className="register__formGroup">
          <TextField
            name="description"
            onChange={handleChange}
            label="Write your Bio..."
            fullWidth
            color="secondary"
          />
        </div>
        {/* <div className="register__formGroup">
          <TextField
            name="imageUrl"
            onChange={handleChange}
            label="Profile picture Url"
            fullWidth
            color="secondary"
          />
        </div>
        <Typography align="center" variant="body2">
        OR
      </Typography> */}
        <br></br>
        <label for="image">Choose your profile picture:</label>
        <div className="register__formGroup">
          <Input
            name="image"
            type="file"
            accept="image/*"
            color="secondary"
            label="Upload DP"
            onChange={handleChange}
          />
        </div>
        <div className="register__formGroup">
          <LinearProgress
            value={progress}
            variant="determinate"
            color="secondary"
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
            // onClick={() => {
            //   setMessage({ type: "", message: "" });
            //   clearForm();
            // }}
            type="button"
            variant="contained"
            color="default"
            className="registerpage__button"
          >
            Clear
          </Button>
          &nbsp; &nbsp;
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="secondary"
            className="registerpage__button"
          >
            Add
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;