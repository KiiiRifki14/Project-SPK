<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSuperadmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->isSuperadmin()) {
            if ($request->expectsJson()) {
                abort(403, 'Akses ditolak. Fitur ini hanya untuk Superadmin BPS Subang.');
            }

            return redirect()->back()->with('alert', [
                'type' => 'error',
                'message' => 'Akses ditolak! Fitur ini hanya dapat dilakukan oleh Superadmin BPS Subang.',
            ]);
        }

        return $next($request);
    }
}
