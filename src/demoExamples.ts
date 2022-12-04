type Example = {
  prompt: string
  result: string
  explanation: string
}

const demoExamples: Example[] = [
  {
    // Scenario 1: Summarize code
    prompt: 'Explain this',
    result: '',
    explanation: `
    This DBT schema file defines three models: mart_ci_runner_activity_monthly, mart_ci_runner_activity_daily, and mart_product_usage_free_user_metrics_monthly. Each model has a description and a list of columns, along with tests for some of the columns.

    The mart_ci_runner_activity_monthly model contains information about monthly CI runner activity, including data about namespaces, plans, runners, pipelines, and stages.
    
    The mart_ci_runner_activity_daily model contains similar information, but at a daily granularity.
    
    The mart_product_usage_free_user_metrics_monthly model contains information about product usage by free trial users, including data about namespaces, CRM accounts, versions, and metrics related to user activity.
    `
  },
  {
    // Scenario 2: edit dbt code
    prompt: 'Convert timezones to pst',
    result: `
  SELECT
    fact.*,
    dim_namespace.namespace_type AS ultimate_parent_namespace_type,
    dim_namespace.namespace_is_internal,
    dim_namespace.namespace_creator_is_blocked,
    convert_timezone(dim_namespace.created_at, 'US/Pacific') AS namespace_created_at,
    CAST(convert_timezone(dim_namespace.created_at, 'US/Pacific') AS DATE) AS namespace_created_date,
    convert_timezone(dim_user.created_at, 'US/Pacific') AS user_created_at,
    COALESCE(dim_project.is_learn_gitlab, FALSE) AS project_is_learn_gitlab,
    COALESCE(dim_project.is_imported, FALSE) AS project_is_imported,
    dim_date.first_day_of_month AS event_calendar_month,
    dim_date.quarter_name AS event_calendar_quarter,
    dim_date.year_actual AS event_calendar_year
FROM fact
LEFT JOIN dim_namespace
    ON fact.dim_ultimate_parent_namespace_id = dim_namespace.dim_namespace_id
LEFT JOIN dim_user
    ON fact.dim_user_sk = dim_user.dim_user_sk
LEFT JOIN dim_project
    ON fact.dim_project_id = dim_project.dim_project_id
LEFT JOIN dim_date
    ON fact.dim_event_date_id = dim_date.date_id
  `,
    explanation: `
  In the example above, the convert_timezone() function is used to convert the created_at field in the dim_namespace and dim_user tables to Pacific Time. The converted date/time is then stored in the namespace_created_at and user_created_at fields, respectively.

  Keep in mind that the convert_timezone() function will only work correctly if the input date/time field is in a time zone that is recognized by dbt. If the input time zone is not recognized, the function will return the input date/time without converting it to the specified time zone.
  `
  },
  {
    // Scenario 3: Define a metric
    prompt: 'Define monthly recurring revenue',
    result: `

    {% set num_active_customers = (
      SELECT COUNT(DISTINCT dim_crm_account.dim_crm_account_id)
      FROM dim_crm_account
      WHERE dim_crm_account.parent_crm_account_billing_country_code IN ('US', 'CA')
      AND dim_crm_account.parent_crm_account_is_active = 1
      AND dim_crm_account.parent_crm_account_employee_count_band IS NOT NULL
  ) %}
  
  {% set arpc = (
      SELECT AVG(fct_crm_account.parent_crm_account_total_mrv)
      FROM fct_crm_account
      WHERE fct_crm_account.parent_crm_account_billing_country_code IN ('US', 'CA')
      AND fct_crm_account.parent_crm_account_is_active = 1
      AND fct_crm_account.parent_crm_account_employee_count_band IS NOT NULL
  ) %}
  
  SELECT
     fct_crm_account.report_date,
     {{ num_active_customers }} * {{ arpc }} AS monthly_recurring_revenue
  FROM fct_crm_account
`,
    explanation: `
  Monthly recurring revenue is the amount of money a company expects to receive on a regular basis from its customers. This can be calculated by multiplying the number of active customers by the average revenue per customer (ARPC) for a given period, typically a month. To define monthly recurring revenue in the given dbt model, you could add a new metric that calculates the monthly recurring revenue for each day.
\n
This code defines the num_active_customers and arpc variables, which represent the number of active customers and the average revenue per customer, respectively. It then calculates the monthly recurring revenue by multiplying these two values and returns the result for each day in the fct_crm_account table. You could then include this code in a dbt_metrics block to define the monthly_recurring_revenue metric.
`
  },
  {
    // Scenario 4: Create a transformation to make data more readable
    prompt:
      'Create a table that returns the following fields: company_id, is_headquarters, employees, estimated_age, is_b2b, is_b2c. Only return results for companies within 5 miles of San Francisco',
    result: `WITH source AS (

    SELECT *
    FROM {{ source('zoominfo', 'global') }}
  
  ),
  
  renamed AS (
  
    SELECT
      zi_c_location_id::NUMBER AS location_id,
      zi_c_company_id::NUMBER AS company_id,
      zi_c_is_hq::BOOLEAN AS is_headquarters,
      zi_c_latitude::FLOAT AS company_latitude,
      zi_c_longitude::FLOAT AS company_longitude,
      zi_c_employees::NUMBER AS employees,
      zi_c_estimated_age::NUMBER AS estimated_age,
      zi_c_is_b2b::BOOLEAN AS is_b2b,
      zi_c_is_b2c::BOOLEAN AS is_b2c
    FROM source
  )
  
  SELECT
    company_id,
    is_headquarters,
    employees,
    estimated_age,
    is_b2b,
    is_b2c
  FROM renamed
  WHERE
    -- San Francisco latitude and longitude
    company_latitude BETWEEN 37.7080 and 37.8199
    AND company_longitude BETWEEN -122.5151 and -122.3568
`,
    explanation:
      'Note that this query will only return companies within a rectangular area defined by the minimum and maximum latitude and longitude coordinates. To return companies within a true 5-mile radius, a more complex query would be needed that takes into account the curvature of the Earth and uses a geospatial distance function.'
  },
  {
    // scenario 5: add documentation to code
    prompt: 'Add documentation to each column',
    result: `sql
    WITH sfdc_user AS (
        SELECT *
        FROM {{ ref(‘prep_crm_user’) }}
        WHERE is_active = ‘TRUE’
    ), final_sales_hierarchy AS (
        SELECT DISTINCT
          {{ dbt_utils.surrogate_key([‘crm_user_sales_segment_geo_region_area’]) }}   AS dim_crm_user_hierarchy_live_id,
          dim_crm_user_sales_segment_id,
          crm_user_sales_segment,
          crm_user_sales_segment_grouped,
          dim_crm_user_geo_id,
          crm_user_geo,
          dim_crm_user_region_id,
          crm_user_region,
          dim_crm_user_area_id,
          crm_user_area,
          crm_user_sales_segment_geo_region_area,
          crm_user_sales_segment_region_grouped
        FROM sfdc_user
        WHERE crm_user_sales_segment IS NOT NULL
          AND crm_user_geo IS NOT NULL
          AND crm_user_region IS NOT NULL
          AND crm_user_area IS NOT NULL
          AND crm_user_region <> ‘Sales Admin’
    )
    `,
    explanation: ''
  }
]
export default demoExamples
