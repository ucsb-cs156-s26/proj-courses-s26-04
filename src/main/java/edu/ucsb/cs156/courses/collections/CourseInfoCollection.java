package edu.ucsb.cs156.courses.collections;

import edu.ucsb.cs156.courses.documents.CourseInfo;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseInfoCollection extends MongoRepository<CourseInfo, ObjectId> {
  /**
   * Find courses by quarter and search terms.
   *
   * @param searchTerms search terms for the course description or title
   * @param startQuarter starting quarter in yyyyq format
   * @param endQuarter ending quarter in yyyyq format
   * @return
   */
  @Query(
      "{'$or': [{'description': { $regex: ?0, $options: 'i' } }, {'title': { $regex: ?0, $options: 'i' } }], 'quarter': { $gte: ?1, $lte: ?2 } }")
  List<CourseInfo> findBySearchTermsAndQuarterRange(
      String searchTerms, String startQuarter, String endQuarter);
}
