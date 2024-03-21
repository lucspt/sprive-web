import Root from './Root';
import Shop from './components/Shop';
import Login from './components/Login';
import AccountCreator from "./components/AccountCreator";
import Ecosystem, { loader as ecosystemLoader } from './components/ecosystem/Ecosystem';
import PartnerCard, { 
  loader as partnerLoader, likePledge
} from "./components/ecosystem/PartnerCard";
import ProductCard, {
  loadProduct as productCardLoader, productActions
} from './components/products/ProductCard';
import Settings from './components/Settings';
import SaviorRoute from './components/saviors/SaviorRoute';
import Plots from './components/saviors/Plots';
import Data from './components/saviors/data/Data';
import DataImporter from './components/saviors/data/DataImport';
import FileUploader from './components/saviors/data/FileUploader';
import EmissionFactors, { 
  loader as factorsLoader 
} from './components/saviors/factors/EmissionFactors';
import FileViewer, { getFile } from './components/saviors/data/FileViewer';
import UploadedFiles from "./components/saviors/data/UploadedFiles";
import Suppliers from "./components/saviors/suppliers/Suppliers";
import SuppliersMessenger, { 
  loader as suppliersMessengerLoader, action as messageSuppliers 
} from './components/saviors/suppliers/SuppliersMessenger';
import { S, P, SPT, testSPT, _SPT } from './components/S';
import TasksList, { 
  taskActions, tasksLoader, 
} from './components/saviors/tasks/Tasks';
import TaskConfigurator, { 
  configureTask
 } from './components/saviors/tasks/TaskConfigurator';
import { Outlet, redirect } from 'react-router-dom';
import ProductCreator, { productNamesFetcher } from './components/saviors/products/ProductCreator';
import Pledges from "./components/saviors/pledges/Pledges";
import Products from "./components/saviors/products/Products";
import FileRequirements from './components/saviors/data/FileRequirements';
import PledgeCreator, { createPledge } from "./components/saviors/pledges/PledgeCreator";
// import ProductEditor, { productLoader } from './components/saviors/products/editor/_ProductEditor';
import FactorCreator, { action } from './components/saviors/factors/FactorCreator';
import Error from './components/Error';
import PledgeCard, { editPledge } from './components/saviors/pledges/PledgeCard';
import PlotVisualizer from './components/saviors/data/PlotVisualizer';
import Pitch, { 
  Advantages,
  BusinessModel,
  Competition,
  ConsumerProduct,
  MarketPlan, 
  MarketValidation, 
  PartnerProduct, 
  Problems, 
  Purpose, 
  Solutions, 
  Team,
  Why
} from './components/pitch/Pitch';
import Overview, { 
  overviewLoader
 } from './components/saviors/overview/Overview';
import { fetchData } from './utils';
import Emissions from './components/saviors/emissions/Emissions';
import Chat from './components/saviors/chat/Chat';
import EditableProductCard, { 
  loadProductForPartner, 
} from './components/saviors/products/editor/EditableProductCard';
import { editProcess } from "./components/saviors/products/editor/ProcessEditor";
// import EmissionFactors, {
//   factorsLoader
// } from './components/saviors/factors/_EmissionFactors';

const dashboardLoader = async (route) => {
  const res = await fetchData(`saviors/${route}`);
  return res.content ;
}

