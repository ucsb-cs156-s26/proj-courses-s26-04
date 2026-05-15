import { vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import primaryFixtures from "fixtures/primaryFixtures";
import GEAreaTable from "main/components/GEAreas/GEAreaTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockedNavigate,
}));

describe("GEAreaTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GEAreaTable generalEducation={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("cannot expand rows with no sub rows", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GEAreaTable
            generalEducation={
              primaryFixtures.singleLectureSectionWithNoDiscussion
            }
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      screen.getByTestId("GEAreaTable-row-0-cannot-expand"),
    ).toBeInTheDocument();
  });

  test("has the expected column headers expand toggles and formatted cells", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GEAreaTable generalEducation={primaryFixtures.f24_math_lowerDiv} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "GEAreaTable";

    [
      "Quarter",
      "Course ID",
      "Title",
      "Status",
      "Enrolled",
      "Location",
      "Days",
      "Time",
      "Instructor",
      "Enroll Code",
      "Info",
    ].forEach((label) => {
      expect(screen.getByRole("columnheader", { name: label })).toBeInTheDocument();
    });

    const expandAll = screen.getByTestId(`${testId}-expand-all-rows`);
    expect(expandAll).toHaveTextContent("➕");
    fireEvent.click(expandAll);
    await waitFor(() => expect(expandAll).toHaveTextContent("➖"));
    fireEvent.click(expandAll);
    await waitFor(() => expect(expandAll).toHaveTextContent("➕"));

    const row0Expand = screen.getByTestId(`${testId}-row-0-expand-button`);
    expect(row0Expand).toHaveAttribute("style", "cursor: pointer;");
    expect(row0Expand).toHaveTextContent("➕");
    fireEvent.click(row0Expand);
    await waitFor(() => expect(row0Expand).toHaveTextContent("➖"));

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-row-1-cannot-expand`),
      ).toBeInTheDocument();
    });

    const row0Quarter = screen.getByTestId(`${testId}-cell-row-0-col-quarter`);
    expect(row0Quarter).toHaveTextContent("F24");

    const detailLink = within(
      screen.getByTestId(`${testId}-cell-row-0-col-courseId`),
    ).getByTestId(`${testId}-row-0-col-detail-link`);
    expect(detailLink).toHaveAttribute(
      "href",
      "/coursedetails/20244/30247",
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-title`),
    ).toHaveTextContent("CALC W/ ALG & TRIG");

    expect(screen.getByTestId(`${testId}-cell-row-0-col-status`)).toHaveTextContent(
      "Open",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
    ).toHaveTextContent("172/175");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-location`),
    ).toHaveTextContent("ILP 2101");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-days`)).toHaveTextContent(
      "M W F",
    );
    expect(screen.getByTestId(`${testId}-cell-row-0-col-time`).textContent).toMatch(
      /8:00.*8:50/i,
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
    ).toHaveTextContent("PORTER M J");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-enrollCode`),
    ).toHaveTextContent("30247");

    expect(
      within(screen.getByTestId(`${testId}-cell-row-0-col-info`)).getByTestId(
        `${testId}-row-0-col-info-link`,
      ),
    ).toHaveAttribute("href", "/coursedetails/20244/30247");

    const row1CourseId = screen.getByTestId(`${testId}-cell-row-1-col-courseId`);
    expect(row1CourseId).toHaveTextContent("MATH 3A");
  });
});
