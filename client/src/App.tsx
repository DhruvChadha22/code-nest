import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import { Toaster } from "sonner";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/join-room" element={<JoinRoom />} />
                <Route path="/room/:roomId" element={<Room />} />
            </Routes>
            <Toaster />
        </>
    );
};

export default App;
