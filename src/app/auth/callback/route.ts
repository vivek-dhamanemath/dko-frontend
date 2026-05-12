import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
        // Redirect to login page with error info
        return NextResponse.redirect(
            `${origin}?error=${encodeURIComponent(errorDescription || error)}`
        );
    }

    if (code) {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (!exchangeError) {
            return NextResponse.redirect(origin);
        }
    }

    // Fallback redirect to home
    return NextResponse.redirect(`${origin}?error=Could+not+verify+email`);
}
