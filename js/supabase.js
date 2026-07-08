import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://vlbtnsrynwmobltrbomk.supabase.co";

const supabaseKey = "sb_publishable_P6pNQSLejO26fp6lPprmPw_FSNN0Zi4";

export const supabase = createClient(

    supabaseUrl,

    supabaseKey

);
console.log(supabase);