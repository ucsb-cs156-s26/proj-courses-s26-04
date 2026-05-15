package edu.ucsb.cs156.courses.config;

import edu.ucsb.cs156.courses.filters.RateLimitFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RateLimitConfig {

  @Bean
  public RateLimitFilter rateLimitFilter() {
    return new RateLimitFilter();
  }
}
