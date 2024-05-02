/* v8 ignore start */

import { Outlet, RouteObject } from 'react-router-dom';
import { Root } from './Root';
import { Login } from './components/login/Login';
import AccountCreator from "./components/signup/AccountCreator";
import Ecosystem, { loader as ecosystemLoader } from './components/ecosystem/Ecosystem';
import PartnerCard, { 
  loader as partnerLoader, likePledge
} from "./components/ecosystem/PartnerCard";
import { ProductCard } from './components/products/ProductCard';
import { SaviorRoute } from './components/saviors/route/SaviorRoute';
import { FileImporter } from './components/saviors/file-importer/FileImporter';
import { loader as factorsLoader } from './components/saviors/factors/EmissionFactors';
import { FileLogs } from './components/saviors/files/FileLogs';
import { fileLogsLoader } from './components/saviors/files/loader';
import SupplyChain from "./components/saviors/suppliers/SupplyChain";
import { ProductCreator } from './components/saviors/products/ProductCreator';
import { Reductions } from "./components/saviors/reductions/Reductions";
import { reductionsLoader } from './components/saviors/reductions/loader';
import { Products } from "./components/saviors/products/Products";
import { Error } from './components/common/Error';
import { Overview } from './components/saviors/overview/Overview';
import { Emissions } from './components/saviors/emissions/Emissions';
import { EditableProductCard }  from './components/saviors/products/editor/EditableProductCard';
import { loadProductForPartner, editProcess } from './components/saviors/products/editor/route-utils';
import { Timeline } from './components/saviors/timeline/Timeline';
import { timelineLoader } from './components/saviors/timeline/loader';
import { Tasks } from './components/saviors/tasks/Tasks';
import { tasksLoader } from './components/saviors/tasks/loader';
import { Account } from './components/saviors/account/Account';
import { accountActions } from './components/saviors/account/action';
import { assignTask } from './components/saviors/tasks/AssigneePicker';
import { overviewLoader } from './components/saviors/overview/loader';
import { emissionsLoader } from './components/saviors/emissions/loader';
import { productNamesFetcher, productsLoader } from './components/saviors/products/loaders';
import { productCardActions, productCardLoader } from './components/products/route-utils';

/** All app routes go here. */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
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
            action: productCardActions,
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
            path: "factors",
            loader: factorsLoader
          },
          {
            path: "timeline",
            element: <Timeline />,
            loader: timelineLoader,
          },
          {
            path: "overview",
            element: <Overview />,
            loader: overviewLoader
          },
          {
            path: "emissions",
            element: <Emissions />,
            loader: emissionsLoader
          },
          {
            path: "reductions",
            element: <Reductions />,
            loader: reductionsLoader
          },
          {
            path: "suppliers",
            element: <SupplyChain />,
            loader: () => null

          },
          {
            path: "products",
            element: <Products />,
            loader: productsLoader
          },
          {
            path: "tasks",
            element: <Tasks />,
            action: assignTask,
            loader: tasksLoader,
          },
          {
            path: "file-upload",
            element: <FileImporter />,
          },
          {
            path: "files/:fileId",
            element: <FileLogs />,
            loader: fileLogsLoader, 
          },
          {
            path: "account",
            element: <Account />,
            action: accountActions
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
            ]
          },
          {
            path: "supply-chain",
            element: <SupplyChain />
          },
        ]
      },
    ]
  }
];

/* v8 ignore stop */