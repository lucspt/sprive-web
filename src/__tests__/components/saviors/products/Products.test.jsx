import { mockCompanyAccount, renderWithRouter } from "../../../utils";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Products } from "../../../../components/saviors/products/Products";
import { productsLoader } from "../../../../components/saviors/products/loaders";
import { MOCK_PRODUCT, setupEmptyProductsHandler, setupHandlers } from "./msw";
import { loadProductForPartner } from "../../../../components/saviors/products/editor/EditableProductCard";

const _render = (extraRoutes) => {
  renderWithRouter(
    <Products />,
    "/saviors/products",
    { loader: productsLoader },
    extraRoutes
  );
};

const productCreatorText = "PRODUCT CREATOR";
const productCreatorRoute = {
  path: "/saviors/products/create", 
  element: <div>{ productCreatorText }</div>
};

describe("Products", () => {

  it("Renders header", async () => {
    setupEmptyProductsHandler();
    _render();

    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument();
    });
  });

  describe("When products is an empty list", () => {
    beforeEach(() => {
      setupEmptyProductsHandler();
      _render([productCreatorRoute]);
    });

    it("Renders create button and CTA", async () => {
      await waitFor(() => {
        expect(screen.getByText("You haven't created any products", { exact: false })).toBeInTheDocument();
        const createProductBtn = screen.getByText("Create product")
        expect(createProductBtn).toBeInTheDocument();
        act(() => fireEvent.click(createProductBtn));
        expect(screen.getByText(productCreatorText)).toBeInTheDocument();
      });
    });
  });

  describe("When products list is populated", () => {
    const productCardText = "PRODUCT CARD";

    beforeEach(() => {
      setupHandlers();
      _render([
        productCreatorRoute,
        {
          path: "/saviors/products/:productId", 
          element: <div>{ productCardText }</div>, 
          loader: loadProductForPartner, 
        }
      ]);
    });

    it("Renders a button to create a new product", async () => {
      await waitFor(async () => {
        const createBtn = screen.getByText("create");
        act(() => fireEvent.click(createBtn));

        await waitFor(() => {
          expect(screen.getByText(productCreatorText)).toBeInTheDocument();
        });

      });
    })
    
    it("Renders a product widget", async () => {
      await waitFor(async () => {
        const productNameSpan = screen.getByText(MOCK_PRODUCT.name)
        expect(productNameSpan).toBeInTheDocument();
        act(() => fireEvent.click(productNameSpan));
        await waitFor(() => expect(screen.getByText(productCardText)).toBeInTheDocument());
      });
    });
  });

})  