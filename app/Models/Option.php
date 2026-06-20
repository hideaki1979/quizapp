<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['quiz_id', 'content', 'is_correct'])]

class Option extends Model
{
    /** @return BelongsTo<Quiz, $this> */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean', // TINYINT(1) → bool（設計§9）
        ];
    }
}
