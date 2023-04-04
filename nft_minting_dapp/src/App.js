import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Sample from "./pages/sample";
import Root from "./routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  // {
  //   path: "/home",
  //   element: <Home />,
  // },
  {
    path: "/Sample",
    element: <Sample />,
  },
]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
