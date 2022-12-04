const demoExamples = [
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
  }
]
export default demoExamples
