import React, {useState} from "react";
import { Excalidraw,MainMenu,excalidrawAPI,exportToCanvas,initialData,setCanvasUrl,Sidebar,docked,setDocked,Footer} from "@excalidraw/excalidraw";
import Cookies from 'js-cookie';
import './App.css'


  // const clientId = 'OC-AZEBOdpAL3WB'; 
  // const AUTH_URL = 'https://ralstreetlighting.cloud/authorize';
  // const REDIRECT_URI = 'https://ralstreetlighting.cloud/oauth/redirect';
  const BACKEND_HOST = 'https://ralstreetlighting.cloud';

  const endpoints = {
    AUTHORIZE: 'https://ralstreetlighting.cloud/authorize',
    REVOKE: 'https://ralstreetlighting.cloud/oauth/redirect',
    IS_AUTHORIZED: 'https://ralstreetlighting.cloud/is-authorized',
  };

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(BACKEND_HOST + "/v1/users/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

const getCanvaAuthorization = async () => {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(endpoints.AUTHORIZE, BACKEND_HOST);
      const windowFeatures = ["popup", "height=800", "width=800"];
      const authWindow = window.open(url, "", windowFeatures.join(","));

      window.addEventListener("message", (event) => {
        if (event.data === "authorization_success") {
          resolve(true);
          authWindow?.close();
        } else if (event.data === "authorization_error") {
          reject(new Error("Authorization failed"));
          authWindow?.close();
        }
      });

      const checkAuth = async () => {
        try {
          const authorized = await checkAuthorizationStatus();
          resolve(authorized.status);
        } catch (error) {
          reject(error);
        }
      };

      const checkWindowClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkWindowClosed);
          checkAuth();
        }
      }, 1000);
    } catch (error) {
      console.error("Authorization failed", error);
      reject(error);
    }
  });
};

  const revoke = async () => {
    const url = new URL(endpoints.REVOKE, BACKEND_HOST);
    const response = await fetch(url, { credentials: "include" });

    if (!response.ok) {
      return false;
    }

    return true;
  };

  const checkAuthorizationStatus = async () => {
    const url = new URL(endpoints.IS_AUTHORIZED, BACKEND_HOST);
    const response = await fetch(url, { credentials: "include" });

    if (!response.ok) {
      return { status: false };
    }
    return response.json();
  };
  function App() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
  
    React.useEffect(() => {
      const fetchAuthorizationStatus = async () => {
        try {
          const authorized = await checkAuthorizationStatus();
          setIsAuthorized(authorized.status);
        } catch (error) {
          console.error("Error checking authorization status", error);
          setIsAuthorized(false);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAuthorizationStatus();
    }, []);
  
    const handleAuthorize = async () => {
      try {
        const success = await getCanvaAuthorization();
        setIsAuthorized(success);
      } catch (error) {
        console.error("Authorization failed", error);
        setIsAuthorized(false);
      }
    };
  
    const handleRevoke = async () => {
      try {
        const success = await revoke();
        if (success) {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Revoke failed", error);
      }
    };
  

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };
  
    const handleUpload = async () => {
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }
  
      setUploading(true);
      setResponse(null);
      setError(null);
  
      const authorizationCode = Cookies.get('canvaAuthCode');
  
      if (!authorizationCode) {
        setError('Authorization code not found.');
        setUploading(false);
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append('image', file, file.name);
  
        const response = await fetch('https://ralstreetlighting.cloud/v1/asset-uploads', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${authorizationCode}`,
          },
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed: ${errorText}`);
        }
  
        const data = await response.json();
        setResponse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    };
    return (
      <div style={{ height: "1000px" }}>
        <Excalidraw>
          <MainMenu>
            <MainMenu.Item onClick={async () => {
          if (!excalidrawAPI) {
            return
          }
          const elements = excalidrawAPI.getSceneElements();
          if (!elements || !elements.length) {
            return
          }
          const canvas = await exportToCanvas({
            elements,
            appState: {
              ...initialData.appState,
              exportWithDarkMode: false,
            },
            files: excalidrawAPI.getFiles(),
            getDimensions: () => { return {width: 350, height: 350}}
          });
          const ctx = canvas.getContext("2d");
          ctx.font = "30px Virgil";
          ctx.strokeText("My custom text", 50, 60);
          setCanvasUrl(canvas.toDataURL());
        }}
      >
              Redraw 
            </MainMenu.Item>
            <MainMenu.Item onClick={async () => {
          if (!excalidrawAPI) {
            return
          }
          const elements = excalidrawAPI.getSceneElements();
          if (!elements || !elements.length) {
            return
          }
          const canvas = await exportToCanvas({
            elements,
            appState: {
              ...initialData.appState,
              exportWithDarkMode: false,
            },
            files: excalidrawAPI.getFiles(),
            getDimensions: () => { return {width: 350, height: 350}}
          });
          const ctx = canvas.getContext("2d");
          ctx.font = "30px Virgil";
          ctx.strokeText("My custom text", 50, 60);
          setCanvasUrl(canvas.toDataURL());
        }}
      >
              Fix 
            </MainMenu.Item>
            </MainMenu>
            <Sidebar name="custom" docked={docked} onDock={setDocked}>
            <Sidebar.Header />
              <h1 style={{color: "blue", fontFamily:"cursive",}}>Canvas Chatbot</h1>
              <h3 align="center" style={{color: "blue", fontFamily:"cursive"}} >Canva Authorization</h3>
            {isAuthorized ? (
              <div className="authorized-section">
                <p align="center" style={{fontSize:"8px"}}>You are authorized!</p>
                <button className="revoke-button" onClick={handleRevoke}>Revoke Access</button>
              </div>
            ) : (
              <div style={{ display: 'inline-grid', justifyContent: 'center', alignItems: 'center'}} className="unauthorized-section">
                <p align="center" style={{fontSize:"8px"}} >You are not authorized.</p>
                <button style={{backgroundColor:'#d6ecf2',resizeMode:'cover',justifyContent:'center',alignItems:'center',width:null,height:null}} className="authorize-button" onClick={handleAuthorize} >
                  <h1 style={{color: "blue", fontFamily:"cursive"}} >Authorize Canva</h1>
                </button>
              </div>
            )}
            <h1 style={{color: "blue", fontFamily:"cursive",fontSize:"15px",padding:"50px 0px 0px 0"}} >Select a File</h1>
      <form className="upload-form" style={{ display: 'inline-grid', justifyContent: 'center', alignItems: 'center', padding: "10px 10px 10px 0"}} onSubmit={(e) => e.preventDefault()}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          className="file-input"
          style={{
            width: "100%",
            }}
        />
        <h1 style={{color: "blue", fontFamily:"cursive",fontSize:"15px",padding:"400px 0px 0px 0"}}>Upload the file</h1>
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className={`upload-button ${uploading ? 'loading' : ''}`}
          style={{backgroundColor:'blue',resizeMode:'cover',justifyContent:'center',alignItems:'center',width:null,height:null}}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {response && (
        <div className="response-message success">
          <h2>Upload successful!</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div className="response-message error">
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
        </Sidebar>

        <Footer>
          <Sidebar.Trigger
            name="custom"
            tab="one"
            style={{
              marginLeft: "0.5rem",
              background: "#70b1ec",
              color: "white",
            }}
          >
            Canva Chatbot
          </Sidebar.Trigger>
        </Footer>
        </Excalidraw>
      </div>
    );
  }
export default App