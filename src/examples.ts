export const result4 = `
WITH source AS (

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
`

export default {}