const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "test",
        element: <SPT />,
        action: testSPT,
      },
      // {
      //   path: "shop",
      //   element: <Shop />
      // },
      // {
      //   path: "pitch",
      //   element: <Pitch />, 
      //   children: [
      //     {index: true, loader: () => redirect("purpose")},
      //     {
      //       path: "purpose",
      //       element: <Purpose />
      //     },
      //     {
      //       path: "problems",
      //       element: <Problems />
      //     },
      //     {
      //       path: "solutions",
      //       element: <Solutions />
      //     },
      //     {
      //       path: "why",
      //       element: <Why />
      //     },
      //     {
      //       path: "partner-product",
      //       element: <PartnerProduct />
      //     },
      //     {
      //       path: "consumer-product",
      //       element: <ConsumerProduct />
      //     },
      //     {
      //       path: "market-validation",
      //       element: <MarketValidation />
      //     },
      //     {
      //       path: "model",
      //       element: <BusinessModel />
      //     },
      //     {
      //       path: "plan",
      //       element: <MarketPlan />
      //     },
      //     {
      //       path: "competition",
      //       element: <Competition />
      //     },
      //     {
      //       path: "advantages",
      //       element: <Advantages />
      //     },
      //     {
      //       path: "team",
      //       element: <Team />
      //     }
      //   ]
      // },
      {
        path: "ecosystem",
        children: [
          {index: true, element: <Ecosystem />, loader: ecosystemLoader},
          {
            path: "partners/:partnerId",
            loader: partnerLoader,
            element: <PartnerCard />,
            action: likePledge
          },
          {
            path: "products/:productId",
            loader: productCardLoader,
            action: productActions,
            element: <ProductCard />
          }
        ]
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "signup",
        element: <AccountCreator />,
      },
      {
        path: "saviors",
        element: <SaviorRoute />,
        children: [
          {
            path: "overview",
            element: <Overview />,
            loader: overviewLoader,
          },
          {
            path: "emissions",
            element: <Emissions />,
          },
          {
            path: "pledges",
            element: <Pledges />,
            loader: () => dashboardLoader("pledges")
          },
          {
            path: "suppliers",
            element: <Suppliers />,
            loader: () => dashboardLoader("suppliers")

          },
          {
            path: "products",
            element: <Products />,
            loader: () => dashboardLoader("products")
          },
          {
            path: "plots",
            element: <Plots />,
          },
          // {
          //   path: "learn",
          //   loader: ({ request }) => {
          //     const url = new URL(request.url)
          //     return new URLSearchParams(url.search).get("topic")
          //   },
          //   element: <S />
          // },
          {
            path: "tasks",
            element: <TasksList />,
            action: taskActions,
            loader: tasksLoader,
          },
          {
            path: "data",
            element: <Data />,
            children: [
              // {
              //   index: true,
              //   element: <P />,
              // },
              {
                path: "upload",
                element: <DataImporter />
              },
              // {
              //   path: "requirements",
              //   element: <FileRequirements />
              // },
              {
                path: "tables",
                element: <UploadedFiles />
              },
              {
                path: "tables/:tableId",
                element: <FileViewer />,
                loader: getFile, 
              },
              // {
              //   path: "plots",
              //   element: <PlotVisualizer />
              // }
            ]
          },
          // {
          //   path: "chat",
          //   element: <Chat />
          // },
          {
            path: "settings",
            element: <Settings />
          },
          {
            path: "products",
            element: <Outlet />,
            children: [
              {
                path: "create",
                element: <ProductCreator />,
                loader: productNamesFetcher
              },
              {
                path: ":productId",
                element: <EditableProductCard />,
                loader: loadProductForPartner,
                action: editProcess
              },
              // {
              //   path: ":productId/edit",
              //   element: <ProductEditor />,
              //   loader: productLoader
              // }
            ]
          },
          {
            path: "suppliers",
            element: <Suppliers />
          },
          {
            path: "suppliers/:ids",
            element: <SuppliersMessenger />,
            loader: suppliersMessengerLoader,
            action: messageSuppliers,
          },
          // {
          //   path: "factors",
          //   element: <EmissionFactors />,
          //   loader: factorsLoader
          // },
          // {
          //   path: "factors/create",
          //   element: <FactorCreator />,
          //   action: action
          // },
          {
            path: "pledges",
            element: <Outlet />,
            children: [
              {
                path: ":pledgeId",
                element: <PledgeCard />,
                loader: ({ params }) => params.pledgeId,
                action: editPledge
              },
              {
                path: "create",
                element: <PledgeCreator />,
                action: createPledge
              }
            ]
          },
        ]
      },
    ]
  }
];

export default routes