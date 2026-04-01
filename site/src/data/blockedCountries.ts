// ISO 3166-1 alpha-2 codes for countries where ticket purchases ARE available
export const ALLOWED_COUNTRY_CODES = new Set([
    // Caribbean
    'AG', 'BS', 'BB', 'KN',
    // East Asia
    'JP', 'KR',
    // Europe
    'AD', 'AT', 'BE', 'BA', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE',
    'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'MC', 'NL',
    'NO', 'PL', 'PT', 'RO', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'GB',
    // Middle East
    'BH', 'IL', 'KW', 'OM', 'QA', 'SA', 'AE',
    // North America
    'CA', 'US',
    // Oceania
    'AU', 'NZ',
    // Southeast Asia
    'SG',
    // Africa
    'ZA',
])

// Keep blocked export for backwards compatibility with cloud function
export const BLOCKED_COUNTRY_CODES = ALLOWED_COUNTRY_CODES
