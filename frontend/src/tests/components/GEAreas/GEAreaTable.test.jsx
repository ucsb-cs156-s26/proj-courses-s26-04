import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
          <GEAreaTable generalEducation={[]} schedules={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected column headers and content", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GEAreaTable
            generalEducation={primaryFixtures.f24_math_lowerDiv}
            schedules={[]}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const testId = "GEAreaTable";

    expect(screen.getByTestId(`${testId}-expand-all-rows`)).toBeInTheDocument();

    [
      "quarter",
      "courseId",
      "title",
      "status",
      "enrolled",
      "location",
      "days",
      "time",
      "instructor",
      "enrollCode",
      "info",
    ].forEach((colId) => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-${colId}`),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("F24");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-title`),
    ).toHaveTextContent("CALC W/ ALG & TRIG");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-courseId`),
    ).toHaveTextContent("MATH 3A");
  });
});
