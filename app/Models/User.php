<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'jabatan'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isSuperadmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function isPanitia(): bool
    {
        return $this->role === 'panitia';
    }

    public function roleLabel(): string
    {
        return $this->isSuperadmin() ? 'Superadmin BPS Subang' : 'Panitia Seleksi';
    }

    public function initials(): string
    {
        $parts = preg_split('/\s+/', trim($this->name)) ?: ['U'];
        $first = strtoupper(substr($parts[0], 0, 1));
        $second = isset($parts[1]) ? strtoupper(substr($parts[1], 0, 1)) : strtoupper(substr($parts[0], 1, 1));

        return $first.$second;
    }
}
