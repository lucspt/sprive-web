import { beforeEach, describe, it, test, vi, expect, assert } from "vitest";
import * as utils from "../../utils/utils";
import { server } from "../msw/server";
import { render, screen, waitFor } from "@testing-library/react";
import { fetchWithAuthEndpoint, fetchWithAuthRes, fetchWithAuthSuccessCode, mockTokenValue, setupHandlers, unauthorizedEndpoint } from "./msw";
import { HttpResponse } from "msw";
import { kgsInGt, kgsInMt, kgsInTon } from "../../utils/constants";
import { mockLogsForPartnerOfThreeYears, mockLogsSinceFourYearsAqgo, mockLogsSinceYearAgo } from "./mock";

describe("utils", () => {
  
  const getCookieSpy = vi.spyOn(utils, "getCookie");
  test("capitalize", () => {
    expect(utils.capitalize("sprive")).toEqual("Sprive");
  });
  

  // describe("fetchWithAuth", () => {
  /**
   * Hard to test this function, because even if we mock `getCookie`
   * the mock does not seem to work when it's called inside a function
   * from the same module that exports it.
   */

  // })

  describe("formatCO2e", () => {

    const assertMetric = (metricRes, expectedMetric) => {
      assert(
        metricRes === expectedMetric, 
        `Expected result metric to equal '${expectedMetric}', received: ${metricRes} instead`
      )
    };

    const testFormatCo2e = (testCo2e, expectedDigit=1, expectedMetric) => {
      const [ digit, metric ] = utils.formatCO2e(testCo2e, { stringify: false });
      expect(Number(digit)).toEqual(expectedDigit);
      assertMetric(metric, expectedMetric);
      assert(utils.formatCO2e(testCo2e) === `${expectedDigit} ${expectedMetric}`);
    };

    it(`Formats ${kgsInTon} to 1 t`, () => {
      testFormatCo2e(kgsInTon, 1, "t");
    });

    it(`formats ${kgsInMt}kg to 1 Mt`, () => {
      testFormatCo2e(kgsInMt, 1, "Mt");
    });

    it(`formats ${kgsInGt}kg to 1 Gt`, () => {
      testFormatCo2e(kgsInGt, 1, "Gt");
    });

    it("Returns 0 kg when passing NaN value", () => {
      testFormatCo2e(NaN, 0, "kg");
    })

  })

  describe("fetchWithAuth", () => {


    it("Sends the correct default fetch init", async () => {
      const content = "mock";
      vi.spyOn(window, "fetch")
      .mockImplementationOnce((req) => {

        expect(req.url).toContain(fetchWithAuthEndpoint);
        [
          "Content-Type", 
          "X-CSRF-TOKEN",
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Credentials",
          "Access-Control-Allow-Headers"
      ].map(x => {
        expect(req.headers.get(x)).toBeTruthy();
      });
      expect(req.credentials).toBe("include");

      return HttpResponse.json({ content }, { status: 200 });
      });
      utils.fetchWithAuth(fetchWithAuthEndpoint);
    });

    it("Returns the correct response, given options.responseMethod parameter", async () => {
      setupHandlers();
      const mockRes = await utils.fetchWithAuth(fetchWithAuthEndpoint, { responseMethod: "blob" })
      expect(mockRes.constructor.name === "Blob").toBe(true);
    });

    it("JSON stringifies a request body when options.stringifyBody is true", async () => {
      setupHandlers();
      const spy = vi.spyOn(JSON, "stringify")
      const request = {hey: "ho"};
      spy.mockImplementationOnce(req => {
        expect(Object.keys(request).every(k => request[k] === req[k])).toBe(true);
      }); 

      utils.fetchWithAuth(
        fetchWithAuthEndpoint, 
        { body: request, method: "POST", stringifyBody: true }
      );
      await waitFor(() => expect(spy).toHaveBeenCalledOnce());
    });

    it("Calls onUnauthorized when response status code is 401", async () => {
      setupHandlers();
      const onUnauthorized = vi.fn();

      await utils.fetchWithAuth(unauthorizedEndpoint, { onUnauthorized, method: "GET" });

      expect(onUnauthorized).toHaveBeenCalledOnce();
    })
  })
  
  // test("formToObj", () => {
  //   const mockKey = "sprive";
  //   const mockValue = "life";
  //   const mockObjRes = {[mockKey]: mockValue};
  //   const mockForm = (
  //     <form data-testid="mock-form">
  //       <input name={mockKey} value={mockValue} readOnly />
  //     </form>
  //   );
  //   render(mockForm);
  //   const result = utils.formToObj(screen.getByTestId("mock-form"));
  //   expect(Object.keys(mockObjRes).every((key) => mockObjRes[key] === result[key]));
  // });

  test("arrayRange", () => {
    const res = utils.arrayRange(0, 10, 2);
    const shouldBe = [0, 2, 4, 6, 8, 10];
    assert(res.every((x, i) => x === shouldBe[i]));
  });

  test("isObjectEmpty", () => {
    assert(utils.isObjectEmpty({}) === true, "isObjectEmpty({}) returned false");
    assert(utils.isObjectEmpty({love: "life"}) === false, "isObjectEmpty({...}) returned true");
  }); 

  // describe("IsLoggedIn", () => {
    // also hard to test since vi.spyOn does not work on functions in the same module
  //   getCookieSpy.mockReturnValue()
  //   it("Returns true when cookies are present in browser and `savior` object is not empty", () => {
  //     expect(utils.isLoggedIn({savior_id: 123}))
  //   });
  // })

  test("sumArray", () => {
    const shouldBe = 3;
    const arr = [1, 1, 1];
    assert(utils.sumArray(arr) === 3, "Expected 3 when calling sumArray(arr), where arr = [1, 1, 1]");
  }); 

  describe("filterLogsForRelevantDate", () => {

    it("Filters logs correctly for a partner who joined this year", () => {
      const res = utils.filterLogsForRelevantDate(mockLogsSinceYearAgo, new Date());
      assert(
        res.length === mockLogsSinceYearAgo.length,
        "Filtered incorrectly"
      );
    });

    it("Filters logs correctly for a partner of 3+ years", () => {
      const fourYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 4));
      const res = utils.filterLogsForRelevantDate(mockLogsForPartnerOfThreeYears, fourYearsAgo);
      assert(res.length === mockLogsForPartnerOfThreeYears.length / 2);
    });

  });
  
});
