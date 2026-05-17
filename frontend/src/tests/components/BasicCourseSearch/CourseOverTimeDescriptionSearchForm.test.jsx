import { vi } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheSubjects } from "fixtures/subjectFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeDescriptionSearchForm from "main/components/BasicCourseSearch/CourseOverTimeDescriptionSearchForm";

import { useSystemInfo } from "main/utils/systemInfo";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

vi.mock("main/utils/systemInfo", () => ({
  useSystemInfo: vi.fn(),
}));

describe("CourseOverTimeDescriptionSearchForm tests", () => {
  describe("CourseOverTimeDescriptionSearchForm basic tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const queryClient = new QueryClient();
    const addToast = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
      localStorage.clear();
      vi.spyOn(console, "error");
      console.error.mockImplementation(() => null);

      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      useSystemInfo.mockReturnValue({
        data: systemInfoFixtures.showingNeither,
        isLoading: false,
        isError: false,
      });
      toast.mockReturnValue({
        addToast: addToast,
      });
    });

    test("when I select a start quarter, the state for start quarter changes", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      userEvent.selectOptions(selectStartQuarter, "20201");
      expect(selectStartQuarter.value).toBe("20201");
    });

    test("when I select an end quarter, the state for end quarter changes", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const selectEndQuarter = screen.getByLabelText("End Quarter");
      userEvent.selectOptions(selectEndQuarter, "20204");
      expect(selectEndQuarter.value).toBe("20204");
    });

    test("when I enter search terms, the state for search terms changes", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const searchTermsInput = screen.getByLabelText("Search terms");
      userEvent.type(searchTermsInput, "algorithms");
      expect(searchTermsInput.value).toBe("algorithms");
    });

    test("on submit, endQuarter is the system default string from useState initializer", async () => {
      const fetchJSONSpy = vi.fn();
      fetchJSONSpy.mockResolvedValue({});

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm fetchJSON={fetchJSONSpy} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      userEvent.type(screen.getByLabelText("Search terms"), "algorithms");
      userEvent.click(screen.getByText("Submit"));

      await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

      const payload = fetchJSONSpy.mock.calls[0][1];
      expect(typeof payload.endQuarter).toBe("string");
      expect(payload.endQuarter).toBe(
        systemInfoFixtures.showingNeither.endQtrYYYYQ,
      );
    });

    test("when I select the checkbox, the state for checkbox changes", () => {
      vi.spyOn(Storage.prototype, "setItem");

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const selectCheckbox = screen.getByTestId(
        "CourseOverTimeDescriptionSearchForm-checkbox",
      );
      userEvent.click(selectCheckbox);
      expect(selectCheckbox.checked).toBe(true);
      expect(localStorage.setItem).toBeCalledWith(
        "CourseOverTimeDescriptionSearch.Checkbox",
        "true",
      );
    });

    test("when I click submit, the right stuff happens", async () => {
      axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
      const sampleReturnValue = {
        sampleKey: "sampleValue",
      };

      const fetchJSONSpy = vi.fn();

      fetchJSONSpy.mockResolvedValue(sampleReturnValue);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm fetchJSON={fetchJSONSpy} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const expectedFields = {
        startQuarter: "20211",
        endQuarter: "20214",
        searchTerms: "Data Structures",
        checkbox: true,
      };

      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      userEvent.selectOptions(selectStartQuarter, "20211");
      const selectEndQuarter = screen.getByLabelText("End Quarter");
      userEvent.selectOptions(selectEndQuarter, "20214");
      const searchTermsInput = screen.getByLabelText("Search terms");
      userEvent.type(searchTermsInput, "Data Structures");
      const selectCheckbox = screen.getByTestId(
        "CourseOverTimeDescriptionSearchForm-checkbox",
      );
      userEvent.click(selectCheckbox);
      const submitButton = screen.getByText("Submit");
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

      expect(fetchJSONSpy).toHaveBeenCalledWith(
        expect.any(Object),
        expectedFields,
      );
    });

    test("when I click submit when JSON is EMPTY, setCourse is not called!", async () => {
      axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

      const sampleReturnValue = {
        sampleKey: "sampleValue",
        total: 0,
      };

      const fetchJSONSpy = vi.fn();

      fetchJSONSpy.mockResolvedValue(sampleReturnValue);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm fetchJSON={fetchJSONSpy} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      userEvent.selectOptions(selectStartQuarter, "20204");
      const selectEndQuarter = screen.getByLabelText("End Quarter");
      userEvent.selectOptions(selectEndQuarter, "20204");
      const searchTermsInput = screen.getByLabelText("Search terms");
      userEvent.type(searchTermsInput, "databases");
      const selectCheckbox = screen.getByTestId(
        "CourseOverTimeDescriptionSearchForm-checkbox",
      );
      userEvent.click(selectCheckbox);
      const submitButton = screen.getByText("Submit");
      userEvent.click(submitButton);
    });

    test("Button padding is correct", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const submitButton = screen.getByText("Submit");
      const buttonCol = submitButton.parentElement;
      const buttonRow = buttonCol.parentElement;
      expect(buttonRow).toHaveAttribute(
        "style",
        "padding-top: 10px; padding-bottom: 10px;",
      );
    });

    test("Fallbacks render correctly", () => {
      vi.clearAllMocks();
      axiosMock.reset();
      axiosMock.onGet("/api/systemInfo").reply(500);

      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);

      useSystemInfo.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // Get all of the drop down options
      // Don't confuse the first and last option in the list with the
      // default values of start and end quarter; those are not the same thing!

      // Get just the options for the start quarter
      const startQtrOptions = Array.from(
        screen.getByLabelText("Start Quarter").querySelectorAll("option"),
      );

      expect(startQtrOptions[0].textContent).toBe("W21");
      expect(startQtrOptions[1].textContent).toBe("S21");
      expect(startQtrOptions[2].textContent).toBe("M21");
      expect(startQtrOptions[3].textContent).toBe("F21");
      expect(startQtrOptions.length).toBe(4);

      const startQuarter = screen.getByLabelText("Start Quarter");
      expect(startQuarter.value).toBe("20211");

      // Get all of the drop down options
      const endQtrOptions = Array.from(
        screen.getByLabelText("End Quarter").querySelectorAll("option"),
      );
      expect(endQtrOptions[0].textContent).toBe("W21");
      expect(endQtrOptions[1].textContent).toBe("S21");
      expect(endQtrOptions[2].textContent).toBe("M21");
      expect(endQtrOptions[3].textContent).toBe("F21");
      expect(endQtrOptions.length).toBe(4);

      const endQuarter = screen.getByLabelText("End Quarter");
      expect(endQuarter.value).toBe("20214");
    });
  });
  describe("CourseOverTimeDescriptionSearchForm interactions with local storage", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const queryClient = new QueryClient();

    beforeEach(() => {
      vi.clearAllMocks();
      localStorage.clear();
      vi.spyOn(console, "error");
      console.error.mockImplementation(() => null);

      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      useSystemInfo.mockReturnValue({
        data: systemInfoFixtures.showingNeither,
        isLoading: false,
        isError: false,
      });
    });

    test("renders correctly when local storage has no values", () => {
      const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
      getItemSpy.mockImplementation(() => null);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const bottomRow = screen.getByTestId(
        "CourseOverTimeDescriptionSearchForm-bottom-row",
      );
      expect(bottomRow).toBeInTheDocument();
      expect(bottomRow).toHaveStyle("padding-top: 10px; padding-bottom: 10px;");
      const startQuarter = screen.getByLabelText("Start Quarter");
      expect(startQuarter).toBeInTheDocument();
      expect(startQuarter.value).toBe(
        systemInfoFixtures.showingNeither.startQtrYYYYQ,
      );
      const endQuarter = screen.getByLabelText("End Quarter");
      expect(endQuarter).toBeInTheDocument();
      expect(endQuarter.value).toBe(
        systemInfoFixtures.showingNeither.endQtrYYYYQ,
      );
    });

    it("checks the expected values in local storage", async () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
        switch (key) {
          case "CourseOverTimeDescriptionSearch.StartQuarter":
            return "20211";
          case "CourseOverTimeDescriptionSearch.EndQuarter":
            return "20214";
          case "CourseOverTimeDescriptionSearch.SearchTerms":
            return "algorithms";
          case "CourseOverTimeDescriptionSearch.Checkbox":
            return "true";
          default:
            return null;
        }
      });
      const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      expect(getItemSpy).toHaveBeenCalledWith(
        "CourseOverTimeDescriptionSearch.StartQuarter",
      );
      expect(getItemSpy).toHaveBeenCalledWith(
        "CourseOverTimeDescriptionSearch.EndQuarter",
      );
      expect(getItemSpy).toHaveBeenCalledWith(
        "CourseOverTimeDescriptionSearch.SearchTerms",
      );
      expect(getItemSpy).toHaveBeenCalledWith(
        "CourseOverTimeDescriptionSearch.Checkbox",
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Start Quarter").value).toBe("20211");
      });

      expect(screen.getByLabelText("End Quarter").value).toBe("20214");
      expect(screen.getByLabelText("Search terms").value).toBe("algorithms");
      expect(
        screen.getByTestId("CourseOverTimeDescriptionSearchForm-checkbox")
          .checked,
      ).toBe(true);
    });

    test("when local storage is completely empty, it defaults to the system info quarters", async () => {
      // Clear local storage and mock getItem to ensure all values are null
      localStorage.clear();
      vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

      // We are using systemInfoFixtures.showingBoth, which has startQtrYYYYQ as "20221"
      // and endQtrYYYYQ as "20222".
      // We expect the dropdowns to be initialized to these values.
      useSystemInfo.mockReturnValue({
        data: {
          startQtrYYYYQ: "20221",
          endQtrYYYYQ: "20222",
        },
        isLoading: false,
        isError: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // Wait for the component to render and the state to be initialized
      await waitFor(() => {
        expect(screen.getByLabelText("Start Quarter")).toBeInTheDocument();
      });

      const startQuarterDropdown = screen.getByLabelText("Start Quarter");
      const endQuarterDropdown = screen.getByLabelText("End Quarter");

      expect(startQuarterDropdown.value).toBe("20221");
      expect(endQuarterDropdown).toBeInTheDocument();
      expect(endQuarterDropdown.value).toBe("20222");

      expect(localStorage.getItem).toHaveBeenCalledWith(
        "CourseOverTimeDescriptionSearch.StartQuarter",
      );
      expect(localStorage.getItem).toHaveBeenCalledWith(
        "CourseOverTimeDescriptionSearch.EndQuarter",
      );
      expect(localStorage.getItem).toHaveBeenCalledWith(
        "CourseOverTimeDescriptionSearch.SearchTerms",
      );
    });
  });
});
