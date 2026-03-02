import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import CSVDownloadsPage from "main/pages/CSV/CSVDownloadsPage";

describe("CSVDownloadsPage tests", () => {
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
});
