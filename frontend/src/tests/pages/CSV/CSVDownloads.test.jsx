import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import CSVDownloadsPage from "main/pages/CSV/CSVDownloadsPage";

const { mockUseSystemInfo, mockUseBackend } = vi.hoisted(() => ({
  mockUseSystemInfo: vi.fn(),
  mockUseBackend: vi.fn(),
}));

vi.mock("main/utils/currentUser", () => ({
  useCurrentUser: () => ({
    data: {
      loggedIn: true,
      root: {
        user: {
          email: "test@example.com",
        },
        roles: [{ authority: "ROLE_ADMIN" }],
      },
    },
  }),
  useLogout: () => ({
    mutate: vi.fn(),
  }),
  hasRole: () => true,
}));

vi.mock("main/utils/systemInfo", () => ({
  useSystemInfo: () => mockUseSystemInfo(),
}));

vi.mock("main/utils/useBackend", () => ({
  useBackend: (...args) => mockUseBackend(...args),
}));

describe("CSVDownloadsPage tests", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    mockUseBackend.mockClear();
    mockUseSystemInfo.mockClear();
    mockUseSystemInfo.mockReturnValue({
      data: {
        startQtrYYYYQ: "20241",
        endQtrYYYYQ: "20242",
      },
    });

    mockUseBackend.mockReturnValue({
      data: [
        {
          subjectCode: "CMPSC",
          subjectTranslation: "Computer Science",
        },
      ],
      error: null,
      status: "success",
    });
  });

  afterEach(() => {
    delete window.location;
    window.location = originalLocation;
    localStorage.clear();
  });

  const renderPage = () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CSVDownloadsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  const mockLocationAssign = () => {
    const assignMock = vi.fn();
    delete window.location;
    window.location = Object.assign(new URL("http://localhost:3000"), {
      assign: assignMock,
    });
    return assignMock;
  };

  test("renders correctly", async () => {
    renderPage();

    expect(await screen.findByText("CSV Downloads")).toBeInTheDocument();

    expect(mockUseBackend).toHaveBeenCalledWith(
      ["/api/UCSBSubjects/all"],
      { method: "GET", url: "/api/UCSBSubjects/all" },
      [],
    );
  });

  test("submitting by-quarter form downloads selected quarter", () => {
    const assignMock = mockLocationAssign();
    renderPage();

    const quarterDropdown = screen.getAllByLabelText("Quarter (yyyyq)")[0];
    const byQuarterButton = screen.getAllByRole("button", {
      name: "Download CSV",
    })[0];
    const byQuarterForm = byQuarterButton.closest("form");

    fireEvent.change(quarterDropdown, { target: { value: "20241" } });
    fireEvent.submit(byQuarterForm);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/quarter?yyyyq=20241",
    );
  });

  test("submitting by-quarter-and-subject form includes all selected parameters", () => {
    const assignMock = mockLocationAssign();
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Download all UCSB classes by Quarter and Subject Area",
      }),
    );

    const allDownloadButtons = screen.getAllByRole("button", {
      name: "Download CSV",
    });
    const byQuarterAndSubjectButton = allDownloadButtons[1];
    const byQuarterAndSubjectForm = byQuarterAndSubjectButton.closest("form");

    const quarterDropdown = screen.getAllByLabelText("Quarter (yyyyq)")[1];
    const subjectDropdown = screen.getByLabelText("Subject Area");
    const levelDropdown = screen.getByLabelText("Course Level");
    const omitSectionsCheckbox = screen.getByLabelText("Omit sections");
    const withTimeLocationsCheckbox = screen.getByLabelText(
      "With time/locations",
    );

    fireEvent.change(quarterDropdown, { target: { value: "20241" } });
    fireEvent.change(subjectDropdown, { target: { value: "CMPSC" } });
    fireEvent.change(levelDropdown, { target: { value: "G" } });
    fireEvent.click(omitSectionsCheckbox);
    fireEvent.click(withTimeLocationsCheckbox);

    expect(omitSectionsCheckbox).not.toBeChecked();
    expect(withTimeLocationsCheckbox).not.toBeChecked();

    fireEvent.submit(byQuarterAndSubjectForm);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/byQuarterAndSubjectArea?yyyyq=20241&subjectArea=CMPSC&level=G&omitSections=false&withTimeLocations=false",
    );
  });

  test("uses fallback quarter and subject values when backend data is missing", () => {
    const assignMock = mockLocationAssign();

    mockUseSystemInfo.mockReturnValue({
      data: undefined,
    });

    mockUseBackend.mockReturnValue({
      data: [],
      error: null,
      status: "success",
    });

    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Download all UCSB classes by Quarter and Subject Area",
      }),
    );

    const allDownloadButtons = screen.getAllByRole("button", {
      name: "Download CSV",
    });
    const byQuarterAndSubjectButton = allDownloadButtons[1];
    const byQuarterAndSubjectForm = byQuarterAndSubjectButton.closest("form");

    fireEvent.submit(byQuarterAndSubjectForm);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/byQuarterAndSubjectArea?yyyyq=20214&subjectArea=ANTH&level=U&omitSections=true&withTimeLocations=true",
    );
  });
});
