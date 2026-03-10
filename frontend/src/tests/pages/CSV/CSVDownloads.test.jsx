import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import CSVDownloadsPage from "main/pages/CSV/CSVDownloadsPage";

describe("CSVDownloadsPage tests", () => {
  const originalLocation = window.location;

  afterEach(() => {
    delete window.location;
    window.location = originalLocation;
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

  test("renders correctly", async () => {
    renderPage();

    expect(await screen.findByText("CSV Downloads")).toBeInTheDocument();
  });

  test("download links are enabled only for valid input", async () => {
    renderPage();

    const byQuarterButton = screen.getAllByRole("button", {
      name: "Download CSV",
    })[0];
    expect(byQuarterButton).toBeDisabled();

    const quarterInputs = screen.getAllByLabelText("Quarter (yyyyq)");
    fireEvent.change(quarterInputs[0], { target: { value: "20261" } });

    expect(byQuarterButton).not.toBeDisabled();

    userEvent.click(
      screen.getByRole("button", {
        name: "Download all UCSB classes by Quarter and Subject Area",
      }),
    );

    const allDownloadButtons = screen.getAllByRole("button", {
      name: "Download CSV",
    });
    const byQuarterAndSubjectButton = allDownloadButtons[1];
    expect(byQuarterAndSubjectButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Subject Area"), {
      target: { value: "cmpsc" },
    });

    expect(byQuarterAndSubjectButton).not.toBeDisabled();
  });

  test("submitting by-quarter form only downloads when quarter is valid", () => {
    const assignMock = vi.fn();
    delete window.location;
    window.location = Object.assign(new URL("http://localhost:3000"), {
      assign: assignMock,
    });

    renderPage();

    const byQuarterButton = screen.getAllByRole("button", {
      name: "Download CSV",
    })[0];
    const byQuarterForm = byQuarterButton.closest("form");

    fireEvent.submit(byQuarterForm);
    expect(assignMock).not.toHaveBeenCalled();

    const quarterInputs = screen.getAllByLabelText("Quarter (yyyyq)");
    fireEvent.change(quarterInputs[0], { target: { value: " 20261 " } });

    fireEvent.click(byQuarterButton);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/quarter?yyyyq=20261",
    );
  });

  test("submitting by-quarter-and-subject form requires valid quarter and subject", () => {
    const assignMock = vi.fn();
    delete window.location;
    window.location = Object.assign(new URL("http://localhost:3000"), {
      assign: assignMock,
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
    expect(assignMock).not.toHaveBeenCalled();

    const quarterInputs = screen.getAllByLabelText("Quarter (yyyyq)");
    fireEvent.change(quarterInputs[1], { target: { value: "20261" } });

    fireEvent.submit(byQuarterAndSubjectForm);
    expect(assignMock).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Subject Area"), {
      target: { value: " cmpsc " },
    });

    fireEvent.click(byQuarterAndSubjectButton);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/byQuarterAndSubjectArea?yyyyq=20261&subjectArea=CMPSC",
    );
  });
});
