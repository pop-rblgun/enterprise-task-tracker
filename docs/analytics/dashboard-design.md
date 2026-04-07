# Analytics & BI Strategy

This document outlines the Business Intelligence requirements and data strategy for the Task Tracker.

## Key Performance Indicators (KPIs)

To measure team efficiency, the following metrics are tracked:

1.  **Lead Time**: Time from task creation to `Done`.
2.  **Cycle Time**: Time from `InProgress` to `Review`.
3.  **Throughput**: Number of tasks completed per week/month.
4.  **Work In Progress (WIP)**: Number of tasks currently in `InProgress` or `Review`.
5.  **Quality Index**: Ratio of tasks moving from `Review` back to `InProgress`.

## Dashboard Design Concept

### 1. Executive Summary (High Level)
*   Total Active Projects.
*   Budget/Resource Utilization (Estimated).
*   High-level status distribution (Pie Chart).

### 2. Team Velocity (Mid Level)
*   Tasks completed per sprint/week (Bar Chart).
*   Comparison of estimated vs. actual time.

## Data Layer for Big Data

For an enterprise with 10,000+ users, the analytic data is offloaded to a **Data Lake** to prevent performance degradation of the transactional DB.

### Proposed Architecture
*   **Source**: SQL Server / Postgres (Transactional).
*   **Ingestion**: CDC (Change Data Capture) via **Apache Kafka**.
*   **Storage**: **Hadoop HDFS** or S3 in Parquet format.
*   **Processing**: **Apache Spark** for nightly batch jobs calculating KPIs.
*   **Serving**: **ClickHouse** or Snowflake for real-time dashboard queries.

## Example Metrics Query (SQL)

```sql
-- Calculate Average Cycle Time per Project
SELECT 
    ProjectId, 
    AVG(DATEDIFF(day, StartDate, EndDate)) as AvgCycleTime
FROM TaskAuditLogs
WHERE EventType = 'StatusChanged' AND NewStatus = 'Done'
GROUP BY ProjectId;
```
