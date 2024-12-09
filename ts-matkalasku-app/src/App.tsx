import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";
import Home from "./routes/Home";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
import Settings from "./routes/Settings";
import ReportEditing from "./routes/ReportEditing";
import Root from "./routes/Root";
import ErrorPage from "./routes/ErrorPage";
import NewTrip from "./routes/NewTrip";
import WelcomePage from "./routes/WelcomePage";
import ProductTable from "./routes/Reports";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import OverView from "./routes/OverView";
import PdfUploadTest from "./routes/PdfUploadTest";
import ReportNotEdit from "./routes/ReportNotEdit";
import Setting from "./routes/Setting";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, //Parent route of all other routes
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <WelcomePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/reportedit",
        element: <ReportEditing />,
      },
      {
        path: "/newtrip",
        element: <NewTrip />,
      },
      {
        path: "/reports",
        element: <ProductTable />,
      },
      //{
        //path: "/welcome",
        //element: <WelcomePage />,
      //},
      {
        path: "/overview/:id",
        element: <OverView/>
      },
      {
        path:"/setting",
        element:<Setting/>
      },
      {
        path: "/pdf-upload",
        element: <PdfUploadTest />
      },
     

      {
        path: "/reportnotedit",
        element: <ReportNotEdit />
      },
      {
        path: "/home",
        element: <Home />
      }
    ],
  },
]);

const queryClient = new QueryClient()

//<RouterProvider router={router}/> //Provide router object
function App() {
  return (
  
    <QueryClientProvider client={queryClient}>
    <div className="min-h-screen bg-gray-light-400 dark:bg-blue-dark-950">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
    </QueryClientProvider>
  
  );
}

export default App;
