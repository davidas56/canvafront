import React from "react";
import { Excalidraw,MainMenu,excalidrawAPI,exportToCanvas,initialData,setCanvasUrl,Sidebar,docked,setDocked,Footer} from "@excalidraw/excalidraw";

  function App() {
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
          <h1
          style={{
            fontSize: 24,
            display: "flex",
            alignItems: "center",
          }}
          >Canvas Chatbot</h1>
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