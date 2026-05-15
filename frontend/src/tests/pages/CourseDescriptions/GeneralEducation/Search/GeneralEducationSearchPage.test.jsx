import { vi } from "vitest";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import primaryFixtures from "fixtures/primaryFixtures";

// mock the error console to avoid cluttering the test output
import mockConsole from "tests/testutils/mockConsole";

describe("GeneralEducationSearchPage tests", () => {
  let axiosMock;
  let restoreConsole;
  const queryClient = new QueryClient();

  const tableTestId = "GEAreaTable";

  beforeEach(() => {
    restoreConsole = mockConsole();

    axiosMock = new AxiosMockAdapter(axios);
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/public/primariesge")
      .reply(200, primaryFixtures.f24_math_lowerDiv);
  });

  afterEach(() => {
    vi.clearAllMocks();
    axiosMock.restore();
    restoreConsole();
  });

  test("Has the expected cell values when expanded", async () => {
    axiosMock
      .onGet("/api/public/primariesge")
      .reply(200, primaryFixtures.f24_math_lowerDiv);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submit/i }),
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByTestId(`${tableTestId}-row-0-expand-button`),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId(`${tableTestId}-row-0-expand-button`));

    await waitFor(() => {
      expect(
        screen.getByTestId(`${tableTestId}-cell-row-0-col-quarter`),
      ).toHaveTextContent("F24");
      expect(
        screen.getByTestId(`${tableTestId}-cell-row-0.0-col-enrollCode`),
      ).toHaveTextContent("30254");
    });
  });

  test("primariesge GET uses qtr and area in the backend call", async () => {
    axiosMock.onGet("/api/public/primariesge").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submit/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      const primariesgeCalls = axiosMock.history.get.filter((req) =>
        String(req.url).includes("primariesge"),
      );
      expect(primariesgeCalls.length).toBeGreaterThanOrEqual(1);
      expect(primariesgeCalls[primariesgeCalls.length - 1].params).toEqual({
        qtr: "20221",
        area: "ALL",
      });
    });
  });

  test("No courses shows when no courses are found", async () => {
    axiosMock.onGet("/api/public/primariesge").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submit/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      const primariesgeCalls = axiosMock.history.get.filter((req) =>
        String(req.url).includes("primariesge"),
      );
      expect(primariesgeCalls.length).toBeGreaterThanOrEqual(1);
    });

    expect(
      screen.queryByTestId(`${tableTestId}-row-0-expand-button`),
    ).not.toBeInTheDocument();
  });
});
