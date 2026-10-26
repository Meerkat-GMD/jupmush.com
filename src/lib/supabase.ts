import { createClient } from '@supabase/supabase-js'

// The game's publishable key: it may insert runs and read nothing. Reading needs an account flagged playdata_admin
// (PaperVillage tools/PlayData/schema.sql), so the admin pages hold no secret.
export const supabase = createClient('https://fctpvxgebtjmaxocbsxg.supabase.co', 'sb_publishable_oeaIdUG0RfqIajvptT1bSw_3gBPks9B')
