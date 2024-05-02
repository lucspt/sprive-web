import { describe, it, expect, test } from "vitest";
import { renderWithRouter } from "../../utils";
import { ProductCard } from "../../../components/products/ProductCard";
import { productCardActions, productCardLoader } from "../../../components/products/route-utils";
import { waitFor, screen, fireEvent, getByText, act } from "@testing-library/react";
import { mockObjectId, mockProduct } from "../../msw/mock-data";
import { formatCO2e } from "../../../utils/utils";


const _render = () => {
  renderWithRouter(
    <ProductCard />, 
    `/products/:productId`,
    { loader: productCardLoader, action: productCardActions },
    [],
    `/products/${mockObjectId}`
  );
};

describe("ProductCard", () => {

  test("The product's name and co2e is visible", async () => {
    _render();
    await waitFor(() => {
      [formatCO2e(mockProduct.co2e), mockProduct.name].map(x => {
        expect(screen.getByText(x)).toBeInTheDocument()
      });
    })
  })

  it("Renders all product stages", async () => {
    _render();
    await waitFor(() => {["sourcing", "processing", "assembly", "transport"].map(x => {
      expect(screen.getByText(x)).toBeInTheDocument();
    });
  });
  });

  test("A stage will show its processes on click", async () => {
    _render();
    await waitFor(() => {
      const sourcingStage = screen.getByText("sourcing");

      act(() => {
        fireEvent.click(sourcingStage);
      });
    });

    await waitFor(() => {
      mockProduct.stages.map(x => {
        x.processes.map(p => {
          const dropdown = screen.getByText(p.process)
          expect(dropdown).toBeInTheDocument();
          expect(getByText(dropdown.parentElement!, formatCO2e(p.co2e))).toBeInTheDocument();
        });
      })
    });
  })
});

