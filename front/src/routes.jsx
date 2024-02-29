import Root from './Root'
import Shop from './components/Shop'
import Login from './components/Login'
import AccountCreator, { createAccount } from "./components/AccountCreator"
import Ecosystem, { loader as ecosystemLoader } from './components/ecosystem/Ecosystem'
import PartnerCard, { 
  loader as partnerLoader, likePledge
} from "./components/ecosystem/PartnerCard"
import EcoSystemProductCard, {
  loadProduct as ecosystemProductLoader, productActions
} from './components/ecosystem/EcosystemProductCard'
import Dashboard, {
  loader as dashboardLoader
} from './components/saviors/Dashboard'
import Settings from './components/Settings'
import ProtectedRoutes from './components/saviors/ProtectedRoutes'
import Plots from './components/saviors/Plots'
import Data from './components/saviors/Data'
import DataImporter from './components/saviors/data/DataImport'
import EmissionFactors, { 
  loader as factorsLoader 
} from './components/saviors/factors/EmissionFactors'
import { UploadedFiles, FileViewer } from './components/saviors/data/SaviorFiles'
import Suppliers from "./components/saviors/dashboard/suppliers/Suppliers"
import SuppliersMessenger, { 
  loader as suppliersMessengerLoader, action as messageSuppliers 
} from './components/saviors/dashboard/suppliers/SuppliersMessenger'
import { S, P, SPT, testSPT, _SPT } from './components/S'
import TasksList, { 
  configureTask,
  taskActions, 
  TaskConfigurater
} from './components/saviors/Tasks'
import { Outlet, redirect } from 'react-router-dom'
import { ProductCard, publishProduct } from './components/saviors/dashboard/products/ProductCard'
import ProductCreator from './components/saviors/dashboard/products/ProductCreator'
import FileRequirements from './components/saviors/data/FileRequirements'
import PledgeCreator, { createPledge } from "./components/saviors/pledges/PledgeCreator"
import ProductEditor, { productLoader } from './components/saviors/dashboard/products/ProductEditor'
import FactorCreator, { action } from './components/saviors/factors/FactorCreator'
import Error from './components/Error'
import PledgeCard, { editPledge } from './components/saviors/pledges/PledgeCard'
import PlotVisualizer from './components/saviors/data/PlotVisualizer'
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
} from './components/pitch/Pitch'

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
      {
        path: "shop",
        element: <Shop />
      },
      {
        path: "pitch",
        element: <Pitch />, 
        children: [
          {index: true, loader: () => redirect("purpose")},
          {
            path: "purpose",
            element: <Purpose />
          },
          {
            path: "problems",
            element: <Problems />
          },
          {
            path: "solutions",
            element: <Solutions />
          },
          {
            path: "why",
            element: <Why />
          },
          {
            path: "partner-product",
            element: <PartnerProduct />
          },
          {
            path: "consumer-product",
            element: <ConsumerProduct />
          },
          {
            path: "market-validation",
            element: <MarketValidation />
          },
          {
            path: "model",
            element: <BusinessModel />
          },
          {
            path: "plan",
            element: <MarketPlan />
          },
          {
            path: "competition",
            element: <Competition />
          },
          {
            path: "advantages",
            element: <Advantages />
          },
          {
            path: "team",
            element: <Team />
          }
        ]
      },
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
            loader: ecosystemProductLoader,
            action: productActions,
            element: <EcoSystemProductCard />
          }
        ]
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "accounts/create",
        element: <AccountCreator />,
        action: createAccount
      },
      {
        path: "saviors",
        element: <ProtectedRoutes />,
        children: [
          {
            path: "test",
            element: <_SPT />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
            loader: dashboardLoader
          },
          {
            path: "plots",
            element: <Plots />,
          },
          {
            path: "learn",
            loader: ({ request }) => {
              const url = new URL(request.url)
              return new URLSearchParams(url.search).get("topic")
            },
            element: <S />
          },
          {
            path: "tasks",
            element: <TasksList />,
            action: taskActions
          },
          {
            path: "tasks/configure",
            element: <TaskConfigurater />,
            action: configureTask
          },
          {
            path: "data",
            element: <Data />,
            children: [
              {
                index: true,
                element: <P />,
              },
              {
                path: "upload",
                element: <DataImporter />
              },
              {
                path: "requirements",
                element: <FileRequirements />
              },
              {
                path: "tables",
                element: <UploadedFiles />
              },
              {
                path: "tables/:tableId",
                element: <FileViewer />,
                loader: ({ params }) => params.tableId
              },
              {
                path: "plots",
                element: <PlotVisualizer />
              }
            ]
          },
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
                loader: factorsLoader,
              },
              {
                path: ":productId",
                element: <ProductCard />,
                loader: ({ params }) => params.productId,
                action: publishProduct
              },
              {
                path: ":productId/edit",
                element: <ProductEditor></ProductEditor>,
                loader: productLoader
              }
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
          {
            path: "factors",
            element: <EmissionFactors />,
            loader: factorsLoader
          },
          {
            path: "factors/create",
            element: <FactorCreator />,
            action: action
          },
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
]

export default routes