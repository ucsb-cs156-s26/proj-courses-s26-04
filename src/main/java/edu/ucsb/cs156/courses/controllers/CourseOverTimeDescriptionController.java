package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/courseovertime")
public class CourseOverTimeDescriptionController {

  private ObjectMapper mapper = new ObjectMapper();

  @Autowired ConvertedSectionCollection convertedSectionCollection;

  @Operation(
      summary = "Get a list of courses over time, filtered by course description search terms")
  @GetMapping(value = "/descriptionsearch", produces = "application/json")
  public ResponseEntity<String> search(
      @Parameter(
              name = "searchTerms",
              description =
                  "Search terms for the course description or title, e.g. 'Computer Science' OR 'Data Structures'",
              example = "Computer Science",
              required = true)
          @RequestParam(required = true)
          String searchTerms,
      @Parameter(
              name = "startQtr",
              description =
                  "Starting quarter in yyyyq format, e.g. 20231 for W23, 20232 for S23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
              example = "20231",
              required = true)
          @RequestParam
          String startQtr,
      @Parameter(
              name = "endQtr",
              description =
                  "Ending quarter in yyyyq format, e.g. 20231 for W23, 20232 for S23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
              example = "20231",
              required = true)
          @RequestParam
          String endQtr,
      @Parameter(
              name = "lectureOnly",
              description = "Lectures only",
              example = "true",
              required = true)
          @RequestParam
          boolean lectureOnly)
      throws JsonProcessingException {
    List<ConvertedSection> courseResults;
    if (lectureOnly) {
      courseResults =
          convertedSectionCollection.findBySearchTermsAndQuarterRange(
              searchTerms, startQtr, endQtr, "^(Lecture)");
    } else {
      courseResults =
          convertedSectionCollection.findBySearchTermsAndQuarterRange(
              searchTerms, startQtr, endQtr, "^.*");
    }
    courseResults.sort(new ConvertedSection.ConvertedSectionSortDescendingByQuarterComparator());
    String body = mapper.writeValueAsString(courseResults);
    return ResponseEntity.ok().body(body);
  }
}
