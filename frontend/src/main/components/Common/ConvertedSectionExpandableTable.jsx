import SectionsTableBase from "main/components/SectionsTableBase";
import { yyyyqToQyy } from "main/utils/quarterUtilities";
import {
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  formatStatus,
  enrollmentFraction,
  getSection,
  getSectionField,
} from "main/utils/sectionUtils.jsx";

function convertToPrimaryRows(sections) {
  const groups = {};

  sections.forEach(({ courseInfo, section }) => {
    const lectureGroup = Math.floor(Number(section.section) / 100);
    const key = `${courseInfo.quarter}-${courseInfo.courseId}-${lectureGroup}`;

    if (!groups[key]) {
      groups[key] = {
        quarter: courseInfo.quarter,
        courseId: courseInfo.courseId,
        title: courseInfo.title,
        description: courseInfo.description,
        primary: null,
        subRows: [],
      };
    }

    if (section.section.endsWith("00")) {
      groups[key].primary = section;
    } else {
      groups[key].subRows.push(section);
    }
  });

  return Object.values(groups).filter((group) => group.primary);
}

function ConvertedSectionExpandableTable({
  sections,
  testid = "ConvertedSectionExpandableTable",
}) {
  const convertedSections = convertToPrimaryRows(sections);
  const columns = [
    {
      id: "expander",
      header: ({ table }) => (
        <button
          data-testid={`${testid}-expand-all-rows`}
          onClick={table.getToggleAllRowsExpandedHandler()}
        >
          {table.getIsAllRowsExpanded() ? "➖" : "➕"}
        </button>
      ),
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button
            data-testid={`${testid}-row-${row.index}-expand-button`}
            onClick={row.getToggleExpandedHandler()}
            style={{ cursor: "pointer" }}
          >
            {row.getIsExpanded() ? "➖" : "➕"}
          </button>
        ) : (
          <span data-testid={`${testid}-row-${row.index}-cannot-expand`} />
        ),
    },
    {
      header: "Quarter",
      accessorKey: "quarter",
      cell: ({ row }) =>
        row.original.quarter ? yyyyqToQyy(row.original.quarter) : "",
    },
    {
      header: "CourseId",
      accessorKey: "courseId",
      cell: ({ row }) => row.original.courseId ?? "",
    },
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => row.original.title ?? "",
    },
    {
      header: "EnrollCd",
      accessorKey: "enrollCode",
      cell: ({ row }) => getSectionField(row, "enrollCode"),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => formatStatus(getSection(row)),
    },
    {
      header: "Enrolled",
      accessorKey: "enrolled",
      cell: ({ row }) => enrollmentFraction(row),
    },
    {
      header: "Days",
      accessorKey: "days",
      cell: ({ row }) => formatDays(getSection(row).timeLocations),
    },
    {
      header: "Time",
      accessorKey: "time",
      cell: ({ row }) => formatTime(getSection(row).timeLocations),
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: ({ row }) => formatLocation(getSection(row).timeLocations),
    },
    {
      header: "Instructors",
      accessorKey: "instructors",
      cell: ({ row }) => formatInstructors(getSection(row).instructors),
    },
    {
      header: "Section",
      accessorKey: "section",
      cell: ({ row }) => getSectionField(row, "section"),
    },
  ];

  return (
    <SectionsTableBase
      data={convertedSections}
      columns={columns}
      testid={testid}
    />
  );
}

export default ConvertedSectionExpandableTable;
