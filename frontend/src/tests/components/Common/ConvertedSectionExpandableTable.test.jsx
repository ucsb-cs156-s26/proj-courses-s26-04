import { fireEvent, render, screen } from "@testing-library/react";
import ConvertedSectionExpandableTable from "main/components/Common/ConvertedSectionExpandableTable";
import { oneSection, threeSections } from "fixtures/sectionFixtures";

describe("ConvertedSectionExpandableTable tests", () => {
  test("renders with expected headers", () => {
    render(<ConvertedSectionExpandableTable sections={[]} />);

    expect(
      screen.getByTestId("ConvertedSectionExpandableTable"),
    ).toBeInTheDocument();

    [
      "Quarter",
      "CourseId",
      "Title",
      "EnrollCd",
      "Status",
      "Enrolled",
      "Days",
      "Time",
      "Location",
      "Instructors",
      "Section",
    ].forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  test("renders a primary row with no subrows", () => {
    const testid = "ExpandableTable";
    render(
      <ConvertedSectionExpandableTable sections={oneSection} testid={testid} />,
    );

    expect(
      screen.getByTestId(`${testid}-row-0-cannot-expand`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-quarter`),
    ).toHaveTextContent("W22");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-courseId`),
    ).toHaveTextContent("ECE 1A -1");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-title`),
    ).toHaveTextContent("COMP ENGR SEMINAR");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-enrollCode`),
    ).toHaveTextContent("12583");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-status`),
    ).toHaveTextContent("Open");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-enrolled`),
    ).toHaveTextContent("84/100");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-days`),
    ).toHaveTextContent("M");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-time`),
    ).toHaveTextContent("3:00 PM - 3:50 PM");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-location`),
    ).toHaveTextContent("BUCHN 1930");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-instructors`),
    ).toHaveTextContent("WANG L C");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-section`),
    ).toHaveTextContent("0100");
  });

  test("hides child rows until parent row is expanded", () => {
    const testid = "ExpandableTable";
    render(
      <ConvertedSectionExpandableTable
        sections={threeSections}
        testid={testid}
      />,
    );

    expect(screen.getByText("12591")).toBeInTheDocument();
    expect(screen.queryByText("12609")).not.toBeInTheDocument();

    const expandButton = screen.getByTestId(`${testid}-row-1-expand-button`);
    expect(expandButton).toHaveTextContent("➕");
    expect(expandButton).toHaveStyle({ cursor: "pointer" });
    fireEvent.click(expandButton);
    expect(expandButton).toHaveTextContent("➖");

    expect(screen.getByText("12609")).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-title`),
    ).toHaveTextContent("INTRO TO ECE");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-status`),
    ).toHaveTextContent("Full");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-enrolled`),
    ).toHaveTextContent("84/80");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-days`),
    ).toHaveTextContent("M W");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-time`),
    ).toHaveTextContent("3:30 PM - 4:45 PM");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-location`),
    ).toHaveTextContent("PHELP 1260");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-instructors`),
    ).toHaveTextContent("HESPANHA J P");
    expect(
      screen.getByTestId(`${testid}-cell-row-1.0-col-quarter`),
    ).toBeEmptyDOMElement();
    expect(
      screen.getByTestId(`${testid}-cell-row-1.0-col-courseId`),
    ).toBeEmptyDOMElement();
    expect(
      screen.getByTestId(`${testid}-cell-row-1.0-col-title`),
    ).toBeEmptyDOMElement();
    expect(
      screen.getByTestId(`${testid}-cell-row-1.0-col-status`),
    ).toHaveTextContent("Full");
    expect(
      screen.getByTestId(`${testid}-cell-row-1.0-col-enrolled`),
    ).toHaveTextContent("21/21");
    expect(
      screen.getByTestId(`${testid}-cell-row-1.0-col-days`),
    ).toHaveTextContent("F");
    expect(
      screen.getByTestId(`${testid}-cell-row-1.0-col-time`),
    ).toHaveTextContent("12:00 PM - 2:50 PM");
    expect(
      screen.getByTestId(`${testid}-cell-row-1.0-col-location`),
    ).toHaveTextContent("HFH 1124");
    expect(
      screen.getByTestId(`${testid}-cell-row-1.0-col-instructors`),
    ).toHaveTextContent("YUNG A S");
    expect(
      screen.getByTestId(`${testid}-cell-row-1.0-col-section`),
    ).toHaveTextContent("0101");
  });

  test("expand all button reveals child rows", () => {
    const testid = "ExpandableTable";
    render(
      <ConvertedSectionExpandableTable
        sections={threeSections}
        testid={testid}
      />,
    );

    const expandAll = screen.getByTestId(`${testid}-expand-all-rows`);
    expect(expandAll).toHaveTextContent("➕");

    fireEvent.click(expandAll);

    expect(expandAll).toHaveTextContent("➖");
    expect(screen.getByText("12609")).toBeInTheDocument();
  });

  test("ignores secondary sections without a matching primary", () => {
    const secondaryOnly = [
      {
        ...threeSections[2],
      },
    ];

    render(
      <ConvertedSectionExpandableTable
        sections={secondaryOnly}
        testid="ExpandableTable"
      />,
    );

    expect(screen.queryByText("12609")).not.toBeInTheDocument();
  });
});
